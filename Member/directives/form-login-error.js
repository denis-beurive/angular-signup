(function() {

	var module = angular.module('dbLoginErrorFormDirectiveModule', ['ngAnimate']);

	// This directive represents the login form.
	var directive = function($animate) {

		var controller = function($scope) {
			// Do not change the default values.
			$scope.loginErrorContext = {
				parentControler: null,
				submit: function() {
					console.log("Submit");
				}
			}
		};

		var compile = function(inElement, inAttrs) {
			var link = function(inScope, inElement, inAttrs, inOptParentCtrl) {

				if (null != inOptParentCtrl) {

					console.log("<db-login-error-form-directive> is _NOT_ used alone");

					inScope.loginErrorContext.parentControler = inOptParentCtrl;
					
					// Get the handlers to the form's buttons, then register it.
					var submitTrigger = angular.element(document.getElementsByClassName('login-error-submit-trigger'));
					inOptParentCtrl.container.registerTriggerForEntry('login-error', submitTrigger);

					inScope.loginErrorContext.submit = function() {
						inOptParentCtrl.container.disableTopContainerTriggers();
						inOptParentCtrl.container.show("login-start").then(inOptParentCtrl.container.enableTopContainerTriggers);
					}
				}

			};
			return link;
		};

		return {
			restrict: "E",
			controller: [ '$scope', controller ],
			compile: compile,
			replace: true,
			require: "?^dbLoginFormDirective",
			templateUrl: 'directives/templates/form-login-error.html'
		};

	};

	module.directive('dbLoginErrorFormDirective', ['$animate', directive]);

})();