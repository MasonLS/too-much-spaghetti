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

    function update(user) {
        return $http.put('/api/users/' + user.id, user)
                .then(getData);
    }

    function destroy(reqId) {
        return $http.delete('/api/users/' + reqId);
    }

    function getLeftovers(userId) {
      return $http.get('/api/users/' + userId + '/leftovers')
        .then(getData);
    }

    function getOrders (userId) {
      return $http.get('/api/users/' + userId + '/orders')
        .then(getData);
    }

    return {
        getAllUsers: getAllUsers,
        getAllSellers: getAllSellers,
        getById: getById,
        add: add,
        update: update,
        destroy: destroy,
        getLeftovers: getLeftovers,
        getOrders: getOrders
    };
});
