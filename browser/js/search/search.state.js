'use strict'

app.config(function($stateProvider){
	$stateProvider.state('search', {
		url: '/search/:selection',
        templateUrl: '/js/search/search.html',
        controller: 'SearchPageCtrl',
        resolve: {
            leftovers: function(LeftoverFactory) {
                return LeftoverFactory.getAll();
            },
            cuisines: function(CuisineFactory) {
                return CuisineFactory.getAll();
            }
        }
	});
});
