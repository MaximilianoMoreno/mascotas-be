/**
 * Created by maxi on 31/07/17.
 */
(function() {
  'use strict';

  var http = require('http'),
    MODEL_NAMES = require('../constants/model.names.server.constant'),
    jwt = require('jsonwebtoken'),
    bcrypt = require('bcrypt'),
    mongoose = require('mongoose'),
    crudTools = require('../services/crud.tools.server.services');

  require('bluebird').promisifyAll(mongoose);

  var controller = {
    "listarMascotas": listarMascotas,
    "listarMascotasporId": listarMascotasporId,
    "crearMascota": create,
    "remove": remove,
    "update": update
  };

  module.exports = controller;

  function listarMascotas(req, res) {
    // mascota.find()
    //   .execAsync()
    //   .then(res.jsonp.bind(res));
    //.catch(core.handleError.bind(res));
      crudTools.find(req, MODEL_NAMES.MASCOTA).then(function (listadoMascotas){
          res.status(200).jsonp(listadoMascotas);
      }).catch(function (err){
          res.status(404).jsonp(err);
      });
  }
  function listarMascotasporId(req, res) {
    // mascota.find()
    //   .execAsync()
    //   .then(res.jsonp.bind(res));
    //.catch(core.handleError.bind(res));
      crudTools.find(req, MODEL_NAMES.MASCOTA).then(function (listadoMascotas){
          res.status(200).jsonp(listadoMascotas);
      }).catch(function (err){
          res.status(404).jsonp(err);
      });
  }

  function create(req, res) {
    crudTools.create(req, MODEL_NAMES.MASCOTA).then(function (nuevoNegocio){
      res.status(200).jsonp(nuevoNegocio);
    }).catch(function (err){
      res.status(404).jsonp(err);
    });
  }

  function remove(req, res) {
      crudTools.remove(req, MODEL_NAMES.MASCOTA).then(function (negocioEliminado){
        res.status(200).jsonp(negocioEliminado);
      }).catch(function (err){
        res.status(404).jsonp(err);
      });
  }

  function update(req, res) {
    crudTools.update(req, MODEL_NAMES.MASCOTA).then(function (tipoNegocio){
      res.status(200).jsonp(tipoNegocio);
    }).catch(function (err){
      res.status(404).jsonp(err);
    });

  }
})();
