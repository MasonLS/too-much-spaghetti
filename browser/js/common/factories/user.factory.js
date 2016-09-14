'use strict';

app.factory('UserFactory', function($http) {

    function getData(response) {
        return response.data;
    }

    function getAllUsers() {
        return $http.get('/api/users')
                .then(getData);
    }

    function getAllSellers() {
        return $http.get('/api/users/sellers')
                .then(getData);
    }

    function getById(id) {
        return $http.get('/api/users/' + id)
                .then(getData);
    }

    function add(reqUser) {
        return $http.post('/api/users', reqUser)
                .then(getData);
    }

    function update(reqId, data) {
        return $http.put('/api/users/' + reqId, data)
                .then(getData);
    }

    function destroy(reqId) {
        return $http.delete('/api/users/' + reqId)
                .then(getData);
    }

    return {
        getAll: getAll,
        getById: getById,
        add: add,
        update: update,
        destroy: destroy
    };
});
