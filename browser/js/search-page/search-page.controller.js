'use strict'

app.controller('SearchPageCtrl', function($scope, LeftoverFactory, $log){
	LeftoverFactory.getAll()
	.then(function(leftovers){
		$scope.leftovers = leftovers;
	})
	.catch($log.error);

	LeftoverFactory.getAll({
		where: {cuisine: cuisine.selection}
	})
	.then(function(cuisineLeftovers){
		$scope.selectedLeftovers = leftovers;
	})
	.catch($log.error);


});