'use strict'

app.config(function($stateProvider){
	$stateProvider.state('searchPage', {
		url: '/search',
		templateUrl: '/js/search-page/search-page.html',
		controller: 'SearchPageCtrl'
	})
})