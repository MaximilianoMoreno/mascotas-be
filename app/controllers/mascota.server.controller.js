/**
 * Created by maxi on 31/07/17.
 */
(function () {
    'use strict';

    var MODEL_NAMES = require('../constants/model.names.server.constant'),
        mongoose = require('mongoose'),
        crudTools = require('../services/crud.tools.server.services');

    var Mascota = mongoose.model(MODEL_NAMES.MASCOTA);

    require('bluebird').promisifyAll(mongoose);

    var controller = {
        "listarMascotas": listarMascotas,
        "listarMascotasPorId": listarMascotasPorId,
        "listarMascotasdeUsuario": listarMascotasdeUsuario,
        "crearPaseador": create,
        "remove": remove,
        "update": update
    };

    module.exports = controller;

    function listarMascotas(req, res) {
        crudTools.find(req, MODEL_NAMES.MASCOTA).then(function (listadoMascotas) {
            res.status(200).jsonp(listadoMascotas);
        }).catch(function (err) {
            res.status(404).jsonp(err);
        });
    }

    function listarMascotasPorId(req, res) {
        crudTools.find(req, MODEL_NAMES.MASCOTA).then(function (listadoMascotas) {
            res.status(200).jsonp(listadoMascotas);
        }).catch(function (err) {
            res.status(404).jsonp(err);
        });
    }


    function listarMascotasdeUsuario(req, res) {
        Mascota.find({idUsuario: req.user._id})
            .then(function (listadoMascotas) {
                res.status(200).jsonp(listadoMascotas);
            }).catch(function (err) {
                res.status(404).jsonp(err);
            });
    }

    function create(req, res) {
        crudTools.create(req, MODEL_NAMES.MASCOTA).then(function (nuevaMascota) {
            res.status(200).jsonp(nuevaMascota);
        }).catch(function (err) {
            res.status(404).jsonp(err);
        });
    }

    function remove(req, res) {
        crudTools.remove(req, MODEL_NAMES.MASCOTA).then(function (negocioEliminado) {
            res.status(200).jsonp(negocioEliminado);
        }).catch(function (err) {
            res.status(404).jsonp(err);
        });
    }

    function update(req, res) {
        crudTools.update(req, MODEL_NAMES.MASCOTA).then(function (tipoNegocio) {
            res.status(200).jsonp(tipoNegocio);
        }).catch(function (err) {
            res.status(404).jsonp(err);
        });

    }
})();
