var net = require('net');
var ProtoCB = require('../../');

var protocb = new ProtoCB;

var server = net.createServer(function(c) {
	console.log('client connected');

	// Fire timestamp event to client
	setInterval(function() {
		var eventSignal = protocb.makeEvent('timestamp', new Date().getTime());

		// Send
		c.write(JSON.stringify(eventSignal));
	}, 1000);

	c.on('end', function() {
		console.log('client disconnected');
	});
}).listen(61115);
