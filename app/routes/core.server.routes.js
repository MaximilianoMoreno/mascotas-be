'use strict';

module.exports = init;

function init(app) {
	var controller = require('../../app/controllers/core.server.controller');
	app.route('/').get(controller.index);
}
