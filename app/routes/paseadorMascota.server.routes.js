'use strict';

module.exports = init;

function init(app) {
    var paseadorController = require('../controllers/paseador.server.controller');

    app.route('/api-mascotas/listar-paseador').get(paseadorController.listarPaseador );
    app.route('/api-mascotas/listar-paseador/:id').get(paseadorController.listarPaseadorPorId );
    app.route('/api-mascotas/crear-paseador').post(paseadorController.crearPaseador);
    app.route('/api-mascotas/modificar-paseador/:id').put(paseadorController.update);
    app.route('/api-mascotas/eliminar-paseador/:id').delete(paseadorController.remove);
}
