'use strict'

app.config(function($stateProvider){
	$stateProvider.state('searchPage', {
		url: '/search',
		templateUrl: '/js/search/search.html',
		controller: 'SearchPageCtrl'
	})
})