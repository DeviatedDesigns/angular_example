describe('app.common.services.privatesiteService', function () {
    var $httpBackend, baseServiceUrl, privatesiteService, successCallback, errorCallback;
    
    describe('test service method cancelServices', function () {
        beforeEach(function() {
        
            module('privatesiteService');
            
            baseServiceUrl = baseSvcUrl;
            
            inject(function ($injector){
                $httpBackend = $injector.get('$httpBackend');
                privatesiteService = $injector.get('privatesiteService');
            });
            
            successCallback = jasmine.createSpy('successCallback');
            errorCallback = jasmine.createSpy('errorCallback');
        });
        
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
        
        it('make successcallback called on invoking cancelServices', function () {
            var data = {};
            $httpBackend.expectDELETE(baseServiceUrl + '/admin/cancelService').respond(200, {statusMsg: "Service cancelled successfully."});
            privatesiteService.cancelServices(data, successCallback, errorCallback);
            $httpBackend.flush();
            expect(successCallback).toHaveBeenCalledWith({statusMsg: "Service cancelled successfully."});
        });
    });    
    
    describe('test service method getSummary', function () {
        beforeEach(function() {
        
            module('privatesiteService');
            
            baseServiceUrl = baseSvcUrl;
            
            inject(function ($injector){
                $httpBackend = $injector.get('$httpBackend');
                privatesiteService = $injector.get('privatesiteService');
            });
            
            successCallback = jasmine.createSpy('successCallback');
            errorCallback = jasmine.createSpy('errorCallback');
        });
        
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
        
        it('make successcallback called on invoking getSummary', function () {
            var data = {};
            $httpBackend.expectGET(baseServiceUrl + '/admin/showsummary').respond(200, {});
            privatesiteService.getSummary(successCallback, errorCallback);
            $httpBackend.flush();
            expect(successCallback).toHaveBeenCalledWith({});
        });
        
        it('make successcallback called on invoking getSupportAreas', function () {
            var data = {};
            $httpBackend.expectGET(baseServiceUrl + '/supportarea/chat').respond(200, {});
            privatesiteService.getSupportAreas(successCallback, errorCallback);
            $httpBackend.flush();
            expect(successCallback).toHaveBeenCalledWith({});
        });
    });    
});