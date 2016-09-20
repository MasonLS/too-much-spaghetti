'use strict';

app.directive('carts', function ($rootScope, CartFactory, AuthService, AUTH_EVENTS, $state) {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: '/js/common/directives/cart/cart.html',
        link: function (scope) {

            var setCart = function () {
                CartFactory.getCart().then(function (cart) {
                    scope.cart = cart;
                });
            };

            setCart();

        }

    };

});
