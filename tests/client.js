var net = require('net');
var ProtoCB = require('../');

var protocb = new ProtoCB;

var client = net.connect(61115, function() {
	console.log('client connected');

	// Create a command to execute function on server-side
	var cmd = protocb.makeCommand('hello', 'Fred', function() {
		console.log('Done');
	});

	// Send this command
	client.write(JSON.stringify(cmd));


	// Create a command to execute function on server-side
	var cmd = protocb.makeCommand('hello2', 'Fred', function(arg1) {
		console.log(arg1);
	});

	// Send this command
	client.write(JSON.stringify(cmd));
});

client.on('data', function(data) {
	var msg = JSON.parse(data.toString());

	// Dispatch data package
	protocb.dispatch(msg);
});

client.on('end', function() {
	console.log('client disconnected');
});
