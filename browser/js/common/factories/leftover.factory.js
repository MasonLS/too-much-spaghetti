'use strict'

app.factory('LeftoverFactory', function($http){

	function getAll(){
		return $http.get('/api/leftovers')
		.then(function(response){
			return response.data;
		})
	}

	function getOne(id){
		return $http.get('api/leftovers/' + id)
		.then(function(response){
			return response.data;
		})
	}

	function getByRating(rating){
		return $http.get('api/leftovers/rating/' +rating)
		.then(function(response){
			return response.data
		})
	}

	function getReviews(id) {
		return $http.get('api/leftovers/' + id + '/reviews')
		.then(function(response) {
			return response.data;
		})
	}

	function destroy(id){
		return $http.delete('/api/leftovers/' +id);
	}

	function add(data){
		return $http.post('api/leftovers', data)
		.then(function(response){
			return response.data;
		})
	}

	function update(data){
		return $http.put('api/leftovers', data)
		.then(function(response){
			return response.data;
		})
	}

	function getDistance(leftoverId){
		return $http.get('/api/leftovers/' + leftoverId + '/distance')
			.then(function(response){
				return response.data;
			});
	}

	return {
		getAll: getAll,
		getOne: getOne,
		getReviews: getReviews,
		destroy: destroy,
		add: add,
        update: update,
        getDistance: getDistance,
        getByRating: getByRating
	}

})
