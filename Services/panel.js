(function() {

	var module = angular.module('dbPanelServiceModule', ['ngAnimate']); 

	/**
	 * This service provider returns an instance of a "panel".
	 * A "panel" is a container that contains "entries".
	 * From the point of view of the user interface, an "entries' container" is a frame that shows one entry at a time.
	 * From the developer's point of view, an entries' container is an object that:
	 *  - Define a group of entries that may contain controls (submit buttons...).
	 *  - Provide an API - that should be used within the entries' implementations - used to change the entry shown within the container.
	 */
	var serviceProvider = {
		$get: ['$q', '$animate' , function($q, $animate) {

			var constructor = function() {

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
				 * This property references the entries within the panel.
				 *   o Property: entry's name.
				 *   o Value: { element: <DOM element>, triggers: [{ element: <DOM element>, protector: <function> }, ...] }
				 */

				var entries = {};

				/**
				 * The name of the currently shown entry.
				 */
				this.currentEntry = null;

				/** 
				 * A entries' container may be injected within a higher structure that will be used to manage a set of panels.
				 * This object represents the directive's controller of the higher structure that will be used to manage a set of panels.
				 * Please note that the value of this property may be null.
				 * In that case, it means that the actual panels' container is used alone.
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
				 * Name of the CSS class to apply in order to show an entry.
				 */
				this.cssClassForShow = 'fadingIn';

				/**
				 * Name of the CSS class to apply in order to hide an entry.
				 */
				this.cssClassForHide = 'fadingOut';

				// ------------------------------------------------------------------------------------------------------
				// Private methods
				// ------------------------------------------------------------------------------------------------------

				/**
			 	 * This function enables all (registered) triggers for a given entry.
			 	 * @param {string} inEntryName Name of the entry.
			 	 * @note This method may be used within an event handler. Therefore, we use "self" and not "this".
			 	 */
				var enableAllRegisteredTriggersForEntry = function(inEntryName) {
					var triggers = entries[inEntryName]['triggers'];
					for (var i=0; i<triggers.length; i++) {
						if (null != triggers[i].protector) {
							if (! triggers[i].protector()) continue;
						}
						triggers[i].element.removeAttr("disabled");
					}
				};

				/**
			 	 * This function disables ALL registered triggers.
			 	 * @note This method may be used within an event handler. Therefore, we use "self" and not "this".
			 	 */
				var disableAllRegisteredTriggers = function() {
					for (var entryName in self.entries) {
						if (! self.entries.hasOwnProperty(entryName)) continue;
						var triggers = self.entries[inEntryName]['triggers'];
						for (var i=0; i<triggers.length; i++) triggers[i].element.attr("disabled", "disabled");
					}
				};

				// ------------------------------------------------------------------------------------------------------
				// Public methods
				// ------------------------------------------------------------------------------------------------------

				this.registerEntry = function(inName, inElement) {
					if (entries.hasOwnProperty(inName)) {
						alert('The entry which name is "' + inName + '" is already registered.');
						return;
					}
					entries[inName] = { element: inElement, triggers: [] };
				};

				this.registerTriggerForEntry = function(inEntryName, inElement, inProtector) {
					if (! entries.hasOwnProperty(inEntryName)) {
						alert('The entry which name is "' + inEntryName + '" is not registered. Can not register the trigger.');
						return;
					}
					if ("undefined" === typeof inProtector) inProtector = null;
					entries[inEntryName]['triggers'].push({ element: inElement, protector: inProtector });
				};

				this.checkEntryName = function(inEntryName) {
					if (! entries.hasOwnProperty(inEntryName)) {
						alert('The entry which name is "' + inEntryName + '" is not registered!');
						return;
					}
				};

				this.showCurrentEntry = function() {
					for (var entryName in entries) {
						if (! entries.hasOwnProperty(entryName)) continue;

						var entry = entries[entryName]['element'];
						if (entryName != this.currentEntry) {
							entry.css("display", "none");
							continue;
						}
						entry.css("display", "block");
					}
				};

				/**
				 * This function shows a given entry, specified by its name.
				 * @param {string} inEntryName Name of the entry to show.
				 * @note This method may be used within an event handler. Therefore, we use "self" and not "this".
				 */
				this.showEntry = function(inEntryName) {

					if (inEntryName == this.currentEntry) {
						console.log('WARNING: you tried to show the entry "' + inEntryName + '", which is the entry currently shown. This will probably generate a false error message that says that a method is not defined.');
						return;
					}

					return $q(function(inResolve, inReject) {

						console.log(inEntryName + ": " + self.cssClassForHide + " / " + self.cssClassForShow);

						var entryToHide = entries[self.currentEntry].element;
						var entryToShow = entries[inEntryName].element;

						disableAllRegisteredTriggers();
						self.disableTopContainerTriggers();

						// Make the current directive fade out.
						$animate.animate(entryToHide, {}, {opacity:0}, self.cssClassForHide).then(function() {

							entryToHide.css("display", "none");

							// Then, make the given directive fade in.
							entryToShow.css("opacity", "0");
							entryToShow.css("display", "block");

							$animate.animate(entryToShow, {}, {opacity:1}, self.cssClassForShow).then(function() {

								self.currentEntry = inEntryName;

								// Reactivate the triggers for the newly showed entry, and for the container itself.
								enableAllRegisteredTriggersForEntry(inEntryName);
								self.enableTopContainerTriggers();

								// Do whatever needs to be done.
								inResolve();
							});
						});
					});
				};

				/**
				 * Show a given entry.
				 * @param {string} inEntryName Name of the entry to show.
				 * @note This method may be used within an event handler. Therefore, we use "self" and not "this".
				 */
				this.show = function(inEntryName) {
					self.checkEntryName(inEntryName);
					// We use the variable "self" because, inside the promise, "this" is related to the promise.   
					return $q(function(inResolve, inReject) {
						// Be careful if you get a message that tells you that the method "self.showEntry" is not defined.
						// Within the method's code, we "return" if the current panel to show is the one already shown.
						// In this case, no promise is returned.
						// Then the message that said that the method is not defined is just false.
						// The real error is that there is no promise to fetch the method "then" from.
						self.showEntry(inEntryName).then(inResolve);
					});
				};

				/**
				 * Disable all triggers for the top-level container.  
				 * @note See the documentation for the property "parentController".
				 * @note This method should be called within triggers' callbacks.
				 * @note We use "self" instead of "this" because this method will be used within a promise ($q).				 
				 */
				this.disableTopContainerTriggers = function() {
					if (null == self.parentController) return;
					self.disableAllTopContainerTriggers();
				};

				/**
				 * Enable all triggers for the top-level container.
				 * @note See the documentation for the property "parentController".
				 * @note This method should be called within triggers' callbacks.
				 * @note We use "self" instead of "this" because this method will be used within a promise ($q).
				 */
				this.enableTopContainerTriggers = function() {
					if (null == self.parentController) return;
					self.enableAllTopContainerTriggers();
				};
			};

			return constructor;	
		}]
	};

	// Register the service into the Angular's DIC.
	module.provider('dbPanelService', serviceProvider);

})();