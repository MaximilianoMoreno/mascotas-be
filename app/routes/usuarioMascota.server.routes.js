'use strict';

module.exports = init;

function init(app) {
	var controller = require('../controllers/usuarioMascota.server.controller');

	app.route('/api-mascotas/usuario').get(controller.loginRequired, controller.infoUsuarios );
	app.route('/api-mascotas/register').post(controller.register);
	app.route('/api-mascotas/sign_in').post(controller.sign_in);
	app.route('/api-mascotas/sign_in_facebook').post(controller.sign_in_facebook);
	app.route('/api-mascotas/olvide_pass').post(controller.olvide_pass);
	app.route('/api-mascotas/reset_pass').post(controller.reset_pass);
	app.route('/api-mascotas/actualizarUsuario').put(controller.loginRequired, controller.update);
	app.route('/api-mascotas/usuario').delete(controller.remove);

}
