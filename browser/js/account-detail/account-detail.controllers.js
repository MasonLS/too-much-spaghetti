'use strict';

app.controller('AccountCtrl', function($scope, user){
  console.log('USER', user);
  $scope.user = user;

});

app.controller('ProfileCtrl', function($scope, UserFactory){

  $scope.currentlyEditing = null;

  $scope.setCurrentlyEditing = function (field) {
    $scope.currentlyEditing = field;
    
  };

  $scope.cancel = function (field) {
    if (field === 'name') {
      $scope.showName = false;
    } else if (field === 'email') {
      $scope.showEmail = false;
    } else {
      $scope.showPassword = false;
    }
  }

  $scope.update = function (user, field) {
    let data = {};

    if (field === 'name') {
      data.first_name = $scope.updatedInfo.firstName;
      data.last_name = $scope.updatedInfo.lastName;
    } else if (field === 'email') {
      data.email = $scope.updatedInfo.email;
    } else {
      data.password = $scope.updatedInfo.email;
    }

    $scope.currentlyEditing = null;

    return UserFactory.update(user.id, data)
      .then((user) => {
        $scope.user = user;
        $scope.setCurrentlyEditing(null);
    });
  };
});

app.controller('OrdersCtrl', function($scope, orders){
  console.log(orders);
  $scope.orders = orders;

});

app.controller('PaymentCtrl', function($scope){
  //Too be written
});

app.controller('MyLeftoversCtrl', function($scope, leftovers){
  $scope.leftovers = leftovers;
});
