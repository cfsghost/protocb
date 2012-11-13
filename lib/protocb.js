"use strict";

var util = require('util');
var events = require('events');

var commander = require('./commander');

var ProtoCB = module.exports = function() {
	var self = this;

	self.StateCode = {
		Success: 0,
		NoCommand: 1
	};
	self.commander = new commander();
	self.reference = null;
};

util.inherits(ProtoCB, events.EventEmitter);

ProtoCB.prototype.dispatch = function(data, callback) {
	var self = this;

	if (!(data instanceof Object)) {
		if (callback)
			callback(new Error('Data package must be object'));

		return;
	}

	if (!data.type) {
		if (callback)
			callback(new Error('Incorrect data package format'));

		return;
	}

	switch(data.type) {
	case 'command':
		if (!data.command || !data.args) {
			if (callback)
				callback(new Error('Incorrect data package format'));

			return;
		}

		if (!self.reference) {
			if (callback)
				callback(new Error('No reference was defined'));

			return;
		}

		// Execute specific command
		self._execute(data.command, data.args, data.cbID || null, callback || null);

		break;

	case 'callback':

		if (!data.args || !(data.args instanceof Array)) {

			if (callback)
				callback(new Error('Incorrect data package format'));

			return;
		}

		self.commander.callback(data.cbID, data.args);

		break;

	case 'event':

		if (!data.name || !data.args) {
			if (callback)
				callback(new Error('Incorrect data package format'));

			return;
		}

		data.args.splice(0, 0, data.name);

		self.emit.apply(self, data.args);

		break;

	default:
		callback(new Error('No such type'));
	}
}

ProtoCB.prototype._execute = function(command, args, cbID, callback) {
	var self = this;

	if (!self.reference[command]) {
		if (callback)
			callback(new Error('No such command'));

		return;
	}

	if (!args) {
		args = [];
	} else {
		if (!(args instanceof Array)) {
			if (callback)
				callback(new Error('Argument is not array'));

			return;
		}

		// This command has callback function
		args.push(function() {

			var cbArgs = Array.prototype.slice.apply(arguments)

			process.nextTick(function() {
				if (callback) {
					callback(null, {
						state: self.StateCode.Success,
						type: 'callback',
						cbID: cbID,
						args: cbArgs
					});
				}
			});
		});
	}

	self.reference[command].apply(self.reference, args);
};

ProtoCB.prototype.makeCommand = function() {
	return this.commander.command.apply(this.commander, Array.prototype.slice.apply(arguments));
};

ProtoCB.prototype.makeEvent = function() {
	return this.commander.makeEvent.apply(this.commander, Array.prototype.slice.apply(arguments));
};
