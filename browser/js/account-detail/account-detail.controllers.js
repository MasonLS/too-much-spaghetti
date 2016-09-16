'use strict';

app.controller('AccountCtrl', function($scope, user){
  console.log('USER', user);
  $scope.user = user;

});

app.controller('ProfileCtrl', function($scope, UserFactory){

  $scope.showName = false;
  $scope.showEmail = false;
  $scope.showPassword = false;

  $scope.update = function (user, field) {
    let data = {};

    if (field === 'name') {
      data.first_name = $scope.updatedInfo.firstName;
      data.last_name = $scope.updatedInfo.lastName;
      $scope.showName = false;
    } else if (field === 'email') {
      data.email = $scope.updatedInfo.email;
      $scope.showEmail = false;
    } else {
      data.password = $scope.updatedInfo.email;
      $scope.showPassword = false;
    }

    return UserFactory.update(user.id, data)
      .then((user) => {
        $scope.user = user;
        if (field === 'name') $scope.showName = false;
        else if (field === 'email') $scope.showEmail = false;
        else $scope.showPassword = false;
    });
  };
});

app.controller('OrdersCtrl', function($scope, UserFactory){

  // $scope.orders = orders;
  UserFactory.getOrders($scope.user.id)
    .then((orders) => {
      $scope.orders = orders;
    })

});

app.controller('PaymentCtrl', function($scope){
  //Too be written
});

app.controller('MyLeftoversCtrl', function($scope, leftovers){
  $scope.leftovers = leftovers;
});
