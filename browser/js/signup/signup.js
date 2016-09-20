app.config(function ($stateProvider) {

    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'js/signup/signup.html',
        controller: 'SignupCtrl'
    });

});

app.controller('SignupCtrl', function ($scope, $state, $log, UserFactory, AuthService) {

    $scope.submit = function(data) {

        return UserFactory.add(data)
                .then(function(user) {

                    $scope.loginInfo = {
                        email: user.email,
                        password: data.password
                    };

                    AuthService.login($scope.loginInfo);
                })
                .then(function() {
                        $state.go('home');
                })
                .catch($log.error);
    };
});
