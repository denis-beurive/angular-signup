(function() {

	// Please note that we declare a dependency to the module "validatorDirectiveModule".
	// This module is used within the template. Indeed, within the template, we specify the element's attributes (which are directives):
	//   -  db-email-validator-directive
	//   -  db-login-validator-directive
	var module = angular.module('dbRegistrationStartFormDirectiveModule', ['dbValidatorDirectiveModule', 'dbRegistrationServiceModule', 'ngMessages', 'ngAnimate']);

	// This directive represents the registration form.
	var directive = function($animate) {

		var controller = function($scope, inRegistrationService) {
			// Do not change the default values.
			$scope.registrationStartContext = {
				member: {
					email:undefined,
					login:undefined
				},
				disabled: {
					submit:true
				},
				errors: {
					AlreadyUsedEmail: false,
					AlreadyUsedLogin: false
				},
				submit: function() {
					console.log("Submit");
				}
			};
		};

		var compile = function(inElement, inAttrs) {
			// Please note the parameter "inOptParentCtrl" is set because we "required" it.
			var link = function(inScope, inElement, inAttrs, inOptParentCtrl) {

				if (null != inOptParentCtrl) {

					console.log("<db-registration-start-form-directive> is _NOT_ used alone");

					var submitTrigger = angular.element(document.getElementsByClassName('registration-start-submit-trigger'));
					inOptParentCtrl.container.registerTriggerForEntry('registration-start', submitTrigger);

					// Set the callback for the submit button.
					inScope.registrationStartContext.submit = function() {
						inOptParentCtrl.container.disableTopContainerTriggers();
						inOptParentCtrl.container.show("registration-validate-email").then(inOptParentCtrl.container.enableTopContainerTriggers);
					}
				}

				inScope.$watch('register.inputEmail.$error', function(inNewValue, inOldValue) {
					console.log(inNewValue);
					inScope.registrationStartContext.errors['invalidEmail'] = inScope.register.inputEmail.$error.hasOwnProperty('db-email');


				});

				inScope.$watchGroup(['registrationStartContext.member.email', 'registrationStartContext.member.login'], function(inNewValues, inOldValues) {
					if (("undefined" !== typeof inScope.registrationStartContext.member.email) &&
					    ("undefined" !== typeof inScope.registrationStartContext.member.login)) {
						inScope.registrationStartContext.disabled.submit = false;
					} else {
						inScope.registrationStartContext.disabled.submit = true;
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

			// #########################################################################################
			// NOTE: the actual directive may be inserted within a parent directive called
			//       "dbRegistrationFormDirective". If the directive is present, then we use its
			//       controller.
			// SEE https://docs.angularjs.org/api/ng/service/$compile
			//     ?^ - Attempt to locate the required controller by searching the element and its
			//     parents or pass null to the link fn if not found.
			// #########################################################################################

			require:  '?^dbRegistrationFormDirective',
			templateUrl: 'directives/templates/form-registration-start.html'
		};

	};

	module.directive('dbRegistrationStartFormDirective', ['$animate', directive]);

})();