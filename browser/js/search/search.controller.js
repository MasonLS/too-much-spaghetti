'use strict'

app.controller('SearchPageCtrl', function($scope, $stateParams, LeftoverFactory, $log, CuisineFactory, cuisines, leftovers){

    $scope.getDistance = function (leftover) {
        return LeftoverFactory.getDistance(leftover.id)
                .then(distanceObj => {
                    leftover.distance = distanceObj.distance;
                    $scope.$digest();
                })
   }

    $scope.cuisines = cuisines;

    $scope.selected = $stateParams.selection;

    if($scope.selected){
        CuisineFactory.getByName($scope.selected)
        .then(function(leftovers){
            $scope.leftovers = leftovers;
        })
    }else{
        $scope.leftovers = leftovers; 
    }

    $scope.getRating = function(num) {
        return new Array(num);
    };
    
    //$scope.ratings = [1,2,3,4,5];


    $scope.cuisineList = [];


    $scope.addToCuisineList = function(cuisineSelection){
        $scope.cuisineList.push(cuisineSelection);
    }

    $scope.cuisineSubmitted = function(){

    	$scope.leftovers = [];

    	$scope.cuisineList.forEach(function(cuisineName){
	    	CuisineFactory.getByName(cuisineName)
		    .then(function(cuisineLeftovers){
		        $scope.leftovers = $scope.leftovers.concat(cuisineLeftovers);
		      	$scope.leftovers =  _.uniqBy($scope.leftovers, 'id');
		    });
    	});
    };


    $scope.ratingSubmitted = function(){

        $scope.leftovers = [];

        LeftoverFactory.getByRating($scope.rating.number)
        .then(function(leftovers){
            $scope.leftovers = leftovers;
        })
    };

});



