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

    $scope.leftover = leftover;

    $scope.images = _.shuffle(LeftoverDetailPicsFactory);

    $scope.rating = $scope.leftover.rating;
    $scope.getRating = function(num) {
        return new Array(num);
    };

    LeftoverFactory.getReviews($scope.leftover.id)
    .then(function(reviews) {
        $scope.reviews = reviews;
    });

    $scope.currentlyEditing = null;
    $scope.updatedLeftover = angular.copy($scope.leftover);

    $scope.setCurrentlyEditing = function(field) {
        $scope.currentlyEditing = field;
    };

    $scope.cancel = function() {
        $scope.updatedLeftover = angular.copy($scope.leftover);
        $scope.setCurrentlyEditing(null);
    };

    $scope.updateLeftover = function(data) {

        var dataToSend = {};

        dataToSend.leftoverObj = {
            id: leftover.id,
            name: data.name,
            description: data.description,
            price: data.price,
            deliveryFee: data.deliveryFee
        };

        console.log($scope.updatedLeftover.cuisines);

        dataToSend.cuisineNames = $scope.updatedLeftover.cuisines.map(function(cuisineInstance) {
            return cuisineInstance.name;
        });

        dataToSend.chefId = $scope.updatedLeftover.chefId;

        return LeftoverFactory.update(dataToSend)
                .then(function(leftover) {
                    $scope.setCurrentlyEditing(null);
                    $scope.leftover = leftover;
                })
                .catch($log.error);
    };
});
