(function() {

	var module = angular.module('dbRegistrationDoneFormDirectiveModule', ['ngAnimate']);

	// This directive represents the login form.
	var directive = function($animate) {

		var controller = function($scope) {
		};

		var compile = function(inElement, inAttrs) {
			// Please note the parameter "inOptParentCtrl" is set because we "required" it.
			var link = function(inScope, inElement, inAttrs, inOptParentCtrl) {

				// The parent's controller may not be defined if the directive is unit tested.
				if (null != inOptParentCtrl) {
					console.log("<db-registration-done-form-directive> is _NOT_ used alone");
				}
			};
			return link;
		};

		return {
			restrict: "E",
			controller: [ '$scope', controller ],
			compile: compile,
			replace: true,
			require: "?^dbRegistrationFormDirective",
			templateUrl: 'directives/templates/form-registration-done.html'
		};

	};

	module.directive('dbRegistrationDoneFormDirective', ['$animate', directive]);

})();