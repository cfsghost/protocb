var net = require('net');
var ProtoCB = require('../../');

var protocb = new ProtoCB;

var client = net.connect(61115, function() {
	console.log('client connected');
});

client.on('data', function(data) {
	var msg = JSON.parse(data.toString());

	// Dispatch data package
	protocb.dispatch(msg);
});

client.on('end', function() {
	console.log('client disconnected');
});

// Listen to event
protocb.on('timestamp', function(timestamp) {
	console.log(timestamp);
});
