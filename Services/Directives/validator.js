(function(){

	// This file implements the directives associated with the validators.

	var module = angular.module('dbValidatorDirectiveModule', ['dbValidatorServiceModule']);

	// -------------------------------------------------------------------------------
	// Directives
	// In order to define custom validators we need to create directives.
	// -------------------------------------------------------------------------------

	/**
	 * This function implements the directive used to hold the email validator.
	 */
	var emailDirective = function(inValidatorService) {
		var compile = function(inElement, inAttrs) {
        	var link = function(inScope, inElement, inAttrs, inNgModelController, inTranscludeFn) {
        		// Note: "db-email" will be used to reference the result of this validator within the scope.
        		inNgModelController.$validators['db-email'] = function(inModelValue, inViewValue) {
					var ok = inValidatorService.email(inViewValue);
					return ok;        			
        		}; // inController.$validators.email
        	}; // link
        	return link;
        };

		return {
			require: 'ngModel', // It will be injected into the list of parameters of the link function (as parameter "inNgModelController")
        	restrict: "A",
        	compile: compile
        };
	}; // function emailDirective()

	/**
	 * This function implements the directive used to hold the login validator.
	 */
	var loginDirective = function(inValidatorService) {
		var compile = function(inElement, inAttrs) {
        	var link = function(inScope, inElement, inAttrs, inNgModelController, inTranscludeFn) {
        		// Note: "db-login" will be used to reference the result of this validator within the scope.
        		inNgModelController.$validators['db-login'] = function(inModelValue, inViewValue) {
					var ok = inValidatorService.login(inViewValue);
					return ok;
        		}
        	};
        	return link;
        }

		return {
			require: 'ngModel', // It will be injected into the list of parameters of the link function (as parameter "inNgModelController")
        	restrict: "A",
        	compile: compile
      	};
	}; // function loginDirective()


	/**
	  * This function implements the directive used to hold the validator for the member ID.
	  * @param inValidatorService {object} The parameter comes from the registration of the directive within the module.
	  */
	var memberIdDirective = function(inValidatorService) {
		var compile = function(inElement, inAttrs) {
			// inNgModelController is the directive's required controller instance(s) or its own controller (if any).
			// The exact value depends on the directive's "require" property.
			// In the present case, the value of inNgModelController will be the controller of the directive "ngModel".
        	var link = function(inScope, inElement, inAttrs, inNgModelController, inTranscludeFn) {
        		// Please note that:
        		//    - inModelValue: this is the actual value.
        		//    - inViewValue: this is a string.
        		// https://docs.angularjs.org/api/ng/type/ngModel.NgModelController
        		// Please note that the changes of the entries' states is defined by the CSS.
        		// Note: "db-member-id" will be used to reference the result of this validator within the scope.
        		inNgModelController.$validators['db-member-id'] = function(inModelValue, inViewValue) {
        			// inScope.toto = inViewValue;
					var ok = inValidatorService.id(inViewValue);
					return ok;
        		}
        	}
        	return link;
        }

		return {
			// See: https://docs.angularjs.org/api/ng/service/$compile#-link-
			//      https://docs.angularjs.org/api/ng/directive/ngModel
			require: 'ngModel', // It will be injected into the list of parameters of the link function (as parameter "inNgModelController")
        	restrict: "A",
        	compile: compile
      	};
	}; // function memberDirective()

	/**
	 * This function implements the directive used to hold the password validator.
	 */
	var passwordDirective = function(inValidatorService) {
		var compile = function(inElement, inAttrs) {
        	var link = function(inScope, inElement, inAttrs, inNgModelController, inTranscludeFn) {
        		// Note: "db-password" will be used to reference the result of this validator within the scope.
        		inNgModelController.$validators['db-password'] = function(inModelValue, inViewValue) {
					var ok = inValidatorService.password(inViewValue);
					return ok;
        		}
        	};
        	return link;
        }

		return {
			require: 'ngModel', // It will be injected into the list of parameters of the link function (as parameter "inNgModelController")
        	restrict: "A",
        	compile: compile
      	};
	}; // function passwordDirective()

	/**
	 * This function implements the directive used to hold the code validator.
	 */
	var codeDirective = function(inValidatorService) {
		var compile = function(inElement, inAttrs) {
        	var link = function(inScope, inElement, inAttrs, inNgModelController, inTranscludeFn) {
        		inNgModelController.$validators['db-code'] = function(inModelValue, inViewValue) {
					var ok = inValidatorService.code(inViewValue);
					return ok;
        		}
        	};
        	return link;
        }

		return {
			require: 'ngModel', // It will be injected into the list of parameters of the link function (as parameter "inNgModelController")
        	restrict: "A",
        	compile: compile
      	};
	}; // function codeDirective()



	// Here we register the directives and their dependencies whithin the module.
	// Please note that all directives depend on the service "validatorService".
	// The service "validatorService" will be pass as first argument to the directives' functions.

	module.directive('dbEmailValidatorDirective',    ['dbValidatorService', emailDirective]);    // In the HTML: db-email-validator-directive
	module.directive('dbLoginValidatorDirective',    ['dbValidatorService', loginDirective]);    // In the HTML: db-login-validator-directive
	module.directive('dbMemberIdValidatorDirective', ['dbValidatorService', memberIdDirective]); // In the HTML: db-member-id-validator-directive
	module.directive('dbPasswordValidatorDirective', ['dbValidatorService', passwordDirective]); // In the HTML: db-password-validator-directive
	module.directive('dbCodeValidatorDirective',     ['dbValidatorService', codeDirective]);     // In the HTML: db-code-validator-directive

	console.log("Validator's directives loaded");


})();