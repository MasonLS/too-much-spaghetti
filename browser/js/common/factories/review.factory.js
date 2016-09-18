'use strict';

app.factory('ReviewFactory', function ($http) {
	function getData (res) {
		return res.data;
	}


	function post (review) {
		return $http.post('/api/reviews', review);
	}

	function getForLeftover (leftoverId) {
		return $http.get('/api/reviews/' + leftoverId)
			.then(getData);
	}

	return {
		post: post,
		getForLeftover: getForLeftover
	}
});