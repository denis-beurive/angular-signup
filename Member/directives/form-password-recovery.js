(function() {

	var module = angular.module('dbPasswordRecoveryFormDirectiveModule', ['ngAnimate', 'dbPasswordRecoveryStartFormDirectiveModule', 'dbPasswordRecoveryErrorFormDirectiveModule', 'dbPasswordRecoveryDoneFormDirectiveModule', 'dbPanelServiceModule' ]);

	// This directive represents the password recovery form.
	var directive = function($animate, $q, dbPanelService) {

		// Create the container for the forms used within the registration process.
		var container = new dbPanelService();
		container.currentEntry    = 'password-recovery-start';
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

				var startEntry = angular.element(document.getElementsByClassName('password-recovery-start-directive'));
				var errorEntry = angular.element(document.getElementsByClassName('password-recovery-error-directive'));
				var doneEntry  = angular.element(document.getElementsByClassName('password-recovery-done-directive'));

				container.registerEntry('password-recovery-start', startEntry);
				container.registerEntry('password-recovery-error', errorEntry);
				container.registerEntry('password-recovery-done',  doneEntry);

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
			templateUrl: 'directives/templates/form-password-recovery.html'
		};

	};

	module.directive('dbPasswordRecoveryFormDirective', ['$animate', '$q', 'dbPanelService', directive]);

})();