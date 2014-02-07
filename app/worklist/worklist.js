    angular.module( 'ambProvPrivate.worklist', [
        'ui.router.state',
        'worklistService'
    ])

        .config(function config( $stateProvider ) {
            $stateProvider
                .state( 'worklist', {
                    url: '/worklist',
                    views: {
                        "main": {
                            controller: 'WorklistCtrl',
                            templateUrl: 'worklist/worklist.tpl.html'
                        },
                        data: {
                            pageTitle: "My Worklist"
                        }
                    }
                });
        })

    .controller( 'WorklistCtrl',function WorklistCtrl( $scope, $state, worklistService, $stateParams, $rootScope ) {

//        // WORKLIST REDIRECT b/c this is just a sta parent template
//        var myUrl = location.protocol + '//' + location.host + location.pathname;
//        var myUrlSummary = myUrl + '#/worklist/summary';
//        window.location = myUrlSummary;

        // var worklistdata = function (data){
        //     $scope.workListData = data;
        //     $scope.workListError = null;

        //     for (var i=0;i<$scope.workListData.records.length;i++)
        //     {
        //         if ($scope.workListData.records[i].notesCount > 0){
        //           $scope.workListData.records[i].noteAvailible = true;  
        //         }else{
        //             $scope.workListData.records[i].noteAvailible = false; 
        //         }                   
        //     }

        // };
        
        // var errorCallback = function(status, data){
        //     $rootScope.error = true;
        //     $rootScope.errormessage = "There was a " + status + " error: " + data.message;
        // };

        // worklistService.getWorkListSummary(worklistdata, errorCallback );        

        $scope.sidebarTitle = "My Worklists Summary";

        $scope.worklistSummaryLink = function displayWLSummary(myData){
            //applying css to current selected link
            document.getElementById("link1").classList.add("activelinkstyle");
            document.getElementById("link2").classList.remove("activelinkstyle");
            document.getElementById("link3").classList.remove("activelinkstyle");
            document.getElementById("link4").classList.remove("activelinkstyle");
            document.getElementById("link5").classList.remove("activelinkstyle");
            document.getElementById("link6").classList.remove("activelinkstyle");
            document.getElementById("link7").classList.remove("activelinkstyle");
            /*removed Worklist Summary title as this is where the breadcrumbs will go when coded */
            //document.getElementById("worklistmainhead").innerHTML = "Worklist Summary All";


            //Call Summary service
            worklistService.getWorkListSummary(worklistdata, errordata );
        };
    
    });