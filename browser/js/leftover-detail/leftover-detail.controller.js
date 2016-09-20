'use strict';

app.controller('LeftoverDetailCtrl', function($scope, $log, LeftoverFactory, LeftoverDetailPicsFactory, leftover, AuthService) {

    var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
            $scope.user = user;
        });
    };

    setUser();

    LeftoverFactory.getAll()
    .then(function(leftovers) {
        $scope.leftovers = leftovers;
    })
    .catch($log.error);
    console.log(leftover);
    $scope.leftover = leftover;

    console.log('leftover!', leftover);

    $scope.images = _.shuffle(LeftoverDetailPicsFactory);

    $scope.rating = $scope.leftover.rating;
    $scope.getRating = function(num) {
        return new Array(num);
    };

    LeftoverFactory.getReviews($scope.leftover.id)
    .then(function(reviews) {
        $scope.reviews = reviews;
    });
});
