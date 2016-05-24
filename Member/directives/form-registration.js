(function() {

	var module = angular.module('dbRegistrationFormDirectiveModule', ['ngAnimate', 'dbRegistrationStartFormDirectiveModule', 'dbRegistrationValidateEmailFormDirectiveModule', 'dbRegistrationErrorFormDirectiveModule', 'dbRegistrationDoneFormDirectiveModule', 'dbPanelServiceModule']);

	// This directive represents the registration form.
	var directive = function($animate, $q, dbPanelService) {


		// Create the container for the forms used within the registration process.
		var container = new dbPanelService();
		container.currentEntry    = 'registration-start';
		container.cssClassForShow = 'fadingInQuickly';
		container.cssClassForHide = 'fadingOutQuickly';

		var controller = function($scope) {
			// The container may be accessed by children' directives.
			this.container = container;
		};

		var compile = function(inElement, inAttrs) {
			// Please note that the parameter "inOptParentCtrl" is set because we "required" it.
			// "inOptParentCtrl" may be null.
			var link = function(inScope, inElement, inAttrs, inOptParentCtrl) {

				var startEntry         = angular.element(document.getElementsByClassName('registration-start-directive'));
				var doneEntry          = angular.element(document.getElementsByClassName('registration-done-directive'));
				var errorEntry         = angular.element(document.getElementsByClassName('registration-error-directive'));
				var validateEmailEntry = angular.element(document.getElementsByClassName('registration-validate-email-directive'));

				container.registerEntry('registration-start', startEntry);
				container.registerEntry('registration-done', doneEntry);
				container.registerEntry('registration-error', errorEntry);
				container.registerEntry('registration-validate-email', validateEmailEntry);

				container.showCurrentEntry();

				if (null != inOptParentCtrl) {
					container.parentController = inOptParentCtrl;
					container.enableAllTopContainerTriggers = inOptParentCtrl.container.enableTopContainerTriggers;
					container.disableAllTopContainerTriggers = inOptParentCtrl.container.disableTopContainerTriggers;
				}
			};
			return link;
		};

		return {
			restrict: "E",
			controller: [ '$scope', controller ],
			compile: compile,
			replace: true,
			require: "?^dbMemberFormDirective",
			templateUrl: 'directives/templates/form-registration.html'
		};

	};

	module.directive('dbRegistrationFormDirective', ['$animate', '$q', 'dbPanelService', directive]);

})();