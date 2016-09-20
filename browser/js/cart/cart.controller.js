'use strict';

app.controller('CartCtrl', function($scope, CartFactory, $rootScope) {
  $scope.cartToggle = false;
  $scope.quantity = {};
  $scope.selectedQtys = {};

  $rootScope.addToCart = function(leftoverObj){
    console.log('adding to cart');
    return $scope.updateItem(leftoverObj).then(_ => $scope.getCart());
  };

  $scope.order = {
    option: 'delivery'
  };

  $scope.$watch(function(scope) {
    return scope.order.option
  }, function(newVal, oldVal) {
    if (newVal === 'pickup') {
      $scope.order.deliveryFee = 0;
      $scope.order.total = CartFactory.getSubtotal($scope.selectedQtys);
    } else {
      $scope.order.deliveryFee = CartFactory.getDeliveryFee();
      $scope.order.total = CartFactory.getTotal($scope.selectedQtys);
    }
  })

  function setOrderDetails() {
    $scope.order.subTotal = CartFactory.getSubtotal($scope.selectedQtys);
    $scope.order.deliveryFee = CartFactory.getDeliveryFee();
    $scope.order.total = CartFactory.getTotal($scope.selectedQtys);
  }

  $scope.increaseSelectedQty = function(leftoverId) {
    if ($scope.selectedQtys[leftoverId] < $scope.quantity[leftoverId]) $scope.selectedQtys[leftoverId]++;
  }

  $scope.reduceSelectedQty = function(leftoverId) {
    if ($scope.selectedQtys[leftoverId] > 1) $scope.selectedQtys[leftoverId]--;
  }

  let getCart = function() {
    return CartFactory.getCart()
      .then(cart => {
        $scope.cart = cart
      })
      .then(_ => {
        $scope.cart.forEach(el => {
          $scope.quantity[el.leftover.id] = el.leftover.quantity;
          $scope.selectedQtys[el.leftover.id] = el.quantity;
        })
        setOrderDetails();
      })
  }

  $scope.getCart = function() {
    getCart().then(_ => {
      $scope.cartToggle = !$scope.cartToggle;
    })
  }

  $scope.removeItem = function(removeItemId) {
    return CartFactory.deleteCartElem(removeItemId)
      .then(_ => {
        CartFactory.deleteCacheElement(removeItemId);
        setOrderDetails();
      })
  }

  $scope.updateItem = function(updateElemObj) {
    return CartFactory.updateCart(updateElemObj)
      .then(_ => {
        CartFactory.updateCache(updateElemObj);
        setOrderDetails();
      })
  }

  $scope.postCart = function() {
    console.log('posting cart');
    CartFactory.postCart()
      .then(_ => $scope.getCart());
  }

  getCart();

})

