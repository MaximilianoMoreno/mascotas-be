'use strict';

module.exports = init;

function init(app) {
	var controller = require('../../app/controllers/led.admin.server.controller');
	app.route('/api/admin/led').get(controller.leds);
	app.route('/api/admin/led').post(controller.create);
	app.route('/api/admin/led/:id').put(controller.create);
	app.route('/api/admin/led/:id').delete(controller.remove);

	app.param('id', controller.getById);
}
