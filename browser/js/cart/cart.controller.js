'use strict';

app.controller('CartCtrl', function($scope, CartFactory, $rootScope) {
  $scope.cartToggle = false;
  $scope.quantity = {};

  function range(n) {
    let res = [];
    for (var i = 1; i <= n; i++) {
      res.push(i);
    }
    return res;
  }

  CartFactory.getCart()
    .then(cart => $scope.cart = cart)
    .then(_ => {
      $scope.cart.forEach(el => {
        $scope.quantity[el.leftover.id] = range(el.leftover.quantity);
      })
      console.log($scope.quantity);
    })

  $scope.removeItem = function(removeItemId) {
    return CartFactory.deleteCartElem(removeItemId)
      .then(_ => {
        CartFactory.deleteCacheElement(removeItemId);
      })
  }

  $scope.updateItem = function(updateElemObj) {
    return CartFactory.updateCart(updateElemObj)
      .then(_ => {
        CartFactory.updateCache(updateElemObj);
      })
  }

})

