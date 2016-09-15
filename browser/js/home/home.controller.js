'use strict';

app.controller('HomeCtrl', function($scope, $log, CuisineFactory, LeftoverFactory) {

    CuisineFactory.getAll()
    .then(function(cuisines) {
        $scope.cuisines = cuisines;
    })
    .catch($log.error);

    LeftoverFactory.getAll()
    .then(function(leftovers) {
        $scope.leftovers = leftovers;
        $scope.featuredLeftovers = $scope.leftovers.slice(0, 3);
    })
    .catch($log.error);

});
