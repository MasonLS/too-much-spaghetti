'use strict'

app.config(function($stateProvider){
	$stateProvider.state('search', {
		url: '/search',
        templateUrl: '/js/search/search.html',
        controller: 'SearchPageCtrl',
        params: {
          cuisineSelection: null
        }
	});
});
