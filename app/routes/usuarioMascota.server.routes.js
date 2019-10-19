'use strict';

module.exports = init;

function init(app) {
	var usuarioController = require('../controllers/usuarioMascota.server.controller');

	app.route('/api-mascotas/usuario').get(usuarioController.loginRequired, usuarioController.infoUsuarios );
	app.route('/api-mascotas/register').post(usuarioController.register);
	app.route('/api-mascotas/sign_in').post(usuarioController.sign_in);
	app.route('/api-mascotas/sign_in_facebook').post(usuarioController.sign_in_facebook);
	app.route('/api-mascotas/olvide_pass').post(usuarioController.olvide_pass);
	app.route('/api-mascotas/reset_pass').post(usuarioController.reset_pass);
	app.route('/api-mascotas/actualizarUsuario').put(usuarioController.loginRequired, usuarioController.update);
	app.route('/api-mascotas/usuario').delete(usuarioController.remove);

}
