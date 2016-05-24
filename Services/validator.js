(function() {

	var module = angular.module('dbValidatorServiceModule', []); 

	var Validator = {

		/**
		 * This method validates a login.
		 * @param inLogin {string} Login o validate.
		 * @returns If the given login is valid, then the function returns the value true.
		 *          Otherwize, it returns the value false.
		 */
		login: function(inLogin) {
			var re = /^[a-zA-Z][\w]{2,19}$/;
			return re.test(inLogin);
		},

		/**
		 * This method validates an email address.
		 * @param inEmail {string} Email address to validate.
		 * @returns If the given email address is valid, then the function returns the value true.
		 *          Otherwize, it returns the value false.
		 */
		email: function(inEmail) {
	    	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    	return re.test(inEmail);
		},

		/**
		 * This method validates a password.
		 * @param inPassword {string} Password to validate.
		 * @returns If the given password valid, then the function returns the value true.
		 *          Otherwize, it returns the value false.
		 */
		password: function(inPassword) {
			var re = /^[\w\-\.]{8,30}$/;
			return re.test(inPassword);
		},

		/**
		 * This method validates a member ID.
		 * An ID may be an email or a login. 
		 * @param inId {string} Member ID to validate.
		 * @returns If the given member ID is valid, then the function returns the value true.
		 *          Otherwize, it returns the value false.
		 */
		id: function(inId) {
			if (this.login(inId)) {
				return true;
			}
			return this.email(inId);
		},
		
		/**
		 * This method validates a code (which should be the result of the function MD5).
		 * @param inCode {string} The code to validate.
		 * @returns If the given member code is valid, then the function returns the value true.
		 *          Otherwize, it returns the value false.
		 */
		code: function(inCode) {
			var re = /^[0-9a-f]{32}$/;
			return re.test(inCode);
		}
	};

	/**
	 * Service provider.
	 */
	var serviceProvider = {
		$get: function() {
			return Validator;
		}
	};

	// Register the service into the Angular's DIC.
	module.provider('dbValidatorService', serviceProvider);

})();

