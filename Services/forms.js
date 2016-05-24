(function() {

	var module = angular.module('dbFormServiceModule', ['ngAnimate']); 

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
				 * This object represents the associations between forms’ names and the two following data:
				 * - The element (within the document) that references the form.
				 * - The list of controls that apply to the form.
				 *
				 * The structure of this object is:
				 * {
				 *		<form's name>: {
				 *			directive: <document's element>,
				 *			triggers: [
				 *				{ element: <document's element>, protector: <protector function> },
				 * 				...
				 *			]
				 * 		},
				 *		...
				 * }
				 *
				 * Please note that the "protector function" is a function used to determine whether the trigger must be activated or not.
				 * - The protected must return the value true if the trigger must be activated.
				 * - Otherwize, it must return the value false.
				 */
				this.formsElementTriggers = {};

				/**
				 * The name of the currently shown form.
				 */
				this.currentForm = null;

				/**
				 * This object represents the association between forms' names and (CSS) class manes.
				 * The association between forms and (CSS) class must be a bijection: 
				 * One form must be associated to one, and only one, class.
				 * Each form must be enclosed within a <div> block.
				 * The block that surrounds a form must be associated to the (CSS) class associated with the form.
				 * The class will be used to locate the form within the document.
				 * - Objects’ properties are forms’ names.
				 * - Objects’ properties' values are (CSS) class' names.
				 */
				this.formClass = null;

				/** 
				 * A forms' container may be injected within a higher structure that will be used to manage a set of containers.
				 * This object represents the directive's controller of the higher structure that will be used to manage a set of containers.
				 * Please note that the value of this property may be null.
				 * In that case, it means that the actual forms' container is used alone.
				 */
				this.parentController = null;

				/**
				 * Method, within the controller of the top container, that enables all triggers registered within the top container.
				 */
				this.enableAllTopContainerTriggers = null;

				/**
				 * Method, within the controller of the top container, that disables all triggers registered within the top container.
				 */
				this.disableAllTopContainerTriggers = null;

				/**
				 * Name of the CSS class to apply in order to show a formular.
				 */
				this.cssClassForShow = 'fadingIn';

				/**
				 * Name of the CSS class to apply in order to hide a formular.
				 */
				this.cssClassForHide = 'fadingOut';

				/**
				 * List of triggers for the panel's container.
				 */
				// this.triggers = [];

				// ------------------------------------------------------------------------------------------------------
				// Private methods
				// ------------------------------------------------------------------------------------------------------

				/**
			 	 * This function activates all (registered) triggers for a given form.
			 	 * @param {string} inFormName Name of the form.
			 	 */
				var enableAllRegisteredTriggersFor = function(inFormName) {
					var triggers = self.formsElementTriggers[inFormName]['triggers'];
					for (var i=0; i<triggers.length; i++) {
						if (null != triggers[i].protector) {
							if (! triggers[i].protector()) continue;
						}
						triggers[i].element.removeAttr("disabled");
					}
				};

				/**
			 	 * This function disables ALL registered triggers (for all panels and for the container).
			 	 */
				var disableAllRegisteredTriggers = function() {
					// Disable triggers for all registered panels.
					for (var name in self.formsElementTriggers) {
						if (! self.formsElementTriggers.hasOwnProperty(name)) continue;

						var triggers = self.formsElementTriggers[name]['triggers'];
						for (var i=0; i<triggers.length; i++) {
							triggers[i].element.attr("disabled", "disabled");
						}
					}
					// Disable triggers for the container itself.
					// disableAllContainerTriggers();
				};

				// ------------------------------------------------------------------------------------------------------
				// Public methods
				// ------------------------------------------------------------------------------------------------------

				/**
			 	 * Check that a given form's name is valid in relation to the list of forms within the forms' container.   
			 	 * @param {string} inFormName Name to check.
			 	 * @param {string} inOtpMessage String to add to the error message.
			 	 * @note Please note that this method has been introduced since it make debug easier.
			 	 */
				this.checkFormName = function(inFormName, inOtpMessage) {
					if (! self.formsElementTriggers.hasOwnProperty(inFormName)) {
						var detail = "";
						if ("undefined" != typeof inOtpMessage) detail = inOtpMessage;
						alert('The name "' + inFormName + '" is not registered! ' + detail);			
					}
				};

				/**
				 * Set the list of forms' names within the forms' container.
				 * @param {Object} inForms List of forms' names within the forms' container, associated with their (CSS) class.
				 * 		  The structure of this parameter must be:
				 *		  {
				 *			<form's name>: <CSS class' name>,
				 *			<form's name>: <CSS class' name>,
				 *			...
				 *		  }
				 */
				this.setFormsList = function(inForms) {
					this.formClass = inForms;
				};

				/**
				 * Set the name of the current form to show.
				 * @param {string} inFormName Name of the form to show.
				 */
				this.setCurrentDirective = function(inFormName) {
					this.currentForm = inFormName;
				};

				/**
				 * Set the container's parent controller.
				 * @param {Object} inController The parent controller to set.
				 * @note Please note that this method should be called within the function "link".
				 */
				this.setParentController = function(inController) {
					this.parentController = inController;
				};

				/**
				 * Set the method, defined within the controller of the top container, that enables all triggers (registered within the to container).
				 * @param {function} inMethod The method.
				 */
				this.setEnableAllTopContainerTriggersCtrlMethod = function(inMethod) {
					this.enableAllTopContainerTriggers = inMethod;
				};

				/**
				 * Set the method, defined within the controller of the top container, that disables all triggers (registered within the to container).
				 * @param {function} inMethod The method.
				 */
				this.setDisableAllTopContainerTriggersCtrlMethod = function(inMethod) {
					this.disableAllTopContainerTriggers = inMethod;
				};

				/**
				 * Set the name of the CSS class used to animate the appearance of a form.
				 * @param {string} inClassName Name of the class.
				 */
				this.setCssClassForShow = function(inClassName) {
					this.cssClassForShow = inClassName;
				};

				/**
				 * Set the name of the CSS class used to animate the disappearance of a form.
				 * @param {string} inClassName Name of the class.
				 */
				this.setCssClassForHide = function(inClassName) {
					this.cssClassForHide = inClassName;
				};

				/**
				 * This method will find and register all forms' elements within the document.
				 * Form's elements are found based on their associated (CSS) classes.
				 */
				this.registerForms = function() {

					var addDirective = function(inDirectiveName, inDirectiveElement) {
						self.formsElementTriggers[inDirectiveName] = { directive: inDirectiveElement, triggers: [] };
					};

					for (var directiveName in this.formClass) {
						if (! this.formClass.hasOwnProperty(directiveName))
							continue;						
						var className = this.formClass[directiveName];
						addDirective(directiveName, angular.element(document.getElementsByClassName(className)));
					}
				};

				/**
			 	 * Register a trigger for a given form.
			 	 * @param {angular.element} inTriggerElement Handler to the trigger.
			 	 * @param {string} inFormName Name of the form.
			 	 * @param {function} inProtector Function used to determine the state of the trigger (enabled or disabled).
			 	 *        The protector' signature mus be: var protector = function() {...}
				 *        - The protected must return the value true if the trigger must be activated.
				 *        - Otherwize, it must return the value false.
			 	 */
				this.registerTriggerFor = function(inTriggerElement, inFormName, inProtector) {
					this.checkFormName(inFormName, " -> registerTriggerFor");
					if ("undefined" == typeof inProtector) inProtector = null;
					this.formsElementTriggers[inFormName]['triggers'].push({ element: inTriggerElement, protector: inProtector });
				};

				/**
				 * Make a form appear within the container's frame.
				 */
				this.showCurrentDirective = function() {

					for (var directiveName in this.formClass) {
						if (! this.formClass.hasOwnProperty(directiveName))
							continue;
						
						if (directiveName == this.currentForm) {
							this.formsElementTriggers[directiveName]['directive'].css("display", "block");
							continue;
						}
						this.formsElementTriggers[directiveName]['directive'].css("display", "none");
					}
				};

				/**
				 * This function shows a given form, specified by its name.
				 * @param {string} inFormName Name of the directive to show.
				 */

				 // showPanelWithinProcess

				this.showDirective = function(inFormName) {

					if (inFormName == this.currentForm) {
						console.log('WARNING: you tried to show the panel "' + inFormName + '", which is the panel currently shown. This will probably generate a false error message that says that a method is not defined.');
						return;
					}

					return $q(function(inResolve, inReject) {

						console.log(inFormName + ": " + self.cssClassForHide + " / " + self.cssClassForShow);

						var directiveToHide = self.formsElementTriggers[self.currentForm]['directive'];
						var directiveToShow = self.formsElementTriggers[inFormName]['directive'];

						disableAllRegisteredTriggers();
						self.disableTopContainerTriggers();

						// Make the current directive fade out.
						$animate.animate(directiveToHide, {}, {opacity:0}, self.cssClassForHide).then(function() {

							directiveToHide.css("display", "none");

							// Then, make the given directive fade in.
							directiveToShow.css("opacity", "0");
							directiveToShow.css("display", "block");

							$animate.animate(directiveToShow, {}, {opacity:1}, self.cssClassForShow).then(function() {

								self.currentForm = inFormName;

								// Reactivate the triggers for the newly showed form, and for the container itself.
								enableAllRegisteredTriggersFor(inFormName);
								self.enableTopContainerTriggers();
								// enableAllContainerTriggers();

								// Do whatever needs to be done.
								inResolve();
							});
						});
					});
				};

				/**
				 * Show a given form.
				 * @param {string} inFormName Name of the form to show.
				 * @note This method may be used within an event handler. Therefore, we use "self" and not "this".
				 */
				this.show = function(inFormName) {
					self.checkFormName(inFormName);
					// We use the variable "self" because, inside the promise, "this" is related to the promise.   
					return $q(function(inResolve, inReject) {
						// Be careful if you get a message that tells you that the method "self.showDirective" is not defined.
						// Within the method's code, we "return" if the current panel to show is the one already shown.
						// In this case, no promise is returned.
						// Then the message that said that the method is not defined is just false.
						// The real error is that there is no promise to fetch the method "then" from.
						self.showDirective(inFormName).then(inResolve);
					});
				};

				/**
				 * Disable all triggers for the top-level container.  
				 * @note See the documentation for the property "parentController".
				 * @note This method should be called within triggers' callbacks.
				 */
				this.disableTopContainerTriggers = function() {
					if (null == self.parentController) return;
					// disableAllContainerTriggers();
					self.disableAllTopContainerTriggers();
				};

				/**
				 * Enable all triggers for the top-level container.
				 * @note See the documentation for the property "parentController".
				 * @note This method should be called within triggers' callbacks.
				 */
				this.enableTopContainerTriggers = function() {
					// We use "self" instead of "this" because this method will be used within a promise ($q).
					if (null == self.parentController) return;
					self.enableAllTopContainerTriggers();
				};
			};

			return constructor;	
		}]
	};

	// Register the service into the Angular's DIC.
	module.provider('dbFormService', serviceProvider);

})();