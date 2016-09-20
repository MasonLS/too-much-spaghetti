'use strict';

app.controller('AccountCtrl', function($scope, user){
  console.log('USER', user);
  $scope.user = user;

});

app.controller('ProfileCtrl', function($scope, UserFactory){

  $scope.currentlyEditing = null;
  $scope.updatedUser = angular.copy($scope.user);

  $scope.setCurrentlyEditing = function (field) {
    $scope.currentlyEditing = field;
  };

  $scope.cancel = function () {
    $scope.updatedUser = angular.copy($scope.user);
    $scope.setCurrentlyEditing(null);
  }

  $scope.updateUserProfile = function () {
    return UserFactory.update($scope.updatedUser)
      .then(user => {
        $scope.setCurrentlyEditing(null);
        $scope.user = user;
      });
  }
});

app.controller('ReviewCtrl', function($scope, $stateParams, ReviewFactory, $state){
  // $stateParams.leftover.chef = chef;
  $scope.leftover = $stateParams.leftover;
  console.log($stateParams.leftover);
  $scope.postReview = function (reviewObj) {
    $state.go('^.orders');
    return ReviewFactory.post(reviewObj);
  };
});

app.controller('PaymentCtrl', function($scope){
  //TODO
});
