"use strict";

var Commander = module.exports = function() {
	var self = this;

	self.cbSeq = 0;
	self.callbacks = {};
};

Commander.prototype.registerCallback = function(callback) {
	var self = this;

	// Register a callback function
	self.cbSeq++;
	self.callbacks[self.cbSeq] = callback;

	return self.cbSeq;
};

Commander.prototype.callback = function(callbackID, args) {
	var self = this;

	if (self.callbacks[callbackID]) {
		self.callbacks[callbackID].apply(self.callbacks[callbackID], args);
		delete self.callbacks[callbackID];
	}
};

Commander.prototype.command = function(cmdName) {
	var self = this;
	var args = [];
	var callback = null;
	var cbID = 0;

	// Getting last argument if it's callback function
	if (arguments[arguments.length - 1] instanceof Function) {

		// Take of this argument
		callback = arguments[arguments.length - 1];
		arguments.length--;
	}

	// Getting all arguments for this command
	var argc = arguments.length;
	if (argc > 1) {
		for (var i = 1; i < argc; i++) {
			args.push(arguments[i]);
		}
	}

	// Register callback function
	if (callback)
		cbID = self.registerCallback(callback);

	return {
		type: 'command',
		command: cmdName,
		args: args,
		cbID: cbID || null
	};
};

Commander.prototype.makeEvent = function(eventName) {
	var self = this;

	var args = [];

	// Getting all arguments for this command
	var argc = arguments.length;
	if (argc > 1) {
		for (var i = 1; i < argc; i++) {
			args.push(arguments[i]);
		}
	}

	return {
		type: 'event',
		name: eventName,
		args: args
	};
};
