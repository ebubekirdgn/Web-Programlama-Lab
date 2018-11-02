var app = angular.module('kisiModul', []);

app.controller('listeController', function ($scope, $http) {
    $http.post('/list')
        .then(function (res) {
            $scope.persons = res.data.persons;
        }, function (e) {
            console.error(e);
        });

    $scope.sil = function (item) {
        $scope.persons.splice($scope.persons.indexOf(item), 1)
        $http.post('/sil', { id: item.Id });
    }
});

