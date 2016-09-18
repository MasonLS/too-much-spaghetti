'use strict';

app.controller('HomeCtrl', function($scope, $rootScope, $log, $state, CuisineFactory, LeftoverFactory) {

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

    $scope.submitted = false;

    $scope.allCuisineLeftovers = [];


    $scope.isSubmitted = function(){
        $scope.submitted = true;

        $scope.allCuisineLeftovers = [];

        $rootScope.address = $scope.address;

        $scope.cuisineSelection.forEach(function(cuisineName){
            CuisineFactory.getByName(cuisineName)
            .then(function(cuisineLeftovers){
                $scope.allCuisineLeftovers = $scope.allCuisineLeftovers.concat(cuisineLeftovers);
                $scope.allCuisineLeftovers =  _.uniqBy($scope.allCuisineLeftovers, 'id');
            })

        });
    };

});
