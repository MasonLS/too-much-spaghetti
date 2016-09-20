'use strict';

app.factory('CartFactory', function($http) {

  let cachedCart = [];

  function getData(res) {
    return res.data;
  }

  function postCart() {
    return $http.post('/api/cart')
      .then(getData)
      .then(() => {
        let cachedCart = [];
      })
  }

  function getCart() {
    return $http.get('/api/cart')
      .then(getData)
      .then(data => {
        angular.copy(data, cachedCart);
        return cachedCart;
      })
  }

  //{leftoverId: 4, quantity: 10}
  function updateCart(updateElem) {
    return $http.put('/api/cart', updateElem)
      .then(getData)
  }

  function deleteCartElem(deleteElemId) {
    return $http.delete('/api/cart/' + deleteElemId)
      .then(getData)
  }

  function deleteCart() {
    return $http.delete('/api/cart/all')
      .then(getData)
  }

  function updateCache(updateObj) {
    cachedCart.forEach(el => {
      if (el.leftover.id === updateObj.leftoverId) el.quantity = updateObj.quantity;
    })
  }

  function deleteCacheElement(deleteLeftoverId) {
    for (let i = 0; i < cachedCart.length; i++) {
      if (cachedCart[i].leftover.id === deleteLeftoverId) {
        cachedCart.splice(i, 1);
        break;
      }
    }
  }

  function getSubtotal(selectedQtys) {
    return _.round(cachedCart.reduce((prev, curr) => {
      return prev + (curr.leftover.price * selectedQtys[curr.leftover.id]);
    }, 0), 2);
  }

  function getDeliveryFee() {
    return _.round(cachedCart.reduce((prev, curr) => {
      return prev + (curr.leftover.deliveryFee);
    }, 0), 2);
  }

  function getTotal(selectedQtys) {
    return _.round(getSubtotal(selectedQtys) + getDeliveryFee(), 2);
  }

  return {
    getCart: getCart,
    updateCart: updateCart,
    deleteCartElem: deleteCartElem,
    deleteCart: deleteCart,
    postCart: postCart,
    updateCache: updateCache,
    deleteCacheElement: deleteCacheElement,
    getSubtotal: getSubtotal,
    getDeliveryFee: getDeliveryFee,
    getTotal: getTotal
  }

})

