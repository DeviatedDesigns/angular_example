angular.module( 'privatesiteService', [])

    .factory( 'privatesiteService', [ '$http', function ( $http ) {

        var privatesiteService = {

            getUserInfo: function( successCallback, errorCallback ){
                return $http( {
                    url: baseSvcUrl + "/userInfo",
                    method: "GET"
                });
            },

            getCleanFeatureList: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/features-clean',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },

            getFeatureList: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/features',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },

            applyPromo: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/features/'+encodeURIComponent(data),
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },

            saveFeatures: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/features',
                    method: "POST",
                    data: data
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },

            cancelServices: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/cancelService',
                    method: "DELETE",
                    data: data
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },

            getCustomerDemograph: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/customer',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },

            saveCustomerDemograph: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/customer',
                    method: "POST",
                    data: data
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },


            getPayerCSV: function(){
                return $http( {
                    url: baseSvcUrl + '/providerManagement/providerCSV',
                    method: "GET"
                });
            },

            getPayersProducts: function( data, successCallback, errorCallback, tracker){
                $http( {
                    url: baseSvcUrl + '/payer/getPayerList?'+ data,
                    method: "GET",
                    tracker: tracker
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },

            getPayersCSV: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/payer/exportPayerCSV?'+ data,
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },

            addPayerToFav: function( data, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/payer/createFavPayer',
                    method: "POST",
                    data: data
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },

            newClaim: function( claim ){
                return $http( {
                    url: baseSvcUrl + '/rtcedits/newClaim',
                    method: "POST",
                    data: claim
                });
            },
            
            retrieveClaim :function( internalClaimID, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/rtcedits/retrieveClaim?internalClaimID='+ internalClaimID,
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },

            deletePayerToFav: function( data, emptyOBJ, successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/payer/deleteFavPayer/' + data,
                    method: "DELETE",
                    data: emptyOBJ
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },
            getAudit: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/audit/summary',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },

            getPaymentScreen: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/payment',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },
            getSummary: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/admin/showsummary',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },
            getSupportAreas: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/supportarea/chat',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            },
            getPayers: function(){
                return $http( {
                    url: baseSvcUrl + '/claims/getFavPayers',
                    method: "GET"
                });
            },
            getActiveProviderNPIS: function(){
                return $http( {
                    url: baseSvcUrl + '/claims/getActiveProviderNPIS',
                    method: "GET"
                });
            },
            getRFIDURL: function( successCallback, errorCallback ){
                $http( {
                    url: baseSvcUrl + '/analytics/analyticsUrl',
                    method: "GET"
                })
                    .success(function(data) {
                        successCallback(data);
                    });
            }          
        };
        return privatesiteService;
    } ] ) ;