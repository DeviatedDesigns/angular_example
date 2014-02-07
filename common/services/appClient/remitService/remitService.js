angular.module( 'remitService', [])
    .factory( 'remitService', [ '$http' , function ( $http ) {

        var remitService = {

            remitSearchSubmit: function(data, successCallback, errorCallback, tracker )
            {

                $http({
                        method: 'GET',
                        url: baseSvcUrl + '/remit/retrieveRemits?' + data,
                        tracker: tracker,
                        headers: {'Content-Type': 'application/json'}
                    })
                    .success(function (data) {
                        successCallback(data);
                    });
            },

            getRemitDetail: function(data, successCallback, errorCallback, tracker)
            {

                $http({
                        method: 'GET',
                        url: baseSvcUrl + '/remit/remitdetail?' + data,
                        tracker: tracker,
                        headers: {'Content-Type': 'application/json'}
                    })
                    .success(function (data) {
                        successCallback(data);
                    });
            },
            getRemitClaimPaymentDtls: function(data, successCallback, errorCallback, tracker)
            {

                $http({
                        method: 'GET',
                        url: baseSvcUrl + '/remit/remitPaymentDetail?' + data,
                        tracker: tracker,
                        headers: {'Content-Type': 'application/json'}
                    })
                    .success(function (data) {
                        successCallback(data);
                    })
                    .error(function(data, status, headers, config){
                        errorCallback(status, data);
                    })
                ;
            }
        };

        return remitService;

    } ] ) ;