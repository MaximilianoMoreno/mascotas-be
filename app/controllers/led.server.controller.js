(function() {
	'use strict';

	var http = require('http'),
		MODEL_NAMES = require('../constants/model.names.server.constant'),
		mongoose = require('mongoose');

	require('bluebird').promisifyAll(mongoose);

	var Led = mongoose.model(MODEL_NAMES.LED);

	var controller = {
		"toogle": toogle
	};

	module.exports = controller;

	function toogle(req, res) {
		req.led.status = !req.led.status;

		req.led.saveAsync().then(function(led) {
			req.io.sockets.emit('leds', led._id + ';' + led.status);
			res.jsonp(led);
		});
	}
})();
