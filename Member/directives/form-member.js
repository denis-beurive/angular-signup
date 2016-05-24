(function() {

	// Please note that we declare dependencies to the modules "dbRegistrationFormDirectiveModule" and "dbRegistrationValidateEmailFormDirectiveModule".
	var module = angular.module('dbMemberFormDirectiveModule', ['ngAnimate', 'dbRegistrationFormDirectiveModule', 'dbLoginFormDirectiveModule', 'dbPasswordRecoveryFormDirectiveModule', 'dbPanelContainerServiceModule']);

	// This directive represents the member form.
	var directive = function($animate, dbPanelContainerService) {

		// Create the container for the forms used within the registration process.
		var container = new dbPanelContainerService();
		container.currentPanel = 'login';
		container.cssClassForShow = 'fadingInQuickly';
		container.cssClassForHide = 'fadingOutQuickly';

		/**
		 * Directive's controller.
		 */
		var controller = function($scope) {
			this.container = container;
		};

		/**
		 * Directive's compiler.
		 */
		var compile = function(inElement, inAttrs) {
			var link = function(inScope, inElement, inAttrs) {

				// Find the 3 elements that represent the 3 panels.
				var loginPanel        = angular.element(document.getElementsByClassName('login-directive'));
				var passwordPanel     = angular.element(document.getElementsByClassName('password-directive'));
				var registrationPanel = angular.element(document.getElementsByClassName('registration-directive'));

				// Find the 3 elements that represents the 3 triggers.
				var loginTrigger        = angular.element(document.getElementsByClassName('login-trigger'));
				var passwordTrigger     = angular.element(document.getElementsByClassName('password-trigger'));
				var registrationTrigger = angular.element(document.getElementsByClassName('registration-trigger'));

				container.registerPanel('login', loginPanel, loginTrigger);
				container.registerPanel('password', passwordPanel, passwordTrigger);
				container.registerPanel('registration', registrationPanel, registrationTrigger);

				// Set the current panel.
				if (inAttrs.hasOwnProperty('start')) {
					container.checkPanelName(inAttrs.start);
					container.currentPanel = inAttrs.start;
				}

				// Show the current panel.
				container.showCurrentPanel();

				// Link the triggers with the directives.
				loginTrigger.bind('click', function() {
					inScope.$apply(function() { container.show('login'); });
				});

				passwordTrigger.bind('click', function() {
					inScope.$apply(function() { container.show('password'); });
				});

				registrationTrigger.bind('click', function() {
					inScope.$apply(function() { container.show('registration'); });
				});
			};
			return link;
		};

		return {
			restrict: "E",
			controller: [ '$scope', controller ],
			compile: compile,
			replace: true,

			// #########################################################################################
			// WARNING !!!
			// You **MUST** provide the "full relative" URL to the template.
			// See: https://docs.angularjs.org/error/$sce/insecurl
			// By default, only URLs that belong to the same origin are trusted.
			// These are urls with the same domain, protocol and port as the application document.
			// The application document is the HTML file that is loaded (and not the JS file).
			// #########################################################################################

			templateUrl: 'directives/templates/form-member.html'
		};

	};

	module.directive('dbMemberFormDirective', ['$animate', 'dbPanelContainerService', directive]);

})();