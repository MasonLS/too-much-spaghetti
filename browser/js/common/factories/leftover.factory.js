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

	function destroy(id){
		return $http.delete('/api/leftovers/' +id)
		.then(function(response){
			return response.data
		})
	}

	function add(data){
		return $http.post('api/leftovers', data)
		.then(function(response){
			return response.data
		})
	}

	function update(id, data){
		return $http.put('api/leftovers/' + id, data)
		.then(function(response){
			return response.data;
		})
	}

	return {
		getAll: getAll,
		getOne: getOne,
		destroy: destroy,
		add: add
	}

})
