angular.module( 'ambProvPrivate', [
    'templates-app',
    'templates-common',
    'ui.router.state',
    'ui.route',
    'ui.keypress',    
    //'angularFileUpload',
    'directives.dynamic.dynamic',
    'directives.breadcrumb.breadCrumb',
    'directives.progressbar.progressBar',
    'directives.customvalidation.customValidationTypes',
    'directives.invalidinputformatter.invalidInputFormatter',
    'directives.inlineinputlabel.inlineInputLabel',
    'directives.focusme.focusMe',
    'ngIdle',
    'directives.alerts.alerts',
    'directives.formbuilder.fielddirective.fieldDirective',
    'directives.formbuilder.formdirective.formDirective',
    'ambProvPrivate.home',
    'ambProvPrivate.about',
    'ambProvPrivate.payers',
    'ambProvPrivate.worklist',
    'ambProvPrivate.worklist.summary',
    'ambProvPrivate.worklist.enrollment',
    'ambProvPrivate.worklist.denied',
    'ambProvPrivate.worklist.incomplete',
    'ambProvPrivate.worklist.myfollowup',
    'ambProvPrivate.worklist.rejected',
    'ambProvPrivate.worklist.submitted',
    'ambProvPrivate.admin.account',
    'ambProvPrivate.admin.providers',
    'ambProvPrivate.admin.user.management.userManagement',
    'ambProvPrivate.admin.user.createuser.createUser',
    'ambProvPrivate.admin.user.edituser.editUser',
    'ambProvPrivate.help.createsupportticket.createSupportTicket',
    'ambProvPrivate.claimsSearch',
    'ambProvPrivate.remitSearch',
    'ambProvPrivate.remitPaymentDetails',
    'ambProvPrivate.enrollment',
    'services.errorService',
    'ambProvPrivate.chat',
    'ambProvPrivate.nochatLink',
    'ambProvPrivate.admin.user.mysettings',
    'ambProvPrivate.dirtyFilter',
    'ambProvPrivate.claims.createClaim',
    'ambProvPrivate.reports.payer.reports',
    'ambProvPrivate.reports.relayHealth.reports',
    'ambProvPrivate.claims1500'
])

.config( function myAppConfig ( $stateProvider, $urlRouterProvider, $httpProvider, $idleProvider, $keepaliveProvider) {
    // Setting Content-Type for DELETE method, this alone will not work need to pass an empty data object with the request
    // Refer to https://github.com/angular/angular.js/issues/2149
    $httpProvider.defaults.headers["delete"] = {'Content-Type': 'application/json;charset=utf-8'};
    $httpProvider.responseInterceptors.push('errorService');
    $urlRouterProvider.otherwise( '/home' );

    $idleProvider.idleDuration(1500);
    $idleProvider.warningDuration(0);
    $keepaliveProvider.interval(10);
})

.controller( 'AppCtrl', function AppCtrl ( $scope, privatesiteService, $location, $window, $http, $state, $modal, $rootScope ) {
        $scope.isAdmin = false;
        var rfidCallback = function(data){
            $scope.rfidURL = data;
        };
        privatesiteService.getUserInfo()
        .success(function(data){
            $scope.userInfo = data;
            $rootScope.userInfo = {};
            $rootScope.userInfo.userID =  $scope.userInfo.user.customerID;
            if ($scope.userInfo.user.analyticsEnabled === true){
                privatesiteService.getRFIDURL( rfidCallback );
            }

        })
        .error(function(data, status, headers, config) {
            console.log(data);
        });


        $scope.$on('$stateChangeSuccess', function(event, toState, toParams, $idle, fromState, fromParams){
        });

        $scope.go = function ( path ) {
            $state.go(path);
        };

        $scope.events = [];
    // BEGIN NG-IDLE CODE 
        $scope.$on('$idleStart', function() {
                $scope.events.push({event: '$idleStart', date: new Date()});                                     
        });

        $scope.$on('$idleEnd', function() {
            // not sure why we need $apply here but not the others
            $scope.$apply(function() {
                $scope.events.push({event: '$idleEnd', date: new Date()});
            });
        });

        $scope.$on('$idleWarn', function(e, countdown) {
        });

        $scope.$on('$idleTimeout', function() {
            testDate = new Date().toTimeString();
            console.log( 'timeout:  ' + testDate );
            $window.location.href='../account/logout.html';
        });

        $scope.$on('$keepalive', function() {
            $scope.$apply(function() {});                                      
        });
    // END NG-IDLE CODE

        $scope.openCreateClaim = function(){
            $modal.open({
                templateUrl: 'claims/create/createClaim.tpl.html',
                controller: 'CreateClaimCtrl'
            });

            return false;
        };
          
})
.run(function($rootScope, $idle, $log, $keepalive){
        $idle.watch();

        Date.prototype.toAPPDateString = function(){
            var d = this.getDate();
            var m = this.getMonth() + 1;
            var y = this.getFullYear();
            return "".concat((m<=9 ? '0' + m : m),"-",(d <= 9 ? '0' + d : d),"-",y);
        };

        // parse a date in mm-dd-yyyy format
        Date.parseAPPDateString = function(dateString){
            try{
                var parts = dateString.split('-');
                return new Date(parts[2], parts[0]-1, parts[1]);
            } catch(err){
                throw "Supported date format is: mm-dd-yyyy.";
            }
        };

        //including native support for forEach for ie8
        if ( !Array.prototype.forEach ) {
            Array.prototype.forEach = function(fn, scope) {
                for(var i = 0, len = this.length; i < len; ++i) {
                    fn.call(scope, this[i], i, this);
                }
            };
        }
})
;

var baseSvcUrl = '/privateApi';