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
      controller: 'OrdersCtrl',
      // resolve: {
      //   orders: function(UserFactory){
      //     return UserFactory.getOrders(user.id);
      //   }
      // }
    })
    .state('account.payment', {
      url: '/payment',
      templateUrl: 'js/account-detail/templates/payment.template.html',
      controller: 'PaymentCtrl'
    })
    .state('account.myLeftovers', {
      url: '/my-leftovers',
      templateUrl: 'js/account-detail/templates/my-leftovers.template.html',
      controller: 'MyLeftoversCtrl',
      resolve: {
        leftovers: function(UserFactory){
          return UserFactory.getLeftovers(user.id);
        }
      }
    });
});

//copy and pasted this verbatim from StackOverflow. Redirects (defaults) account to profile substate.
app.run(['$rootScope', '$state', function($rootScope, $state) {

    $rootScope.$on('$stateChangeStart', function(evt, to, params) {
      if (to.redirectTo) {
        evt.preventDefault();
        $state.go(to.redirectTo, params, {location: 'replace'})
      }
    });
}]);
