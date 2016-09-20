app.config(function ($stateProvider) {

    $stateProvider.state('leftoverDetail', {
        url: '/leftovers/:leftoverId',
        templateUrl: 'js/leftover-detail/leftover-detail.html',
        controller: 'LeftoverDetailCtrl',
        resolve: {
            leftover: function(LeftoverFactory, $stateParams) {
                return LeftoverFactory.getOne($stateParams.leftoverId);
            }
        }
    });

    $stateProvider.state('createLeftover', {
      url: '/create-leftover',
      templateUrl: 'js/account-detail/templates/create-leftover.html',
      controller: 'CreateLeftoverCtrl'
    });
});
