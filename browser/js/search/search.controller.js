'use strict'

app.controller('SearchPageCtrl', function($scope, $rootScope, $stateParams, LeftoverFactory, $log, leftovers, cuisines){

   $scope.getDistance = function (leftover) {
        return LeftoverFactory.getDistance(leftover.id)
                .then(distanceObj => {
                    leftover.distance = distanceObj.distance;
                    $scope.$digest();
                })
   }


    $scope.submitted = false;

    // if (selectionLeftovers) {
    //     $scope.allCuisineLeftovers = selectionLeftovers;
    // } else {
    //     $scope.allCuisineLeftovers = $scope.leftovers;
    // }

    // $scope.allCuisineLeftovers = selectionLeftovers;

    $scope.cuisineList = [];

    $scope.addToCuisineList = function(cuisineSelection){
        $scope.selected.push(cuisineSelection);
    }

    $scope.isSubmitted = function(){
    	$scope.submitted = true;

    	$scope.allCuisineLeftovers = [];

    	$scope.cuisineList.forEach(function(cuisineName){
	    	CuisineFactory.getByName(cuisineName)
		    .then(function(cuisineLeftovers){
		        $scope.allCuisineLeftovers = $scope.allCuisineLeftovers.concat(cuisineLeftovers);
		      	$scope.allCuisineLeftovers =  _.uniqBy($scope.allCuisineLeftovers, 'id');
		      	console.log($scope.allCuisineLeftovers.length);
		    });
    	});
    };

    $scope.address = $rootScope.address;

});
