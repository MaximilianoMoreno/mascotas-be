'use strict';

module.exports = init;

function init(app) {
	var controller = require('../controllers/mascota.server.controller');

	app.route('/api-mascotas/listar-mascota').get(controller.listarMascotas );
	app.route('/api-mascotas/listar-mascota/:id').get(controller.listarMascotasporId );
	app.route('/api-mascotas/crear-mascota').post(controller.crearMascota);
	app.route('/api-mascotas/modificar-mascota').put(controller.update);
	app.route('/api-mascotas/eliminar-mascota').delete(controller.remove);
}
