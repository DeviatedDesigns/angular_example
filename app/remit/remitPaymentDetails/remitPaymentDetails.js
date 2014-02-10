angular.module( 'ambProvPrivate.remitPaymentDetails', [
        'ui.router',
        'ajoslin.promise-tracker',
        "remitService"
    ])

    .config(function config( $stateProvider ) {
        $stateProvider
            .state( 'remitClaimPaymentDetails', {
                url: '/remitClaimPaymentDetails?billingId&transactionId&transactionClaimID',
                data: {
                    crumb: 'Claim Payment Details',
                    crumbHierarchy: [ 'home', 'remitsearch' , 'remitsearchresults', 'remitdetails' ]
                },
                views: {
                    "main": {
                        controller: 'RemitPaymentDetailsCtrl',
                        templateUrl: 'remit/remitPaymentDetails/remitPaymentDetails.tpl.html'
                    }
                }
            });
    })


    .controller( 'RemitPaymentDetailsCtrl', function RemitPaymentDetailsCtrl( $scope, $state, $stateParams, $route, promiseTracker, remitService, $modal ) {

        $scope.claimCollapsed = false;
        $scope.claimNo = "";
        $scope.allLinesCollapsed = true;

        $scope.collapseAll = function() {
            $scope.allLinesCollapsed = !$scope.allLinesCollapsed;
            for( var i=0; i < $scope.claimPaymentDtls.serviceLineAdjustments.length ; i++ ) {
                $scope.claimPaymentDtls.serviceLineAdjustments[i].collapsed = $scope.allLinesCollapsed;
            }
        };

        var billingId = $stateParams.billingId;
        var transactionId = $stateParams.transactionId;
        var transactionClaimID = $stateParams.transactionClaimID;

        $scope.gotoClaim = function( clmId ) {
            $state.transitionTo('myclaims.claimsSearchClaim.summary', { clmId: clmId });

        };


        var remitClaimPaymentCallback = function(data){
            if( data.claimAdjustments == null || data.claimAdjustments.length === 0 ){
                $scope.claimNo = "No ";
                $scope.claimCollapsed = true;
            }
            for( var i=0; i < data.serviceLineAdjustments.length ; i++ ) {
                data.serviceLineAdjustments[i].collapsed = $scope.allLinesCollapsed;
            }
            $scope.claimPaymentDtls = data;
        };

        var errorCallback = function( status, data ){
            $scope.errormessage = data;
            console.log( status + " -> " + data );
        };

        $scope.remPayDetail = promiseTracker('remPayDetail');
        claimPaymentURL =   "billingId=" + billingId + "&transactionId=" + transactionId + "&transactionClaimID=" + transactionClaimID;
        remitService.getRemitClaimPaymentDtls( claimPaymentURL, remitClaimPaymentCallback, errorCallback, 'remPayDetail');

        $scope.openEOBModal = function () {
            $modal.open({
                templateUrl: 'remit/remitDetails/viewEOBModalContent.tpl.html',
                controller:'eobModalContent',
                resolve: {
                    // pass code to dialog here
                    EOBData:function () {
                        return {eobData: $scope.claimPaymentDtls};
                    }
                }
            });
        };

    })
    .controller( 'eobModalContent', function notesModalContent($compile, $scope, $state, $modal, $modalInstance, EOBData ) {

        $scope.claim = EOBData.eobData.claimInformation.claim;
        $scope.remit = EOBData.eobData.claimInformation.remitInfo;
        $scope.adjust = EOBData.eobData.claimAdjustments;
        $scope.service =  EOBData.eobData.serviceLineAdjustments;
        $scope.day = new Date();

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };


    })
;
