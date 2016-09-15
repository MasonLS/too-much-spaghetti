'use strict';

app.controller('LeftoverDetailCtrl', function($scope, $log, LeftoverFactory, LeftoverDetailPicsFactory, leftover) {

    LeftoverFactory.getAll()
    .then(function(leftovers) {
        $scope.leftovers = leftovers;
    })
    .catch($log.error);

    console.log("hey there");

    $scope.leftover = leftover;

    $scope.images = _.shuffle(LeftoverDetailPicsFactory);

});
