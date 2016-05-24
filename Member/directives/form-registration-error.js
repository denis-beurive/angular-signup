(function() {

	var module = angular.module('dbRegistrationErrorFormDirectiveModule', ['ngAnimate']);

	// This directive represents the login form.
	var directive = function($animate) {

		var controller = function($scope) {
			$scope.registrationErrorContext = {
				parentControler: null,
				submit: function() {
					console.log("Submit");
				}
			}
		};

		var compile = function(inElement, inAttrs) {
			// Please note the parameter "inOptParentCtrl" is set because we "required" it.
			var link = function(inScope, inElement, inAttrs, inOptParentCtrl) {

				if (null != inOptParentCtrl) {

					console.log("<db-registration-error-form-directive> is _NOT_ used alone");
					inScope.registrationErrorContext.parentControler = inOptParentCtrl;
					
					// Get the handlers to the form's buttons, then register it.
					var submitTrigger = angular.element(document.getElementsByClassName('registration-error-submit-trigger'));
					inOptParentCtrl.container.registerTriggerForEntry('registration-start', submitTrigger);

					inScope.registrationErrorContext.submit = function() {
						inOptParentCtrl.container.disableTopContainerTriggers();
						inOptParentCtrl.container.show("registration-start").then(inOptParentCtrl.container.enableTopContainerTriggers);
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
			require: "?^dbRegistrationFormDirective",

			// #########################################################################################
			// WARNING !!!
			// You **MUST** provide the "full relative" URL to the template.
			// See: https://docs.angularjs.org/error/$sce/insecurl
			// By default, only URLs that belong to the same origin are trusted.
			// These are urls with the same domain, protocol and port as the application document.
			// The application document is the HTML file that is loaded (and not the JS file).
			// #########################################################################################

			templateUrl: 'directives/templates/form-registration-error.html'
		};

	};

	module.directive('dbRegistrationErrorFormDirective', ['$animate', directive]);

})();