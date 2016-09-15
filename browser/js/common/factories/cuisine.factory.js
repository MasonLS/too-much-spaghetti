'use strict';

app.factory('CuisineFactory', function($http) {

    function getData(response) {
        return response.data;
    }

    function getAll() {
        return $http.get('/api/cuisines')
                .then(getData);
    }

    function getByName(cuisine) {
        return $http.get('/api/cuisines/' + cuisine)
                .then(getData);
    }

    return {
        getAll: getAll,
        getByName: getByName
    };
});
