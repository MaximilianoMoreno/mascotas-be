'use strict';

module.exports = init;

function init(app) {
	var mascotaController = require('../controllers/mascota.server.controller');

	app.route('/api-mascotas/listar-mascota').get(mascotaController.listarMascotas );
	app.route('/api-mascotas/listar-mascota/:id').get(mascotaController.listarMascotasPorId );
	app.route('/api-mascotas/crear-mascota').post(mascotaController.crearPaseador);
	app.route('/api-mascotas/modificar-mascota/:id').put(mascotaController.update);
	app.route('/api-mascotas/eliminar-mascota/:id').delete(mascotaController.remove);
}
