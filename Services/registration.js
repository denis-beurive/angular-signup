(function() {

	var module = angular.module('dbRegistrationServiceModule', []); 

	var Singleton = {
		debug: false,
		email: undefined,

		/**
		 * Activate the debug mode for this service.
		 */
		activateDebugMode: function() {
			this.debug = true;
		},

		/**
		 * This method sets the email address of the user who is currently registering.   
		 * @param inEmail {string} Email address of the user who is currently registering.   
		 */
		setEmail: function(inEmail) {
			this.email = inEmail;
		},

		/**
		 * This method returns the email address of the user who is currently registering.   
		 * @return This method returns the email address of the user who is currently registering.   
		 */
		getEmail: function() {
			if (this.debug && ("undefined" === typeof this.email)){
				return "debug@debug.com";
			}
			return this.email;
		}
	};

	/**
	 * Service provider.
	 */
	var serviceProvider = {
		$get: function() {
			return Singleton;
		}
	};

	// Register the service into the Angular's DIC.
	module.provider('dbRegistrationService', serviceProvider);

})();

