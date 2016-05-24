(function() {

	// Please note that we declare a dependency to the module "validatorDirectiveModule".
	// This module is used within the template. Indeed, within the template, we specify the element's attribute "db-code-validator-directive" (which is a directive).	

	var module = angular.module('dbRegistrationValidateEmailFormDirectiveModule', ['dbValidatorDirectiveModule', 'dbRegistrationServiceModule', 'ngMessages', 'ngAnimate']);

	// This directive represents the registration form.
	var directive = function($animate) {

		/**
		 * This function is used to test the form.
		 * It returns the name of the form that should be shown when the submit button is pressed.
		 * To disable the debug mode, modify the function so it returns the value null.
		 */
		var debug = function() {

			var forms = {
				done: "registration-done",
				error: "registration-error"
			};

			return forms.done;
		};

		var controller = function($scope, inRegistrationService) {

			inRegistrationService.activateDebugMode();
			
			// Do not change the default values.
			$scope.registrationValidateEmailContext = {
				emailAddress: inRegistrationService.getEmail(),
				email: { code:undefined },
				disabled: { submit:true },
				errors: {},
				submit: function() {
					console.log("Submit");
				},
				back: function() {
					console.log("Back!");
				}
			};
		};

		var compile = function(inElement, inAttrs) {
			// Please note the parameter "inOptParentCtrl" is set because we "required" it.
			var link = function(inScope, inElement, inAttrs, inOptParentCtrl) {

				if (null != inOptParentCtrl) {

					console.log("<db-registration-validate-email-form-directive> is _NOT_ used alone");
					var submitProtector = function() {
						console.log(inScope.registrationValidateEmailContext.email.code);
						if ("undefined" == typeof inScope.registrationValidateEmailContext.email.code) {
							return false;
						}
						return true;
					};

					// Get the handlers to the form's buttons, then register it.
					var submitTrigger = angular.element(document.getElementsByClassName('registration-validate-email-submit-trigger'));
					var backTrigger = angular.element(document.getElementsByClassName('registration-validate-email-back-trigger'));

					inOptParentCtrl.container.registerTriggerForEntry('registration-validate-email', submitTrigger, submitProtector);
					inOptParentCtrl.container.registerTriggerForEntry('registration-validate-email', backTrigger);

					inScope.registrationValidateEmailContext.back = function() {
						// Call the parent's controller.
						console.log("Cancel the email validation");
						inOptParentCtrl.container.disableTopContainerTriggers();
						inOptParentCtrl.container.show("registration-start").then(inOptParentCtrl.container.enableTopContainerTriggers);
					}

					inScope.registrationValidateEmailContext.submit = function() {
						
						var next = debug();
						inOptParentCtrl.container.disableTopContainerTriggers();
						if (null != next) {
							inOptParentCtrl.container.show(next).then(inOptParentCtrl.container.enableTopContainerTriggers);
							return;
						}
						
						// Otherwise, do what must be done.
						//...
						inOptParentCtrl.container.enableTopContainerTriggers();
					};
				}

				inScope.$watch('registrationValidateEmailContext.email.code', function(inNewValue, inOldValue) {
					if ("undefined" === typeof inNewValue) {
						inScope.registrationValidateEmailContext.disabled.submit = true;
					} else {
						inScope.registrationValidateEmailContext.disabled.submit = false;
					}
				});
			};
			return link;
		};

		return {
			restrict: "E",
			controller: [ '$scope', 'dbRegistrationService', controller ],
			compile: compile,
			replace: true,
			require:  '?^dbRegistrationFormDirective',
			templateUrl: 'directives/templates/form-registration-validate-email.html'
		};

	};

	module.directive('dbRegistrationValidateEmailFormDirective', ['$animate', directive]);

})();