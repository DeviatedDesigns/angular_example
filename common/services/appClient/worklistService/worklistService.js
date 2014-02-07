angular.module( 'worklistService', [])

    .factory( 'worklistService', [ '$http' , function ( $http ) {

        var worklistService = {

            getWorkListSummary: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/summary',
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    });
            },
            getWorkListEIP: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/enrollment',
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    });
            },
            getWorkListIncomplete: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/incomplete',
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    });
            },
            getWorkListRejected: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/rejected',
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    });
            },
            getWorkListDenied: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/denied',
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    });
            },
            getWorkListSubmittedNoResponse: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/submitted',
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    });
            },
            getWorkListFollowup: function (successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/followup' ,
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    });
            },
            deleteWorklistTask: function ( data, successCallback, errorCallback) {
                $http({
                    url: baseSvcUrl + '/workList/close',
                    method: "POST",
                    data: data
                })
                    .success(function (data) {
                        successCallback(data);
                    });
            },
            getNotes: function ( data, successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/getNotes/' + data,
                    method: "GET"
                })
                    .success(function (data) {
                        successCallback(data);
                    });
            },
            addNote: function ( data, successCallback, errorCallback) {

                $http({
                    url: baseSvcUrl + '/workList/postNotes',
                    method: "POST",
                    data: data
                })
                    .success(function (data) {
                        successCallback(data);
                    });
            },

            saveFollowUpDate: function ( data, successCallback, errorCallback) {
                $http({
                    url: baseSvcUrl + '/workList/followupitem',
                    method: "POST",
                    data: data
                })
                    .success(function (data) {
                        successCallback(data);
                    });

            }

    };

        return worklistService;

    } ] ) ;