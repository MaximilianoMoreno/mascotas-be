/**
 * Created by maxi on 31/07/17.
 */
(function() {
  'use strict';

  var MODEL_NAMES = require('../constants/model.names.server.constant'),
    mongoose = require('mongoose'),
    crudTools = require('../services/crud.tools.server.services');

  require('bluebird').promisifyAll(mongoose);

  var controller = {
    "listarPaseador": listarPaseador,
    "listarPaseadorPorId": listarPaseadorPorId,
    "crearPaseador": create,
    "remove": remove,
    "update": update
  };

  module.exports = controller;

  function listarPaseador(req, res) {
      crudTools.find(req, MODEL_NAMES.PASEADOR).then(function (listadoPaseadores){
          res.status(200).jsonp(listadoPaseadores);
      }).catch(function (err){
          res.status(404).jsonp(err);
      });
  }
  function listarPaseadorPorId(req, res) {
      crudTools.find(req, MODEL_NAMES.PASEADOR).then(function (detallePaseador){
          res.status(200).jsonp(detallePaseador);
      }).catch(function (err){
          res.status(404).jsonp(err);
      });
  }

  function create(req, res) {
    crudTools.create(req, MODEL_NAMES.PASEADOR).then(function (nuevoPaseador){
      res.status(200).jsonp(nuevoPaseador);
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
