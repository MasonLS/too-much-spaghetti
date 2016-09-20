'use strict'

app.config(function($stateProvider){
	$stateProvider.state('search', {
		url: '/search',
        templateUrl: '/js/search/search.html',
        controller: 'SearchPageCtrl',
        params: {
            selection: null,
            address: null,
            nearness: 12
        },
        resolve: {
            
            cuisines: function(CuisineFactory){
                return CuisineFactory.getAll();
            },

            leftovers: function(LeftoverFactory){
                return LeftoverFactory.getAll();
            },

            me: function(UserFactory){
                return UserFactory.getMe();
            }
        }
	});
});
