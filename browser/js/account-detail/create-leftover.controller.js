'use strict';

app.controller('CreateLeftoverCtrl', function($scope, $log, $state, LeftoverFactory, CuisineFactory){

    CuisineFactory.getAll()
    .then(function(cuisines) {
        $scope.cuisines = cuisines;
    })
    .catch($log.error);

    $scope.cuisineList = [];

    $scope.addToCuisineList = function(cuisine){
        console.log('heyeyehyehe', cuisine)
        $scope.cuisineList.push(cuisine);
    }

    $scope.addLeftover = function(data) {

        var dataToSend = {};

        dataToSend.leftoverObj = {
            name: data.name,
            description: data.description,
            quantity: data.quantity,
            picture: data.picture
        };

        dataToSend.cuisineNames = $scope.cuisineList;

        LeftoverFactory.add(dataToSend)
        .then(function(createdLeftover) {
            $state.go('leftoverDetail', { leftoverId: createdLeftover.id });
        });
    };

});
