(function() {

	var module = angular.module('dbPasswordRecoveryErrorFormDirectiveModule', ['ngAnimate']);

	// This directive represents the login form.
	var directive = function($animate) {

		var controller = function($scope) {
			$scope.passwordRecoveryErrorContext = {
				parentControler: null,
				submit: function() {
					console.log("Submit");
				}
			};
		};

		var compile = function(inElement, inAttrs) {
			// Please note the parameter "inOptParentCtrl" is set because we "required" it.
			var link = function(inScope, inElement, inAttrs, inOptParentCtrl) {

				if (null != inOptParentCtrl) {

					console.log("<db-password-recovery-error-form-directive> is _NOT_ used alone");

					inScope.passwordRecoveryErrorContext.parentControler = inOptParentCtrl;
					
					// Get the handlers to the form's buttons, then register it.
					var submitTrigger = angular.element(document.getElementsByClassName('password-recovery-error-submit-trigger'));
					inOptParentCtrl.container.registerTriggerForEntry('password-recovery-error', submitTrigger);

					inScope.passwordRecoveryErrorContext.submit = function() {
						inOptParentCtrl.container.disableTopContainerTriggers();
						inOptParentCtrl.container.show('password-recovery-start').then(inOptParentCtrl.container.enableTopContainerTriggers);
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
			require: "?^dbPasswordRecoveryFormDirective",
			templateUrl: 'directives/templates/form-password-recovery-error.html'
		};

	};

	module.directive('dbPasswordRecoveryErrorFormDirective', ['$animate', directive]);

})();