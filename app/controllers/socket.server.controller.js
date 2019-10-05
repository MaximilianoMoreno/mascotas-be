(function() {
	'use strict';

	var controller = {
		"blink": blink
	};

	module.exports = controller;

	function blink(req, res, next) {
		req.io.sockets.emit('blink', req.led._id);

		next();
	}
})();
