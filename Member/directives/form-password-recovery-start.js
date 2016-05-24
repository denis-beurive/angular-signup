(function() {

	// Please note that we declare a dependency to the module "validatorDirectiveModule".
	// This module is used within the template. Indeed, within the template, we specify the element's attribute "db-member-id-validator-directive" (which is a directive).	
	var module = angular.module('dbPasswordRecoveryStartFormDirectiveModule', ['ngAnimate', 'dbValidatorDirectiveModule']);

	/**
	 * This directive represents the first step of the password recovery form.
	 */
	var directive = function($animate) {

		/**
		 * This function is used to test the form.
		 * It returns the name of the form that should be shown when the submit button is pressed.
		 * To disable the debug mode, modify the function so it returns the value null.
		 */
		var debug = function() {

			var forms = {
				error: "password-recovery-error",
				done: "password-recovery-done"
			};

			return forms.error;
		};

		var controller = function($scope) {
			// Do not change the default value for "id".
			$scope.passwordRecoveryStartContext = {
				member: { id:undefined },
				disabled: { submit:true },
				submit: function() {
					console.log("Submit");
				}
			};
		};

		var compile = function(inElement, inAttrs) {
			// Please note the parameter "inOptParentCtrl" is set because we "required" it.
			var link = function(inScope, inElement, inAttrs, inOptParentCtrl) {

				if (null != inOptParentCtrl) {

					console.log("<db-password-recovery-start-form-directive> is _NOT_ used alone");

					inScope.passwordRecoveryStartContext.parentControler = inOptParentCtrl;

					// Get the handlers to the form's buttons, then register it.
					var submitTrigger = angular.element(document.getElementsByClassName('password-recovery-start-submit-trigger'));
					inOptParentCtrl.container.registerTriggerForEntry('password-recovery-start', submitTrigger);

					inScope.passwordRecoveryStartContext.submit = function() {
						var next = debug();
						inOptParentCtrl.container.disableTopContainerTriggers();
						if (null != next) {
							inOptParentCtrl.container.show(next).then(inOptParentCtrl.container.enableTopContainerTriggers);
							return;
						};

						// Otherwise, do what must be done.
						//...

						inOptParentCtrl.container.enableTopContainerTriggers();
					}
				}

				inScope.$watch('passwordRecoveryStartContext.member.id', function(inNewValue, inOldValue) {
					if ("undefined" === typeof inScope.passwordRecoveryStartContext.member.id) {
						inScope.passwordRecoveryStartContext.disabled.submit = true;
						console.log("Disable the submission for the member ID");
					} else {
						inScope.passwordRecoveryStartContext.disabled.submit = false;
						console.log("Enable the submission for the member ID");
					}
				});
			};
			return link;
		};

		return {
			restrict: "E",
			controller: [ '$scope', controller ],
			compile: compile,
			replace: true,
			require: "?^dbPasswordRecoveryFormDirective",
			templateUrl: 'directives/templates/form-password-recovery-start.html'
		};

	};

	module.directive('dbPasswordRecoveryStartFormDirective', ['$animate', directive]);

})();