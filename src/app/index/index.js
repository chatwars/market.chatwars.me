(function(angular){
    "use strict";
    angular.module('cwm')
        .controller('indexCtrl', IndexCtrl);
    function IndexCtrl($scope, $stateParams, $mdToast, StaticService, $mdSidenav){
        var ctrl = this;
        ctrl.page = $stateParams.id || 1;

        ctrl.data = [];
        ctrl.selected = [];
        ctrl.filterByItems = [];
        ctrl.names = [];
        ctrl.items = [];
        ctrl.selectedItem = null;
        ctrl.searchText = null;

        ctrl.filter = {
            options: {
                debounce: 500
            }
        };

        ctrl.query = {
            filter: '',
            order: '-issuedAt',
        };

        ctrl.pagination = {
            label: {page: 'Страница:', rowsPerPage: 'Записей на странице:', of: 'из'},
            count: 0,
            page: 1,
            limit: 50
        };

        ctrl.options = {
            rowSelection: true,
            multiSelect: true,
            autoSelect: true,
            decapitate: false,
            largeEditDialog: false,
            boundaryLinks: false,
            limitSelect: true,
            pageSelect: true
        };

        ctrl.logic = false;
        ctrl.logicText = {
            true: 'Все предметы',
            false: 'Любой предмет'
        };

        // реквест данных
        ctrl.promise = (ctrl.page) ? StaticService.local() : StaticService.full();

        ctrl.promise.then(function(reply) {
            ctrl.data = reply.data;
            ctrl.pagination.count = reply.data.length;
            _.forEach(reply.data, function(obj, idx) {
                var items = _.merge({}, obj.leftToRight, obj.rightToLeft);
                _.forEach(items, function(cnt, item) {
                    ctrl.items.push(item);
                });
            });
            ctrl.items = _.uniq(ctrl.items);
        });

        ctrl.filterItem = function(item) {
            if (ctrl.filterByItems.length >= 5) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Разрешено не более 5 предметов')
                        .position("top right")
                        .hideDelay(3000)
                        .parent("#toast-container")
                );
                return;
            }
            if (_.indexOf(ctrl.filterByItems, item) == -1) {
                ctrl.filterByItems.push(item)
            }
        };

        ctrl.querySearch = function(query) {
            var results = query ? _.filter(ctrl.items, function(o) {
                return (o.toLowerCase().indexOf(query.toLowerCase()) > -1)
            }) : [];
            return results;
        };

        ctrl.clearFilter = function() {
            ctrl.query.filter = '';
        };

        ctrl.focus = function(ev) {
            if (!angular.element(ev.target).hasClass('md-focused')) {
                angular.element(ev.target).find('input').focus();
            }
        }

        ctrl.toggleSidenav = function () {
            $mdSidenav('left').toggle();
        };
    }

})(angular);