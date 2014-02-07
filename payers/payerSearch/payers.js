angular.module( 'ambProvPrivate.payers', [
        'ui.router.state',
        'privatesiteService',
        'ngGrid',
        'ui.bootstrap',
        'ui.event',
        'ajoslin.promise-tracker'
    ])

    .config(function config( $stateProvider ) {
        $stateProvider
            .state( 'payers', {
                url: '/payers',
                views: {
                    "main": {
                        controller: 'PayersSearchCtrl',
                        templateUrl: 'payers/payerSearch/payers.tpl.html'
                    }
                },
                data: {
                    pageTitle: "Payers Search"
                }
            })
            .state( 'payersResults', {
                url: '/payersResults',
                views: {
                    "main": {
                        controller: 'PayersResultsCtrl',
                        templateUrl: 'payers/payerSearch/payersResults.tpl.html'
                    }
                },
                data: {
                    pageTitle: "Payer Search Results"
                }
            });
    })

    // Persist tracker data between controllers
    .factory("payersSearchService", function(){
      return {
        payersSearchObject: {},
        payersSearchResultsObject: {}
      };       
    })

    .controller( 'myModalContent', function myModalContent( $scope, $state, $modal, $modalInstance ) {
       $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    })

    .controller( 'PayersResultsCtrl', function PayersResultsCtrl(  $scope, $state, $route, $routeParams, privatesiteService, $stateParams, $modal, payersSearchService, $rootScope){
        $scope.payerData = payersSearchService.payersSearchResultsObject;
        payerURL = payersSearchService.payersSearchObject;
        
        if ($scope.payerData.length === undefined){
           $state.go('payers');
        }

        // Payers CSV Data
        var payerCSVCallback = function (csvdata) {
            if (csvdata.length > 0){
                var encodedUri = encodeURIComponent(csvdata);
                var link = document.getElementById("export");
                link.setAttribute("href", 'data:application/ms-excel;charset=utf-8,'+ encodedUri );
                link.setAttribute("download", "payer.csv");
                link.click(); // This will download the data file named "my_data.csv".
            }
        };

        //ERROR HANDLING
        var errorCallback = function(status, data){         
            $scope.error = true;
            $scope.errormessage = "There was a " + status + " error: " + data.message;                

        };

        $scope.getCSV = function () {
            $scope.error = null;
            privatesiteService.getPayersCSV ( payerURL, payerCSVCallback, errorCallback );
        };

        $scope.openModal = function () {

            $modal.open({
                templateUrl: 'payers/payerSearch/myModalContent.tpl.html',
                controller:'myModalContent',
                resolve: {
                    // pass code to dialog here
                }
            });

        };


        $scope.editPayerFav = function ( payerFavData ){

            var addFavCallback = function() {
                payerFavData.isFavorite = true;
                console.log( 'success' );
            };        

            var deleteFavCallback = function() {
                payerFavData.isFavorite = false;
                console.log( 'success' );
            }; 

            if ( payerFavData.isFavorite !== true){
                var payerObj = {};
                payerObj.userID = $rootScope.userInfo.userID;
                payerObj.payerID = payerFavData.cpid;
                payerObj.payerName = payerFavData.payerName;
                payerObj.claimType = payerFavData.claimType;
                
                privatesiteService.addPayerToFav( payerObj, addFavCallback, errorCallback );
            }else {
                emptyOBJ = {};
                privatesiteService.deletePayerToFav( payerFavData.cpid, emptyOBJ, deleteFavCallback, errorCallback );
            }
            console.log( payerFavData );
        };
    
        var payerCheckbox = '<div class="payer_{{row.getProperty(col.field)}}"><div class="ngCellText"></div></div>';

        var isFavorite =    '<div class="payer_fav">' +
                                '<div class="ngCellText">' +
                                    '<i class="fa fa-star" ng-show="row.getProperty(\'isFavorite\')" ng-click="editPayerFav(row.entity)"></i>' +
                                    '<i class="fa fa-star-o" ng-show="!row.getProperty(\'isFavorite\')" ng-click="editPayerFav(row.entity)"></i>' +
                                '</div>' +
                            '</div>';

        var elegHeadTempl = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{\'cursor\': col.cursor}" ng-class="{\'ngSorted\': !noSortVisible }">'+
        '<div ng-click="col.sort($event)" ng-class="\'colt\' + {{col.index}}" class="ngHeaderText" style="text-align:left;">{{col.displayName}}'+
        '<button class="rhButton" type="button" ng-click="openModal()">?</button>'+
        '</div>'+
        '<div class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>'+
        '<div class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>'+
        '</div>';

        var FavHeadTempl = '<div class="ngHeaderSortColumn {{col.headerClass}}" ng-style="{\'cursor\': col.cursor}" ng-class="{\'ngSorted\': !noSortVisible }">'+
        '<div ng-click="col.sort($event)" ng-class="\'colt\' + {{col.index}}" class="ngHeaderText" style="text-align:left;">{{col.displayName}}'+
        '<div style="margin:0 0 0 26px;" class="ngSortButtonDown" ng-show="col.showSortButtonDown()"></div>'+
        '<div style="margin:0 0 0 26px;" class="ngSortButtonUp" ng-show="col.showSortButtonUp()"></div>'+
        '</div>';

        var editCellTempl = '<div><div class="ngCellText"><a href="">View</a></div></div>';



        $scope.gridOptions = {
            data: 'payerData',
            enableRowSelection: false,
            multiSelect: false,
            enableSorting: true,
            enableColumnResize: true,
            sortInfo:{ fields: ['payerName'], directions: ['asc'] },
            rowHeight: 60,
            headerRowHeight: 55, // give room for filter bar

            columnDefs:[
                {field:'isFavorite', displayName:'Fav', width:32, cellTemplate:isFavorite, cellClass:"center", resizable: false,headerCellTemplate: FavHeadTempl},                
                {field:'edit', displayName:'Edit', width:40, cellTemplate:editCellTempl, cellClass:"center", sortable: false, resizable: false},
                {field:'payerID', displayName:'Payer ID', width:75, cellClass:"center"},
                {field:'cpid', displayName:'CPID', width:55, cellClass:"center"},
                {field:'naicID', displayName:'NAIC ID', width:65, cellClass:"center"},
                {field:'payerName', displayName:'Payer Name', width:143, cellClass:"lowercase"},
                {field:'claimType', displayName:'Claim Type', width:90, cellClass:"claimType center"},
                {field:'state', displayName:'State', width:55, cellClass:"caps center"},
                {field:'secondClaims', displayName:'2nd Claims', width:55, cellClass:"secClaims center", cellTemplate: payerCheckbox},
                {field:'claimsExist', displayName:'Claims', width:62, cellTemplate: payerCheckbox, cellClass:"center"},  //, cellTemplate: payerCheckbox
                {field:'remitExist', displayName:'Remit', cellClass:"remit center", width:58, cellTemplate: payerCheckbox},
                {field:'elegExist', displayName:'Eligibility', width:80, cellTemplate: payerCheckbox, cellClass:"center"},
                {field:'claimStatusExist', displayName:'Claim Status', width:60, cellTemplate: payerCheckbox, cellClass:"center"},
                {field:'enrollmentRequired', displayName:'Enrollment Required', width:84, cellClass:"",headerCellTemplate: elegHeadTempl}
            ]
        };

    })

    .controller( 'PayersSearchCtrl', function PayersSearchCtrl(  $scope, $state, $route, $routeParams, privatesiteService, $stateParams, payersSearchService, promiseTracker){        $scope.pSearch = promiseTracker('pSearch');
        // Payers List Data
        var payerDataCallback = function (data) {
            if (data.length > 0){
                $scope.payerData = data;
                $scope.payerData.edit = "<a href=''>View</a>";
                payersSearchService.payersSearchResultsObject = $scope.payerData;
                payersSearchService.payersSearchObject = payerURL;
                $state.go('payersResults');
            }else {
                $scope.error = true;
                $scope.errormessage = "There are no results that match the search criteria.";
            }
        };

        //ERROR HANDLING
        var errorCallback = function(status, data){
            if (status === 500){
                $scope.error = true;
                $scope.errormessage = "There are no results that match the search criteria."; 
            } else{
                $scope.error = true;
                $scope.errormessage = "There was a " + status + " error: " + data.message;                
            }

        };

        $scope.searchPayers = function (payer) {

            $scope.error = null;
            
            if(isEmpty(payer)) {
                $scope.error = true;
                $scope.errormessage = "At least one filter must be selected.";
            }
            else {
                payerURL = buildURL(payer);
                privatesiteService.getPayersProducts( payerURL, payerDataCallback, errorCallback, 'pSearch');
            }

        };

        //Populate Payer Object
        function buildURL(payerObj){
            var querystr = [];
            for(var key in payerObj) {
                if (payerObj[key] === true){
                    payerObj[key] = "Yes";
                }
                if (payerObj.hasOwnProperty(key)) {
                  querystr.push(encodeURIComponent(key) + "=" + encodeURIComponent(payerObj[key]));
                }
            }
            return querystr.join("&");
        }
        
        // Detect Empty object
        function isEmpty(payerObj) {
            for(var key in payerObj) {
                if(payerObj.hasOwnProperty(key)){
                    return false;
                }
            }
            return true;
        }
        // Clear Form
        $scope.resetForm = function(){
            $scope.error = null;
            document.getElementById("payerform").reset();
            $scope.payer = {};
        };

        $scope.productState = [
            { name:'AL - Alabama', value:'AL'},
            { name:'AK - Alaska', value:'AK'},
            { name:'AZ - Arizona', value:'AZ'},
            { name:'AR  - Arkansas', value:'AR'},
            { name:'CA - California', value:'CA'},
            { name:'CO - Colorado', value:'CO'},
            { name:'CT - Connecticut', value:'CT'},
            { name:'DE - Delaware', value:'DE'},
            { name:'FL - Florida', value:'FL'},
            { name:'GA - Georgia', value:'GA'},
            { name:'HI - Hawaii', value:'HI'},
            { name:'ID - Idaho', value:'ID'},
            { name:'IL - Illinois', value:'IL'},
            { name:'IN - Indiana', value:'IN'},
            { name:'IA  - Iowa', value:'IA'},
            { name:'KS - Kansas', value:'KS'},
            { name:'KY - Kentucky', value:'KY'},
            { name:'LA - Louisiana', value:'LA'},
            { name:'ME - Maine', value:'ME'},
            { name:'MD  - Maryland', value:'MD'},
            { name:'MA - Massachusetts', value:'MA'},
            { name:'MI - Michigan', value:'MI'},
            { name:'MN - Minnesota', value:'MN'},
            { name:'MS - Mississippi', value:'MS'},
            { name:'MO - Missouri', value:'MO'},
            { name:'MT - Montana', value:'MT'},
            { name:'NE - Nebraska', value:'NE'},
            { name:'NV - Nevada', value:'NV'},
            { name:'NH  - New Hampshire', value:'NH'},
            { name:'NJ  - New Jersey', value:'NJ'},
            { name:'NM  - New Mexico', value:'NM'},
            { name:'NY - New York', value:'NY'},
            { name:'NC - North Carolina', value:'NC'},
            { name:'ND - North Dakota', value:'ND'},
            { name:'OH - Ohio', value:'OH'},
            { name:'OK - Oklahoma', value:'OK'},
            { name:'OR - Oregon', value:'OR'},
            { name:'PA - Pennsylvania', value:'PA'},
            { name:'RI - Rhode Island', value:'RI'},
            { name:'SC - South Carolina', value:'SC'},
            { name:'SD - South Dakota', value:'SD'},
            { name:'TN - Tennessee', value:'TN'},
            { name:'TX - Texas', value:'TX'},
            { name:'UT - Utah', value:'UT'},
            { name:'VT - Vermont', value:'VT'},
            { name:'VA - Virginia', value:'VA'},
            { name:'WA - Washington', value:'WA'},
            { name:'WV - West Virginia', value:'WV'},
            { name:'WI - Wisconsin', value:'WI'},
            { name:'WY - Wyoming', value:'WY'}
        ];

    })
;
