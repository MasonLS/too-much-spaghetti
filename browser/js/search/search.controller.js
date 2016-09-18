'use strict'

app.controller('SearchPageCtrl', function($scope, LeftoverFactory, $log, CuisineFactory){
	
	CuisineFactory.getAll()
    .then(function(cuisines) {
        $scope.cuisines = cuisines;
    })
    .catch($log.error);

    LeftoverFactory.getAll()
    .then(function(leftovers) {
        $scope.leftovers = leftovers;
    })
    .catch($log.error);

    $scope.submitted = false; 

    $scope.allCuisineLeftovers = [];

    $scope.cuisineList = [];

    $scope.addToCuisineList = function(cuisineSelection){
        $scope.cuisineList.push(cuisineSelection);
    }
   

    $scope.isSubmitted = function(){
    	$scope.submitted = true;

    	$scope.allCuisineLeftovers = [];
   	
    	$scope.cuisineList.forEach(function(cuisineName){
	    	CuisineFactory.getByName(cuisineName)
		    .then(function(cuisineLeftovers){
		        $scope.allCuisineLeftovers = $scope.allCuisineLeftovers.concat(cuisineLeftovers); 
		      	$scope.allCuisineLeftovers =  _.uniqBy($scope.allCuisineLeftovers, 'id'); 
		      	console.log($scope.allCuisineLeftovers.length) 
		    })
    	})


    }

});