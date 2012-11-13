var net = require('net');
var ProtoCB = require('../');

var protocb = new ProtoCB;
protocb.reference = {
	hello: function(name, callback) {
		console.log(name);

		callback();
	},
	hello2: function(name, callback) {
		console.log(name);

		callback('ooops');
	}
};

var server = net.createServer(function(client) {
	console.log('client connected');

	client.on('data', function(data) {
		var msg = JSON.parse(data.toString());

		// Dispatch data package
		protocb.dispatch(msg, function(err, cmd) {

			// Send a request, telling client the callback function can be executed right now.
			client.write(JSON.stringify(cmd));
		});
	});

	client.on('end', function() {
		console.log('client disconnected');
	});
}).listen(61115);
