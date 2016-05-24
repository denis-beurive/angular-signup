(function() {

	var module = angular.module('dbPanelContainerServiceModule', ['ngAnimate']); 

	/**
	 * This service provider returns an instance of a "panel's container".
	 * From the point of view of the user interface, a "panel's container" is a frame that shows one panel at a time.
	 * This frame may contain controls (such as buttons).
	 * From the developer's point of view, a panels' container is an object that:
	 *  - Define a group of panels that may contain controls (the panels' controls).
	 *  - Define a group of controls used by the user to interact with the panels.
	 *  - Provide an API - that should be used within the panels' implementations - used to change the panel shown within the container.
	 */
	var serviceProvider = {
		$get: ['$q', '$animate' , function($q, $animate) {

			var constructor = function(inContext, inFormsList) {

				// ------------------------------------------------------------------------------------------------------
				// Private properties
				// ------------------------------------------------------------------------------------------------------

				/**
				 * This variable is used whenever "this" loses its meaning.
				 */
				var self = this;

				// ------------------------------------------------------------------------------------------------------
				// Public properties
				// ------------------------------------------------------------------------------------------------------

				/**
				 * This property references the panels within the container.
				 *   o Property: panel's name.
				 *   o Value: { element: <panel's element>, trigger: <trigger> }
				 */
				this.panels = {};

				/**
				 * The name of the currently shown panel.
				 */
				this.currentPanel = null;

				/**
				 * Name of the CSS class to apply in order to show a formular.
				 */
				this.cssClassForShow = 'fadingIn';

				/**
				 * Name of the CSS class to apply in order to hide a formular.
				 */
				this.cssClassForHide = 'fadingOut';

				/**
				 * Enable all container's triggers, except the one associated to the currently shown panel.
				 * @note This method is used within promises, therefore we use "self" and not "this".
				 */
				var enableAllTriggers = function() {
					console.log("Execute enableAllTriggers()");

					for (var name in self.panels) {
						if (! self.panels.hasOwnProperty(name)) continue;
						if (name == self.currentPanel) {
							self.panels[name].trigger.attr("disabled", "disabled");
							continue;
						}
						console.log("Enable trigger " + name);
						self.panels[name].trigger.removeAttr("disabled");
					}
				};

				/**
				 * Disable all container's (panels') triggers.
				 * @note This method is used within promises, therefore we use "self" and not "this".
				 */
				var disableAllTriggers = function() {
					console.log("Execute disableAllTriggers()");

					for (var name in self.panels) {
						if (! self.panels.hasOwnProperty(name)) continue;
						console.log("Disable trigger " + name);
						self.panels[name].trigger.attr("disabled", "disabled");
					}
				};

				// ------------------------------------------------------------------------------------------------------
				// Public methods
				// ------------------------------------------------------------------------------------------------------

				this.enableTopContainerTriggers = enableAllTriggers;

				this.disableTopContainerTriggers = disableAllTriggers;

				/**
				 * Register a panel.
				 * @param {string} inName Name of the panel.
				 * @param {angular.element} inElement Element within the DOM that points to the panel.
				 * @param {angular.element} inTriggerElement Element within the DOM that points to the panel's trigger.
				 */
				this.registerPanel = function(inName, inElement, inTriggerElement) {
					if (this.panels.hasOwnProperty(inName))
						alert('The panel "' + inName + '" is already registered!');
					this.panels[inName] = { element: inElement, trigger: inTriggerElement };
				}

				/**
			 	 * Check that a given name is valid in relation to the list of registered panels.
			 	 * @param {string} inName Name to check.
			 	 * @note Please note that this method has been introduced since it make debug easier.
			 	 */
				this.checkPanelName = function(inName) {
					if (! self.panels.hasOwnProperty(inName)) {
						alert('The name "' + inName + '" is not associated with a registered panel!');
					}
				};

				/**
				 * Make a panel appear within the container.
				 */
				this.showCurrentPanel = function() {

					for (var name in this.panels) {
						if (! this.panels.hasOwnProperty(name)) continue;
						
						if (name == this.currentPanel) {
							this.panels[name]['element'].css("display", "block");
							this.panels[name]['trigger'].attr("disabled", "disabled");
							continue;
						}
						this.panels[name]['element'].css("display", "none");
					}
				};

				/**
				 * This function shows a given panel, specified by its name.
				 * @param {string} inName Name of the panel to show.
				 */

				this.showPanel = function(inName) {

					if (inName == self.currentPanel) {
						alert('WARNING: you tried to show the panel "' + inName + '", which is the panel currently shown. This will probably generate a false error message that says that a method is not defined.');
						return;
					}

					return $q(function(inResolve, inReject) {

						var panelToHide = self.panels[self.currentPanel]['element'];
						var panelToShow = self.panels[inName]['element'];

						disableAllTriggers();

						// Make the current directive fade out.
						$animate.animate(panelToHide, {}, {opacity:0}, self.cssClassForHide).then(function() {

							console.log("Execute the animation");
							panelToHide.css("display", "none");

							// Then, make the given directive fade in.
							panelToShow.css("opacity", "0");
							panelToShow.css("display", "block");

							$animate.animate(panelToShow, {}, {opacity:1}, self.cssClassForShow).then(function() {
								self.currentPanel = inName;
								enableAllTriggers();

								// Do whatever needs to be done.
								inResolve();
							});
						});
					});
				};

				/**
				 * Show a given form.
				 * @param {string} inName Name of the form to show.
				 * @note This method may be used within an event handler. Therefore, we use "self" and not "this".
				 */
				this.show = function(inName) {
					self.checkPanelName(inName);
					// We use the variable "self" because, inside the promise, "this" is related to the promise.   
					return $q(function(inResolve, inReject) {
						// Be careful if you get a message that tells you that the method "self.showDirective" is not defined.
						// Within the method's code, we "return" if the current panel to show is the one already shown.
						// In this case, no promise is returned.
						// Then the message that said that the method is not defined is just false.
						// The real error is that there is no promise to fetch the method "then" from.
						console.log(inResolve);
						self.showPanel(inName).then(inResolve);
					});
				};
			};

			return constructor;	
		}]
	};

	// Register the service into the Angular's DIC.
	module.provider('dbPanelContainerService', serviceProvider);

})();