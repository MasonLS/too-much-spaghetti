'use strict';

app.controller('HomeCtrl', function($scope, $log, CuisineFactory, LeftoverFactory) {

    CuisineFactory.getAll()
    .then(function(cuisines) {
        $scope.cuisines = cuisines;
        console.log($scope.cuisines);
    })
    .catch($log.error);

    LeftoverFactory.getAll()
    .then(function(leftovers) {
        $scope.leftovers = leftovers;
    })
    .catch($log.error);

    $scope.shuffledLeftovers = $scope.leftovers.sort(function() {
        return 0.5 - Math.random();
    });

    $scope.featuredLeftovers = $scope.shuffledLeftovers.slice(0, 3);

});
