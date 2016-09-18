'use strict';

app.config(function($stateProvider, $urlRouterProvider){

  $stateProvider.state('account', {
    url: '/account/:userId',
    templateUrl: 'js/account-detail/account-detail.html',
    controller: 'AccountCtrl',
    resolve: {
      user: function(UserFactory, $stateParams){
        return UserFactory.getById($stateParams.userId);
      }
    },
    redirectTo: 'account.profile'
  })
    .state('account.profile', {
      url: '/profile',
      templateUrl: 'js/account-detail/templates/profile.template.html',
      controller: 'ProfileCtrl'
    })
    .state('account.orders', {
      url: '/orders',
      templateUrl: 'js/account-detail/templates/orders.template.html',
      controller: function ($scope, orders) {
        $scope.orders = orders;
      },
      resolve: {
        orders: function(UserFactory, user){
          return UserFactory.getOrders(user.id);
        }
      }
    })
    .state('account.review', {
      url: '/review',
      templateUrl: 'js/account-detail/templates/review.template.html',
      params: {
        leftover: null
      },
      controller: 'ReviewCtrl',
      resolve: {
        chef: function(UserFactory, $stateParams){
          return UserFactory.getById($stateParams.leftover.chefId);
        }
      }
    })
    .state('account.payment', {
      url: '/payment',
      templateUrl: 'js/account-detail/templates/payment.template.html',
      controller: 'PaymentCtrl'
    })
    .state('account.myLeftovers', {
      url: '/my-leftovers',
      templateUrl: 'js/account-detail/templates/my-leftovers.template.html',
      controller: function ($scope, leftovers) {
        $scope.leftovers = leftovers;
      },
      resolve: {
        leftovers: function (UserFactory, user) {
          return UserFactory.getLeftovers(user.id);
        }
      }
    });
});

//copy and pasted this verbatim from stackoverflow. Redirects (defaults) account state to its profile substate.
app.run(['$rootScope', '$state', function($rootScope, $state) {

    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params, {location: 'replace'})
      }
    });
}]);
