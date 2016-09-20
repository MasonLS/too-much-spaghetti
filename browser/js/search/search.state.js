'use strict'

app.config(function($stateProvider){
	$stateProvider.state('search', {
		url: '/search',
        templateUrl: '/js/search/search.html',
        controller: 'SearchPageCtrl',
        params: {
            selection: null,
            address: null
        },
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
