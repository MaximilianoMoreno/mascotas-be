'use strict';

module.exports = init;

function init(app, io) {
	var ledAdminCtrl = require('../../app/controllers/led.admin.server.controller');
	var ledCtrl = require('../../app/controllers/led.server.controller');
	var socketCtrl = require('../../app/controllers/socket.server.controller');

	app.route('/api/led').get(ledAdminCtrl.leds);
	app.route('/api/led/:id').post(function(req, res, next) {
		req.io = io;
		next();
	}, socketCtrl.blink, ledCtrl.toogle);

	app.param('id', ledAdminCtrl.getById);
}
