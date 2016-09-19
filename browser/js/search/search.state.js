'use strict'

app.config(function($stateProvider){
	$stateProvider.state('search', {
		url: '/search/:selection',
        templateUrl: '/js/search/search.html',
        controller: 'SearchPageCtrl',
        resolve: {
            selectionLeftovers: function(CuisineFactory, $stateParams) {
                return CuisineFactory.getByName($stateParams.selection);
            }
        }
	});
});
