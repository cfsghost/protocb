
var ProtoCB = function() {
	var self = this;

	self.cbSeq = 0;
	self.eventHandlers = {};
	self.callbacks = {};
};

ProtoCB.prototype.disptch = function(data) {
	var self = this;

	switch(data.type) {
	case 'callback':

		if (self.callbacks[data.cbID]) {
			self.callbacks[data.cbID](data.args);
			delete self.callbacks[data.cbID];
		}
		break;

	case 'event':
		if (data.args) {
			var handlers = self.eventHandlers[data.name];
			if (handlers) {
				for (var id in handlers) {
					if (handlers[id]) {
						handlers[id](data.args);

						break;
					}
				}
			}
		}
		break;
	}

};

ProtoCB.prototype.on = function(event, callback) {
	var self = this;

	// Register a callback function
	self.cbSeq++;
	self.eventHandlers[event] = {}
	self.eventHandlers[event][self.cbSeq] = callback;
};

ProtoCB.prototype.off = function(event, callback) {
	var self = this;

	if (self.eventHandlers[event]) {
		for (var id in self.eventHandlers[event]) {
			if (self.eventHandlers[event][id] == callback) {
				delete self.eventHandlers[event][id];

				break;
			}
		}
	}
};

ProtoCB.prototype.makeCommand = function(cmdName, args, callback) {
	var self = this;

	// Register a callback function
	self.cbSeq++;
	self.callbacks[self.cbSeq] = callback;

	return {
		type: 'command',
		command: cmdName,
		args: args,
		cbID: self.cbSeq
	};
};
