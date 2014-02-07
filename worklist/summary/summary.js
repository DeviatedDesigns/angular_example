angular.module( 'ambProvPrivate.worklist.summary', [
        'ui.router.state',
        'worklistService',
        'privatesiteService',
        'ui.bootstrap',
        'ngGrid',
        'ui.event',
        'directives.dynamic.dynamic'
    ])

    .config(function config( $stateProvider ) {
        $stateProvider
            .state( 'worklist.summary', {
                url: '/summary',
                views: {
                    "worklist": {
                        controller: 'WorklistSummaryCtrl',
                        templateUrl: 'worklist/summary/summary.tpl.html'
                    }
                },
                data: {
                    pageTitle: "Worklist Summary All"
                }
            });
    })

    .controller( 'notesModalContent', function notesModalContent($compile, $scope, $state, $modal, $modalInstance, worklistService, notesData ) {

        $scope.noteAvailible = notesData.noteAvailible;
        $scope.noteData = notesData.noteData;
        notesCount = notesData.notesCount;
        taskID = notesData.taskID;
        newNoteAdded = false;
        noteTextArea =  angular.element("textarea");

        // Notes - Populate table with data
        var worklistNoteData = function(data){
            $scope.noteData = data;
        };
        var noteErrorData = function(status, data){
            $scope.noteError = true;
            $scope.noteInput = false;
            $scope.noteAvailible = false;
            $scope.noteMSG = "There was an error: " + status + " " + data.message;
        };

        if ( notesCount > 0){
            $scope.noteAvailible = true;
            worklistService.getNotes( taskID, worklistNoteData, noteErrorData );
        }else{
            $scope.noteAvailible = false;
        }

        $scope.closeModal = function () {
            $scope.noteObjNull = false;
            $scope.noteError = false;
            $scope.note = undefined;
            $modalInstance.dismiss('cancel');
            if (newNoteAdded === true){
                location.reload();
            }
        };
        $scope.console = function(){
            console.log($scope.note);
        };
        //open note text area
        $scope.addNewNote = function(){
            $scope.noteInput = true;
            $scope.noteError = false;
            $scope.noteAvailible = false;
            $scope.noteObjNull = false;
            $scope.note = undefined;
        };
        //cancel note
        $scope.cancelNewNote =  function(data){
            $scope.noteInput = false;
            $scope.note = null;
            if ( notesCount > 0){
                $scope.noteAvailible = true;
            }else{$scope.noteAvailible = false;}
        };

        //refresh notes
        var addNoteData = function(data){
            $scope.noteInput = false;
            $scope.noteAvailible = true;
            newNoteAdded = true;
            notesCount++;
            worklistService.getNotes( taskID, worklistNoteData, noteErrorData );
        };

        //save note
        $scope.saveNote = function(note){
            if (note !== undefined){
                var noteObj = {};
                noteObj.taskID = taskID;
                noteObj.note = note,
                    noteObj.noteId = null,
                    noteObj.createdBy = userID,
                    noteObj.createDate = null,
                    worklistService.addNote( noteObj, addNoteData, noteErrorData );
            }else{
                $scope.noteObjNull = true;
            }
        };
    })


    .controller( 'WorklistSummaryCtrl', function WorklistSummaryCtrl($compile, $scope, $state, worklistService, privatesiteService, $modal, $rootScope) {

        var worklistdata = function( data ){
            $rootScope.workListData = data;
            $rootScope.workListError = null;
            for ( var i=0;i<$scope.workListData.records.length;i++ )
            {
                if ( $scope.workListData.records[i].notesCount > 0 ){
                    $scope.workListData.records[i].noteAvailible = true;
                }else{
                    $scope.workListData.records[i].noteAvailible = false;
                }
            }

        };

        var errorCallback = function( status, data){
            $rootScope.error = true;
            $rootScope.errormessage = "There was a " + status + " error: " + data.message;
        };

        worklistService.getWorkListSummary( worklistdata, errorCallback );

/////// NOTES FUNCTIONALITY

        $scope.openModal = function (record) {
            var userID = null;
            getUserId(userID);

            $modal.open({
                templateUrl: 'worklist/notesModalContent.tpl.html',
                controller:'notesModalContent',
                resolve: {
                    // pass code to dialog here
                    notesData:function () {
                        return {taskID: record.taskId, notesCount: record.notesCount;, userID: userID, noteAvailible: $scope.noteAvailible, noteData: $scope.noteData};
                    }
                }
            });
        };

        //Get User ID
        function getUserId(userID){
            privatesiteService.getUserInfo().success(function(data){
                userID = data.userName;
                return userID;
            });
        }

/////// END NOTES FUNCTIONALITY

///// Close Worklist Task
        var closeWorklistTaskSuccess = function(data){
            if (data === "Changes have been saved") {
                worklistService.getWorkListSummary( worklistdata, errorCallback );
                location.reload();
            }
        };

        $scope.closeTask = function(worklistTask){
            worklistService.deleteWorklistTask( worklistTask, closeWorklistTaskSuccess, errorCallback);
        };
///// END Close Worklist Task

///// GRID

        var topLeftPad  =   '<div style="padding-left:10px;margin-top:15px;color:#eb242b;white-space: nowrap !important;-ms-text-overflow: ellipsis !important;-o-text-overflow: ellipsis !important;text-overflow: ellipsis !important;overflow: hidden !important;"> {{row.getProperty(col.field)}} </div>';
        var topPad      =   '<div style="margin-top:15px;white-space: nowrap !important;-ms-text-overflow: ellipsis !important;-o-text-overflow: ellipsis !important;text-overflow: ellipsis !important;overflow: hidden !important;"> {{row.getProperty(col.field)}} </div>';

        var follwUpDate =  '<div class="ngCellText clearfix followUpD">'+
            '<div class="input-group">'+
            '<input type="text" class="form-control input-extra-mini" style="margin-top:7px;" type="text" data-date-format="mm-dd-yyyy" min="12-25-2013"   placeholder="mm-dd-yyyy" maxlength="10" name="followupText" value="{{row.getProperty(col.field)}}"  ng-model="row.entity.followUpDate" ng-change="saveFollowUp(row.entity)" originalDate="{{row.entity}}" ui-event="{ focus : \'saveOriginalDate(row.entity)\', blur : \'checkDateOnBlur(row.entity)\' }" bs-datepicker/><span class="input-group-btn"><button class="btn btn-default" type="button" ng-click="deleteFollowUp(row.entity)" title="delete follow up date"> x </button></span>'+
            '<span class="notesIcons" ng-show="!row.getProperty(\'noteAvailible\')" ng-click="openModal(row.entity)"><img src="assets/images/notesicon.png"/></span>'+
            '<span class="notesIcons" ng-show="row.getProperty(\'noteAvailible\')" ng-click="openModal(row.entity)"><img src="assets/images/newnotesicon.png"/></span>'+
            '</div>'+
            '</div>';

        var actionTools =   '<div class="ngCellText cellButton">' +
            '<button class="rhButton" ng-click="refresh()"> Work </button><br>'+
            '<button class="rhButton" ng-click="closeTask(row.entity)"> Close </button>'+
            '</div>';

        var colDefs = [
            {field:'status',displayName:"Status", width:85, cellTemplate: topLeftPad},
            {field:'payer',displayName: "Payer", width:80, cellTemplate: topPad},
            {field:'provider',displayName: "Provider", width:100, cellTemplate: topPad},
            {field:'patientName',displayName: "Patient Name", width:100, cellTemplate: topPad},
            {field:'dateOfService',displayName: "Svc Date", width:85, cellTemplate: topPad},
            {field:'amount',displayName: "Amount", width:70, cellTemplate: topPad},
            {field:'lastUpdate',displayName: "Last Update", width:85, cellTemplate: topPad},
            {field:'followUpDate',displayName: "Follow Up", cellClass:'followup center', cellTemplate:follwUpDate, width:113},
            {field:'actions',displayName: "", cellTemplate: actionTools, cellClass:'center', width:65, sortable: false, resizable: false}
        ];

        $scope.gridOptions = {
            data: 'workListData.records',
            enableRowSelection: false,
            enableCellSelection: true,
            multiSelect: false,
            columnDefs : colDefs,
            rowHeight: 70,
            enableColumnResize : true,
            plugins: [filterBarPlugin],
            sortInfo:{ fields: ['status'], directions: ['asc'] },
            headerRowHeight: 45, // give room for filter bar
            rowTemplate:    '<div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}" ng-style="{height: rowHeight-10}">' + 
                                '<div class="ngVerticalBar" ng-class="{ ngVerticalBarVisible: !$last }"> &nbsp; </div> <div ng-cell ng-style="{height: rowHeight-20}" style="" ></div>'+
                            '</div>'+
                            '<div style="position: absolute;margin-top:-15px !important;left: 5px;font-size: 10pt;" ng-style="{top: rowHeight-20}"  ng-show="row.getProperty(\'status\')==\'Rejected\' || row.getProperty(\'status\')==\'Denied\'">'+
                                '<span style="font-family:Myriad-Pro !important; color:#797b7b !important; margin-left:5px;">{{row.getProperty("comment")}}</span>'+
                            '</div> '
        };

        $scope.expand = function(row){
            if(this.hideNested !== true){
                this.options = {data:"records", columnDefs :[{field:'name',displayName: "name"}, {field:'value',displayName: "age"}]};
                this.records = [{name:"bob", value:"3"}];
                this.nested = '<div class="gridStyle" ng-grid="options"></div>';
                this.hideNested = true;
                return;
            }
            this.hideNested = false;
            this.nested = "";
        };

        var saveFollowUpSuccess = function(data){
            if (data === "Changes updated") {
                console.log( data );
            }
        };

        function getDatebyTaskId(taskId){
            followUpDate = "";

            for (var i in $scope.workListData.records){
                if ($scope.workListData.records[i].taskId === taskId) {
                    $scope.workListData.records[i].followUpDate = originalDate;
                }
            }
            return followUpDate;
        }
        $scope.saveDate = [];

        $scope.saveOriginalDate = function(worklistTask){
            $rootScope.error = null;
            originalDate = worklistTask.followUpDate;

            console.log( originalDate );
        };

        $scope.checkDateOnBlur = function(worklistTask){
            if(worklistTask.followUpDate !== null ) {

                dateformat = /^[0,1]?\d{1}\/(([0-2]?\d{1})|([3][0,1]{1}))\/(([1]{1}[9]{1}[9]{1}\d{1})|([2-9]{1}\d{3}))$/;

                if ( dateformat.test( worklistTask.followUpDate ) ) {
                    console.log('valid');
                } else {
                    console.log('invalid');
                    $rootScope.error = true;
                    $rootScope.errormessage = "You have entered an invalid date. Please try again.";
                    worklistTask.followUpDate = originalDate;
                }
            }
        };

        $scope.saveFollowUp = function(worklistTask){
            $rootScope.error = null;
            if (worklistTask.followUpDate !== null && worklistTask.followUpDate !== undefined){
                today = new Date();
                worklistTask.followUpDate = new Date( worklistTask.followUpDate.getTime() + worklistTask.followUpDate.getTimezoneOffset() * 60 * 1000);

                if ( worklistTask.followUpDate > today ) {
                    worklistTask.followUpDate = worklistTask.followUpDate.toAPPDateString();
                    worklistService.saveFollowUpDate( worklistTask, saveFollowUpSuccess, errorCallback);
                } else {
                    $rootScope.error = true;
                    $rootScope.errormessage = "Follow-up date must be a future date.";
                    worklistTask.followUpDate = originalDate;
                }
            } else{ 
                console.log("date is null"); //return true; 
            }
        };
        
        $scope.deleteFollowUp = function( worklistTask ){
            if (worklistTask.followUpDate !== null && worklistTask.followUpDate !== undefined){
                worklistTask.followUpDate = null;
                worklistService.saveFollowUpDate( worklistTask, saveFollowUpSuccess, errorCallback );
            }
        };


    });