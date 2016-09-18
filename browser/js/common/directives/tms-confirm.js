'use strict';

app.directive('tmsConfirm', function () {
	return {
		restrict: 'A',
		require: 'ngModel',
		scope: {
			otherModelValue: '=tmsConfirm'
		},
		link: function (scope, element, attrs, ngModel) {

			ngModel.$validators.confirm = function (modelValue) {
				return modelValue == scope.otherModelValue;
			}

			scope.$watch('otherModelValue', _ => {
				ngModel.$validate();
			});
		}
	}
});