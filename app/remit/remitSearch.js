angular.module( 'ambProvPrivate.remitSearch', [
        'ui.router.state',
        'placeholders',
        'ui.bootstrap',
        'ui.event',
        'privatesiteService',
        "remitService",
        'ajoslin.promise-tracker', //https://github.com/ajoslin/angular-promise-tracker/wiki
        '$strap',
        'directives.printMe',
        'services.gridService'
    ])

    .config(function config( $stateProvider ) {
        $stateProvider
            .state( 'remitsearch', {
                url: '/remitsearch',
                data: {
                    crumb: 'Remit Search',
                    crumbHierarchy: ['home']
                },
                views: {
                    "main": {
                        controller: 'RemitSearchCtrl',
                        templateUrl: 'remit/remitSearch.tpl.html'
                    }
                }
            })

            .state( 'remitsearchresults', {
                url: '/remitsearchresults',
                data: {
                    crumb: 'Search Results',
                    crumbHierarchy: [ 'home', 'remitsearch'  ]
                },
                views: {
                    "main": {
                        controller: 'RemitSearchResultsCtrl',
                        templateUrl: 'remit/remitSearchResults.tpl.html'
                    }
                }
            })

            .state( 'remitdetails', {
                url: '/remitdetails?billingId&transactionId',
                data: {
                    crumb: 'Remit Details',
                    crumbHierarchy: [ 'home', 'remitsearch' , 'remitsearchresults' ]
                },
                views: {
                    "main": {
                        controller: 'RemitDetailsCtrl',
                        templateUrl: 'remit/remitDetails/details.tpl.html'
                    }
                }
            });
   })


    // Persist tracker data between controllers
    .factory("remitSearchService", function(){
      return {
        remitSearchObject: {},
        remitDetailsObject: {},
        remitClaimPaymentDtls:{}
      };       
    })

    .controller( 'remitModalContent', function remitModalContent( $scope, $state, $modal, $modalInstance ) {
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })

    .controller( 'RemitSearchCtrl', function RemitSearchCtrl( $scope, $state, $stateParams, remitService, $timeout, remitSearchService,promiseTracker ) {

        $scope.checkDateErrorMsg = "";
        $scope.dateReceivedErrorMsg = "";


        $scope.openToDate = function() {
            $timeout(function() {
                $scope.openToDateOpened = true;
            });
        };

        $scope.openFromDate = function() {
            $timeout(function() {
                $scope.openFromDateOpened = true;
            });
        };


        $scope.openToDate2 = function() {
            $timeout(function() {
                $scope.openToDate2Opened = true;
            });
        };

        $scope.openFromDate2 = function() {
            $timeout(function() {
                $scope.openFromDate2Opened = true;
            });
        };


        $timeout(function(){
            $("input[bs-datepicker]").off("focus");
        },1000);

        $scope.showDatePicker = function(e){
            $(e.target).prev().datepicker("show");
        };

        $timeout(function(){
            $("input[bs-datepicker]").off("focus");
        },1000);



        var remitSearchCallBack = function(data){
                remitSearchService.remitSearchObject = data;
                $state.go('remitsearchresults');
        };

        var errorCallback = function(status, data){
            $scope.error = true;
            $scope.errormessage = "There was a " + status + " error: " + data.message;
        };

        // Detect Empty object
        function isEmpty(dataObj) {
            for(var key in dataObj) {
                if(dataObj.hasOwnProperty(key)){
                    return false;
                }
            }
            return true;
        }

        $scope.checkDateValidate = function(){

            if($scope.remitSearchForm.chDtTo.$dirty && $scope.remitSearchForm.chDtTo.$error.myerrorkey){
                $scope.checkDateErrorMsg = $scope.myCustomErrorMsg;
                return true;
            } else if($scope.remitSearchForm.chDtTo.$dirty && $scope.remitSearchForm.chDtTo.$error.myerrorkey2){
                $scope.checkDateErrorMsg = $scope.myCustomErrorMsg2;
                return true;
            } else if($scope.remitSearchForm.chDtFrom.$dirty && $scope.remitSearchForm.chDtFrom.$error.rangeError1){
                $scope.checkDateErrorMsg = $scope.rangeError1;
                return true;
            }

            return false;
        };


        $scope.dateReceivedValidate = function(){

            if($scope.remitSearchForm.recDtTo.$dirty && $scope.remitSearchForm.recDtTo.$error.myerrorkey){
                $scope.dateReceivedErrorMsg = $scope.myCustomErrorMsg;
                return true;
            } else if($scope.remitSearchForm.recDtTo.$dirty && $scope.remitSearchForm.recDtTo.$error.myerrorkey2){
                $scope.dateReceivedErrorMsg = $scope.myCustomErrorMsg2;
                return true;
            } else if($scope.remitSearchForm.recDtFrom.$dirty && $scope.remitSearchForm.recDtFrom.$error.rangeError2){
                $scope.dateReceivedErrorMsg = $scope.rangeError2;
                return true;
            }

            return false;
        };

        $scope.rSearch = promiseTracker('rSearch');
        $scope.remitSearchSubmitForm = function(remitSearchQuery){
            remitURL = buildURL(remitSearchQuery);
            $scope.error = false;
            remitService.remitSearchSubmit( remitURL, remitSearchCallBack, errorCallback, 'rSearch' );
        };

        //Populate Payer Object
        function buildURL(remitObj){
            var querystr = [];
            for(var key in remitObj) {
                if (remitObj.hasOwnProperty(key)) {
                  querystr.push(encodeURIComponent(key) + "=" + encodeURIComponent(remitObj[key]));
                }
            }
            return querystr.join("&");
        }
        
        $scope.getID = function(id){var doc = document; return doc.getElementById(id);};


        $scope.checkFromDateRange = function(){
            // check if fromDate is >= 2years from today

            var fromDateRange = $scope.remitSearch.querySection.chDtFrom;
            var fromDate = new Date(fromDateRange);
            var maxDate = new Date();
            var minDate = new Date();
            maxDate.setYear(maxDate.getFullYear()+2);
            minDate.setYear(minDate.getFullYear()-2);

            // check if no date entered and reset error to false.
            if(fromDateRange===null){
                $scope.remitSearchForm.chDtFrom.$dirty = false;
                $scope.remitSearchForm.chDtFrom.$error = false;
                $scope.remitSearchForm.chDtFrom.$setValidity("rangeError1", true);
                return;
            }

            // check if date is 2 years before todays date
            if((fromDate >  maxDate) || (fromDate < minDate)){
                $scope.rangeError1 = "Must be within 2 years.";
                $scope.remitSearchForm.chDtFrom.$dirty = true;
                $scope.remitSearchForm.chDtFrom.$setValidity("rangeError1", false);

            } else {
                $scope.remitSearchForm.chDtFrom.$dirty = false;
                $scope.remitSearchForm.chDtFrom.$setValidity("rangeError1", true);

            }
        };

        $scope.checkRange = function(){

            var toDateRange = $scope.remitSearch.querySection.chDtTo;
            var fromDateRange = $scope.remitSearch.querySection.chDtFrom;
            var toDate = new Date(toDateRange);
            var fromDate = new Date(fromDateRange);
            var timeGap = Math.abs(toDate.getTime() - fromDate.getTime());
            var diff = timeGap/(1000 * 60 * 60 * 24);

            // check if no date entered and reset error to false.
            if(toDateRange===null){
                $scope.remitSearchForm.chDtTo.$dirty = false;
                $scope.remitSearchForm.chDtTo.$invalid = false;
                $scope.remitSearchForm.chDtTo.$error = false;
                $scope.remitSearchForm.chDtTo.$setValidity("myerrorkey", true);
                $scope.remitSearchForm.chDtTo.$setValidity("myerrorkey2", true);
            }

            if(diff>=31){
                $scope.myCustomErrorMsg = "Must be within 30 days";
                $scope.remitSearchForm.chDtTo.$dirty = true;
                $scope.remitSearchForm.chDtTo.$invalid = true;
                $scope.getID("chDtTo").setAttribute("required","true");
                $scope.remitSearchForm.chDtTo.$setValidity("myerrorkey", false);

            } else if(toDate<fromDate){
                $scope.myCustomErrorMsg2 = "Cannot be before From Date.";
                $scope.remitSearchForm.chDtTo.$dirty = true;
                $scope.remitSearchForm.chDtTo.$invalid = true;
                $scope.remitSearchForm.chDtTo.$setValidity("myerrorkey2", false);
                $scope.getID("chDtTo").setAttribute("required","true");
            } else {
                $scope.remitSearchForm.chDtTo.$dirty = false;
                $scope.remitSearchForm.chDtTo.$invalid = false;
                $scope.remitSearchForm.chDtTo.$setValidity("myerrorkey", true);
                $scope.remitSearchForm.chDtTo.$setValidity("myerrorkey2", true);
            }
        };

        $scope.checkReceiveFromDateRange = function(){
            // check if fromDate is >= 2years from today

            var fromDateRange = $scope.remitSearch.querySection.recDtFrom;
            var fromDate = new Date(fromDateRange);
            var maxDate = new Date();
            var minDate = new Date();
            maxDate.setYear(maxDate.getFullYear()+2);
            minDate.setYear(minDate.getFullYear()-2);

             // check if no date entered and reset error to false.
            if(fromDateRange===null){
                $scope.remitSearchForm.recDtFrom.$dirty = false;
                $scope.remitSearchForm.recDtFrom.$error = false;
                $scope.remitSearchForm.recDtFrom.$setValidity("rangeError2", true);
            }

            // check if date is 2 years before todays date
            if((fromDate >  maxDate) || (fromDate < minDate)){
                $scope.rangeError2 = "Must be within 2 years.";
                $scope.remitSearchForm.recDtFrom.$dirty = true;
                $scope.remitSearchForm.recDtFrom.$setValidity("rangeError2", false);

            } else {
                $scope.remitSearchForm.recDtFrom.$dirty = false;
                $scope.remitSearchForm.recDtFrom.$setValidity("rangeError2", true);

            }
        };

        $scope.checkReceiveRange = function(){

            var toDateRange = $scope.remitSearch.querySection.recDtTo;
            var fromDateRange = $scope.remitSearch.querySection.recDtFrom;
            var toDate = new Date(toDateRange);
            var fromDate = new Date(fromDateRange);
            var timeGap = Math.abs(toDate.getTime() - fromDate.getTime());
            var diff = timeGap/(1000 * 60 * 60 * 24);

            // check if no date entered and reset error to false.
            if(toDateRange===null){
                $scope.remitSearchForm.recDtTo.$dirty = false;
                $scope.remitSearchForm.recDtTo.$invalid = false;
                $scope.remitSearchForm.recDtTo.$error = false;
                $scope.remitSearchForm.recDtTo.$setValidity("myerrorkey", true);
                $scope.remitSearchForm.recDtTo.$setValidity("myerrorkey2", true);
            }

            if(diff>=31){
                $scope.myCustomErrorMsg = "Must be within 30 days";
                $scope.remitSearchForm.recDtTo.$dirty = true;
                $scope.remitSearchForm.recDtTo.$invalid = true;
                $scope.getID("recDtTo").setAttribute("required","true");
                $scope.remitSearchForm.recDtTo.$setValidity("myerrorkey", false);

            } else if(toDate<fromDate){
                $scope.myCustomErrorMsg2 = "Cannot be before From Date.";
                $scope.remitSearchForm.recDtTo.$dirty = true;
                $scope.remitSearchForm.recDtTo.$invalid = true;
                $scope.remitSearchForm.recDtTo.$setValidity("myerrorkey2", false);
                $scope.getID("recDtTo").setAttribute("required","true");
            } else {
                $scope.remitSearchForm.recDtTo.$dirty = false;
                $scope.remitSearchForm.recDtTo.$invalid = false;
                $scope.remitSearchForm.recDtTo.$setValidity("myerrorkey", true);
                $scope.remitSearchForm.recDtTo.$setValidity("myerrorkey2", true);
            }
        };
        $scope.cancel = function(){
            window.location.reload();
        };
    })

    .controller( 'RemitSearchResultsCtrl', function RemitSearchResultsCtrl( $scope, $state, $stateParams, $route, $routeParams, remitService, $timeout, $modal, modalService, remitSearchService, promiseTracker) {
        $scope.rSearchResults = promiseTracker('rSearchResults');
        $scope.remitData = remitSearchService.remitSearchObject;

        var remitDetailsCallback = function(data){
            remitTransId = data.remitDetailResponseExtended.remitInfo.transactionID;
            remitBillingId = data.remitDetailResponseExtended.remitInfo.billingID;
            remitSearchService.remitDetailsObject = data;
            $state.go('remitdetails', {billingId: remitBillingId, transactionId:remitTransId });
        };

        var errorCallback = function(status, data){
            $scope.error = true;
            $scope.errormessage = "There was a " + status + " error: " + data.message;
        };

        $scope.remitDetails = function (row){
            remitObj = {};
            remitObj.billingId = row.getProperty("billingId");
            remitObj.transactionId = row.getProperty("transactionId");
            remitURL = buildURL(remitObj);
            remitService.getRemitDetail( remitURL, remitDetailsCallback, errorCallback, 'rSearchResults');
        };

        //Populate Payer Object
        function buildURL(remitObj){
            var querystr = [];
            for(var key in remitObj) {
                if (remitObj.hasOwnProperty(key)) {
                  querystr.push(encodeURIComponent(key) + "=" + encodeURIComponent(remitObj[key]));
                }
            }
            return querystr.join("&");
        }
        
       
        //the Remit Result Grid
        var chargeCellTemplate = '<div class="ngCellText">${{row.getProperty(col.field)}}</div>';
        var dateCellTemplate = '<div class="ngCellText">{{row.getProperty(col.field) | date:\'MM/dd/yyyy\'}}</div>';
        var datetimeCellTemplate = '<div class="ngCellText">{{row.getProperty(col.field) | date:\'MM/dd/yyyy HH:mm\'}}</div>';
        var basicCellTemplate = '<div class="ngCellText">{{row.getProperty(col.field)}}</div>';
        var checknumberCellTemplate = '<div class="ngCellText"><a href="" ng-click="remitDetails(row)">{{row.getProperty(col.field)}}</a></div>  ';

        $scope.gridRemitResults = {
            data: 'remitData',
            plugins: [gridService.plugins.columnHeaderSearchFilter],
            enableRowSelection: false,
            multiSelect: false,
            enableSorting: true,
            enableColumnResize: true,
            sortInfo:{ fields: ['payorId'], directions: ['asc'] },
            headerRowHeight:44, 
            columnDefs:[
                {field:'payorId', displayName:'Payer ID', cellClass:'center', cellTemplate: basicCellTemplate, width:105},
                {field:'payorName', displayName:'Payer Name', cellClass:'longCell', cellTemplate: basicCellTemplate, width:195},
                {field:'checkNumber', displayName:'Check/Eft Number', cellClass:'longCell', cellTemplate: checknumberCellTemplate, width:162},
                {field:'checkDate', displayName:'Check Date', cellClass:'center', cellTemplate: dateCellTemplate, width:100},
                {field:'checkAmount', displayName:'Check Amount', cellClass: '', cellTemplate: chargeCellTemplate, width:115},
                {field:'receivedDate', displayName:'Received Date/Time', cellClass:'center', cellTemplate: datetimeCellTemplate, width:150},
                {field:'processCode', displayName:'Process Code', cellClass:'center', cellTemplate: basicCellTemplate, width:125}
            ]
        };
    })   

    .controller( 'RemitDetailsCtrl', function RemitDetailsCtrl( $scope, $state, $stateParams, $route, $routeParams, remitService, remitSearchService ) {

        var remitDetailsCallback = function(data){
            $scope.remitDetailsData = data.remitDetailResponseExtended;
            $scope.remitStatus = data.remitDetailResponseExtended.responseStatus.status;
            $scope.remitAdjust = data;            
            if ($scope.remitStatus === "ERROR"){
                remitError = {};
                remitError.message = data.remitDetailResponseExtended.responseStatus.statusMessage;
                remitError.status = data.remitDetailResponseExtended.responseStatus.statusCode;
                errorCallback( remitError.status, remitError );
            }else{
                assignScope();    
            }
                   
        };

        var errorCallback = function(status, data){
            $scope.error = true;
            $scope.errormessage = "There was a " + status + " error: " + data.message;
        };

        //get Remit Data
        if ( isEmpty(remitSearchService.remitDetailsObject) ){
            remitObj = {};
            remitObj.billingId = $stateParams.billingId;
            remitObj.transactionId = $stateParams.transactionId;
            remitURL = buildURL(remitObj);
            remitURL =  "billingId=" + $stateParams.billingId +
                        "&transactionId=" + $stateParams.transactionId;
            remitService.getRemitDetail( remitURL, remitDetailsCallback, errorCallback );
        }else {
            $scope.remitDetailsData = remitSearchService.remitDetailsObject.remitDetailResponseExtended;  
            $scope.remitAdjust = remitSearchService.remitDetailsObject;
            assignScope();
        }

        //Populate Payer Object
        function buildURL(remitObj){
            var querystr = [];
            for(var key in remitObj) {
                if (remitObj.hasOwnProperty(key)) {
                  querystr.push(encodeURIComponent(key) + "=" + encodeURIComponent(remitObj[key]));
                }
            }
            return querystr.join("&");
        }

        function assignScope() {
            $scope.remitClaims = $scope.remitDetailsData.claims.claim;
            $scope.remitInfo = $scope.remitDetailsData.remitInfo;      
        }

        // Detect Empty object
        function isEmpty(dataObj) {
            for(var key in dataObj) {
                if(dataObj.hasOwnProperty(key)){
                    return false;
                }
            }
            return true;
        }
 
        $scope.remitCollapsed = false;
        $scope.claimCollapsed = false;

        var chargeCellTemplate = '<div class="ngCellText">${{row.getProperty(col.field)}}</div>';
        var basicCellTemplate = '<div class="ngCellText">{{row.getProperty(col.field)}}</div>';
        var rhClaimID = '<div class="ngCellText"><a href="" ng-click="claimPaymentDtls(row)">{{row.getProperty(col.field)}}</a></div>  ';

        $scope.gridRemitClaims = {
            data: 'remitClaims',
            plugins: [gridService.plugins.columnHeaderSearchFilter],
            enableRowSelection: false,
            multiSelect: false,
            enableSorting: true,
            enableColumnResize: true,
            sortInfo:{ fields: ['transactionClaimID'], directions: ['asc'] },
            headerRowHeight:44, 
            columnDefs:[
                {field:'relayHealthAssignedClaimId ', displayName:'RH Claim ID', cellClass:'center', cellTemplate: rhClaimID, width:120},
                {field:'patientInsuredID', displayName:'Insured ID', cellTemplate: basicCellTemplate, width:100},
                {field:'patientLast', displayName:'Patient Last Name', cellClass:'longCell', cellTemplate: basicCellTemplate, width:167},
                {field:'patientFirst', displayName:'Patient First Name', cellTemplate: basicCellTemplate, width:125},
                {field:'patientMiddle', displayName:'Patient Middle', cellTemplate: basicCellTemplate, width:105},                
                {field:'chargeAmount', displayName:'Total Charge', cellClass: '', cellTemplate: chargeCellTemplate, width:95},
                {field:'paidAmount', displayName:'Payment Amount', cellTemplate: chargeCellTemplate, width:120},
                {field:'', displayName:'Remit Status', cellClass:'center', cellTemplate: basicCellTemplate, width:122}
            ]
        };

        $scope.gridAdjustments= {
            data: 'remitAdjust',
            enableRowSelection: false,
            multiSelect: false,
            enableSorting: false,
            enableColumnResize: false,
            headerRowHeight:45, 
            columnDefs:[
                {field:'fiscalPeriodEnd', displayName:'Fiscal Period End', cellTemplate: rhClaimID, width:102},
                {field:'reasonCode', displayName:'Reason Code', cellTemplate: basicCellTemplate, width:102},
                {field:'adjustmentAmount', displayName:'Adjustment Amount', cellTemplate: basicCellTemplate, width:102}
            ]
        };

        // begin claimPaymentDetails

        var remitClaimPaymentCallback = function(data){
            billingId = $stateParams.billingId;
            transactionId = $stateParams.transactionId;
            transactionClaimID = remitObj.transactionClaimID;
            remitSearchService.remitClaimPaymentDtls = data;
            
            $state.go('remitClaimPaymentDetails', {billingId: billingId, transactionId: transactionId, transactionClaimID: transactionClaimID });
        };

        $scope.claimPaymentDtls = function (row){
            remitObj.transactionClaimID = row.getProperty("transactionClaimID");
            remitURL = buildURL(remitObj);
            remitService.getRemitClaimPaymentDtls( remitURL, remitClaimPaymentCallback, errorCallback, 'rSearchResults');
        };

        // end claimPaymentDetails

    })


;
