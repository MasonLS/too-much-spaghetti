app.config(function ($stateProvider) {

    $stateProvider.state('leftoverDetail', {
        url: '/leftovers/:id',
        templateUrl: 'js/leftover-detail/leftover-detail.html',
        controller: 'LeftoverDetailCtrl',
        resolve: {
            leftover: function(LeftoverFactory, $stateParams) {
                return LeftoverFactory.getOne($stateParams.id);
            }
        }
    });
});
