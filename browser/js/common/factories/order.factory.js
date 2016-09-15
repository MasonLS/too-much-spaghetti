'use strict';

app.factory('OrderFactory', function($http){
  function getData(response) {
      return response.data;
  }

  function getUserOrders (userId) {
    return $http.get('/api/users/' + userId + '/leftovers')
      .then(getData);
  }

  return {
    getUserOrders: getUserOrders
  }
});
