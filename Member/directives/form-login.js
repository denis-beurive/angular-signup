(function() {

	var module = angular.module('dbLoginFormDirectiveModule', ['ngAnimate', 'dbLoginStartFormDirectiveModule', 'dbLoginErrorFormDirectiveModule', 'dbPanelServiceModule']);

	// This directive represents the registration form.
	var directive = function($animate, $q, dbPanelService) {

		// Create the container for the forms used within the registration process.
		var container = new dbPanelService();
		container.currentEntry    = 'login-start';
		container.cssClassForShow = 'fadingInQuickly';
		container.cssClassForHide = 'fadingOutQuickly';


		var controller = function($scope) {
			// The container may be accessed by children' directives.
			this.container = container;
		};

		var compile = function(inElement, inAttrs) {
			// Please note the parameter "inOptParentCtrl" is set because we "required" it.
			var link = function(inScope, inElement, inAttrs, inOptParentCtrl) {

				var startEntry = angular.element(document.getElementsByClassName('login-start-directive'));
				var errorEntry = angular.element(document.getElementsByClassName('login-error-directive'));
				var errorUnexpectedEntry = angular.element(document.getElementsByClassName('login-error-unexpected-directive'));

				container.registerEntry('login-start', startEntry);
				container.registerEntry('login-error', errorEntry);
				container.registerEntry('login-error-unexpected', errorUnexpectedEntry);

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
			templateUrl: 'directives/templates/form-login.html'
		};

	};

	module.directive('dbLoginFormDirective', ['$animate', '$q', 'dbPanelService', directive]);

})();