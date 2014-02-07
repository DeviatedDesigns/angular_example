angular.module('services.gridService', [
])




.factory('gridService', function(httpServiceUtil) {
    return {        
        templates: {
            defaultCellTemplate: "<span class='grid-service-defaultCellTemplate'>{{ row.getProperty(col.field) }}</span>" 
        },



        plugins: {
            doubleClickHandler: {
                init: function(scope, grid){
                    this.scope = scope;
                    this.grid = grid;
                    this.assignEvents();
                },
                scope: null,
                grid: null,
                assignEvents: function () {
                    var self = this;
                    this.grid.$viewport.on('dblclick', function(){ self.onDoubleClick(); });
                },
                onDoubleClick: function (event) {
                    this.grid.config.onDoubleClick(this.scope.selectedItems[0], event);
                }
            },
            columnHeaderSearchFilter: {
                init: function(scope, grid) {
                    var self = this;

                    self.scope = scope;
                    self.grid = grid;
                    self.applySearchBarHeaderTemplate();
                    scope.$watch(function() {
                        var searchQuery = "";
                        angular.forEach(self.scope.columns, function(col) {
                            if (col.visible && col.filterText) {
                                var filterText = (col.filterText.indexOf('*') === 0 ? col.filterText.replace('*', '') : "^" + col.filterText) + ";";
                                searchQuery += col.displayName + ": " + filterText;
                            }
                        });
                        return searchQuery;
                    }, function(searchQuery) {
                        self.scope.$parent.filterText = searchQuery;
                        self.grid.searchProvider.evalFilter();
                    });
                },
                scope: null,
                grid: null,
                applySearchBarHeaderTemplate: function () {
                    var template;

                    template = '<div class="ngHeaderSortColumn {{col.headerClass}} filter" ng-style="{\'cursor\': col.cursor}" ng-class="{\'ngSorted\': !noSortVisible }">'+
                        '</div>'+
                        '<input ng-hide="col.colDef.hideFilter" type="text" ng-click="stopClickProp($event)" placeholder="Filter by {{col.displayName}}" ng-model="col.filterText" ng-style="{ \'width\' : col.width - 14 + \'px\' }"/>'+
                        '<div ng-show="col.resizable" class="ngHeaderGrip" ng-click="col.gripClick($event)" ng-mousedown="col.gripOnMouseDown($event)"></div>';

                    angular.forEach(this.scope.columns, function (column) {
                        column.headerCellTemplate += template;
                    });

                }
            }
        }      
    };
});