'use strict';

app.controller('HomeCtrl', function($scope, $rootScope, $log, $state, $stateParams, CuisineFactory, LeftoverFactory, UserFactory) {

  // UserFactory.getAll()
    // .then(users => {
      // $rootScope.totalUsers = users.length;
    // })
    // .catch($log.error);

  CuisineFactory.getAll()
    .then(function(cuisines) {
      $scope.cuisines = cuisines;
      $rootScope.totalCuisines = cuisines.length;
    })
    .catch($log.error);

  LeftoverFactory.getAll()
    .then(function(leftovers) {
      $rootScope.totalLeftovers = leftovers.length;
      $scope.leftovers = leftovers;
      $scope.featuredLeftovers = $scope.leftovers.slice(0, 3);
    })
    .catch($log.error);

  $scope.submitted = false;

  $scope.allCuisineLeftovers = [];

  $scope.isSubmitted = function() {
    $scope.submitted = true;

    $scope.allCuisineLeftovers = [];

    $rootScope.address = $scope.address;

    $scope.selection = $stateParams.selection;

    $state.go('search', {
      selection: $scope.cuisineSelection
    });
  };

  $scope.getRating = function(num) {
    return new Array(num);
  };

});

