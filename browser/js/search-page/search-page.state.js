'use strict'

app.config(function($stateProvider){
	$stateProvider.state('search', {
		url: '/search',
		templateUrl: '/js/search-page/search-page.html',
		controller: 'SearchPageCtrl',
        params: {
          cuisineSelection: null
        }
	});
});
