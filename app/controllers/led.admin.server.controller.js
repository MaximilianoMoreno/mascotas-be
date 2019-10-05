(function() {
	'use strict';

	var http = require('http'),
		MODEL_NAMES = require('../constants/model.names.server.constant'),
		mongoose = require('mongoose');

	require('bluebird').promisifyAll(mongoose);

	var Led = mongoose.model(MODEL_NAMES.LED);

	var controller = {
		"getById": getById,
		"leds": leds,
		"create": create,
		"remove": remove
	};

	module.exports = controller;

	function leds(req, res) {
		Led.find()
			.sort('number')
			.execAsync()
			.then(res.jsonp.bind(res));
			//.catch(core.handleError.bind(res));
	}

	function create(req, res) {
		var newLed = req.led || new Led({
			"name" : req.body.name,
			"number" : req.body.number,
			"type" : req.body.type,
			"status" : req.body.status
		});

		if(req.led) {
			newLed.name = req.body.name;
			newLed.number = req.body.number;
			newLed.type = req.body.type;
			newLed.status = req.body.status;
		}

		newLed.saveAsync().then(res.jsonp.bind(res));
	}

	function remove(req, res) {
		req.led.removeAsync().then(res.jsonp.bind(res));
	}

	function getById(req, res, next, id) {
		Led.findById(req.params.id, function(error, led){
			if(led) {
				req.led = led;
				next();
			} else {
				res.status(404).jsonp('No existe el id led: ' + id);
			}
		});
	}
})();
