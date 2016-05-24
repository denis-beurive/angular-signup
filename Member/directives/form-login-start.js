(function() {

	// Please note that we declare a dependency to the module "validatorDirectiveModule".
	// This module is used within the template. Indeed, within the template, we specify the element's attributes (which are directives):
	//   -  db-id-validator-directive
	//   -  db-login-validator-directive
	var module = angular.module('dbLoginStartFormDirectiveModule', ['ngAnimate', 'dbValidatorDirectiveModule']);

	// This directive represents the login form.
	var directive = function($animate, $http) {

		/**
		 * This function is used to test the form.
		 * It returns the name of the form that should be shown when the submit button is pressed.
		 * To disable the debug mode, modify the function so it returns the value null.
		 */
		var debug = function() {

			var forms = {
				error: "login-error"
			};

			return forms.error;
		};

		/**
		 * This function sends a request to the server in order to check the validity of the given authentication parameters.
		 * @param {string} 
		 */

		var login = function(inId, inPassword, inRememberMe, inUrl, inParentCtrl) {
			var request = {
				method: 'POST',
				url: inUrl,
				data: {
					jsonrpc: '2.0',
					method: 'login',
					params: { id: inId, password: inPassword, rememberMe: inRememberMe },
					id: 123456
				}
			};

			var onSuccess = function(inResponse) { alert("OK"); };

			var onError = function(inResponse) {
				inParentCtrl.container.showEntry('login-error');
			};

			// SEE: https://docs.angularjs.org/api/ng/service/$http
			$http(request).then(onSuccess, onError);
		};




		var controller = function($scope) {
			// Do not change the default values.
			$scope.loginStartContext = {
				member: { id:undefined, password:undefined, remember:false },
				disabled: { submit:true },
				parentControler: null,
				submit: function() {
					console.log("This is the default submit handler.");
				}
			}
		};

		var compile = function(inElement, inAttrs) {
			// Please note the parameter "inOptParentCtrl" is set because we "required" it.
			var link = function(inScope, inElement, inAttrs, inOptParentCtrl) {

				if (null != inOptParentCtrl) {

					console.log("<db-login-start-form-directive> is _NOT_ used alone");

					inScope.loginStartContext.parentControler = inOptParentCtrl;
					console.log("Parent controller is set");
					
					// Get the handlers to the form's buttons, then register it.
					var submitTrigger = angular.element(document.getElementsByClassName('login-start-submit-trigger'));
					inOptParentCtrl.container.registerTriggerForEntry('login-start', submitTrigger);

					inScope.loginStartContext.submit = function() {

						login(inScope.loginStartContext.member.id,
							inScope.loginStartContext.member.password,
							inScope.loginStartContext.member.remember,
							'http://webenv.localhost/php/login.php',
							inOptParentCtrl);

						/*

						var next = debug();
						inOptParentCtrl.container.disableTopContainerTriggers();
						if (null != next) {
							inOptParentCtrl.container.show(next).then(inOptParentCtrl.container.enableTopContainerTriggers);
							return;
						}

						// Otherwise, do what must be done.
						//...
						inOptParentCtrl.container.enableTopContainerTriggers();
						*/
					}
				}

				// We are looking for any modification of the couple (id, password).
				// If the two values are valid, then we enable the login button.
				inScope.$watchGroup(['loginStartContext.member.id', 'loginStartContext.member.password'], function(inOldValues, inNewValues) {
					// WARNING !!!
					// Keep in mind that the validator is, in fact, a "release function".
					// If the input value is not valid, then it is not "released" into the scope.
					// Thus, if the input value is not valid, it is not defined.
					if (("undefined" === typeof inScope.loginStartContext.member.id) ||
					    ("undefined" === typeof inScope.loginStartContext.member.password)) {
						inScope.loginStartContext.disabled.submit = true;
					} else {
						inScope.loginStartContext.disabled.submit = false;
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
			require: "?^dbLoginFormDirective",

			// #########################################################################################
			// WARNING !!!
			// You **MUST** provide the "full relative" URL to the template.
			// See: https://docs.angularjs.org/error/$sce/insecurl
			// By default, only URLs that belong to the same origin are trusted.
			// These are urls with the same domain, protocol and port as the application document.
			// The application document is the HTML file that is loaded (and not the JS file).
			// #########################################################################################

			templateUrl: 'directives/templates/form-login-start.html'
		};

	};

	module.directive('dbLoginStartFormDirective', ['$animate', '$http', directive]);

})();