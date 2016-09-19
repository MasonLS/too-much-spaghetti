'use strict'

app.config(function($stateProvider){
	$stateProvider.state('search', {
		url: '/search/:selection',
        templateUrl: '/js/search/search.html',
        controller: 'SearchPageCtrl',
        resolve: {
            cuisines: function(CuisineFactory){
                return CuisineFactory.getAll();
            },

            leftovers: function(LeftoverFactory){
                return LeftoverFactory.getAll();
            }
        }
	});
});
