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
    async = require('async'),
    crypto = require('crypto'),
    mailer = require('../services/mailer.server.services'),
    crudTools = require('../services/crud.tools.server.services'),
    _ = require('lodash');

  require('bluebird').promisifyAll(mongoose);

  var UsuarioReserva = mongoose.model(MODEL_NAMES.USUARIO_MASCOTA);
  var request = require('request-promise');
  // you'll need to have requested 'user_about_me' permissions
  // in order to get 'quotes' and 'about' fields from search
  var userFieldSet = 'name, link, is_verified, picture';
  var pageFieldSet = 'name, category, link, picture, is_verified';

  var controller = {
    "getById": getById,
    "infoUsuarios": infoUsuarios,
    "register": register,
    "sign_in": sign_in,
    "sign_in_facebook": sign_in_facebook,
    "olvide_pass": olvide_pass,
    "reset_pass": reset_pass,
    "update": update,
    "loginRequired": loginRequired,
    "remove": remove
  };

  module.exports = controller;

  function infoUsuarios(req, res) {
    UsuarioReserva.findOne({_id: req.user._id}, 'id nombre apellido email nroCelular sexoUsuario fechaNacimientoUsuario')
      .execAsync()
      .then(function(usuario){
        console.log(usuario);
        var opcionesUsuario = {
          '_id': usuario.id || '',
          'nombre': usuario.nombre || '',
          'apellido': usuario.apellido || '',
          'email': usuario.email || '',
          'nroCelular': usuario.nroCelular || '',
          'sexoUsuario': usuario.sexoUsuario || '',
          'recibeDescuentos': usuario.recibeDescuentos || 'true',
          'fechaNacimientoUsuario': usuario.fechaNacimientoUsuario || ''
        };
        res.jsonp(opcionesUsuario);
      });
    //.catch(core.handleError.bind(res));
  }

  function remove(req, res) {
    req.led.removeAsync().then(res.jsonp.bind(res));
  }

  function getById(req, res, next, id) {
    UsuarioReserva.findById(req.params.id, function(error, led){
      if(led) {
        req.led = led;
        next();
      } else {
        res.status(404).jsonp('No existe el id usuario: ' + id);
      }
    });
  }

  function update(req, res) {
    UsuarioReserva.findById(req.user._id, function(error, usuario){
      if(usuario) {
        if(usuario) {
          usuario.nombre = req.body.nombre;
          usuario.apellido = req.body.apellido;
          usuario.sexoUsuario = req.body.sexoUsuario;
          usuario.nroCelular = req.body.nroCelular;
          usuario.fechaNacimientoUsuario = req.body.fechaNacimientoUsuario;
          usuario.sexoUsuario = req.body.sexoUsuario;
          usuario.tipoUsuario = "usuarioReserva";
          usuario.recibeDescuentos = req.body.recibeDescuentos;
        }
        usuario.saveAsync().then(res.json({token: jwt.sign({ email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido, tipoUsuario: usuario.tipoUsuario, sexoUsuario: usuario.sexoUsuario, nroCelular: usuario.nroCelular, recibeDescuentos: usuario.recibeDescuentos, fechaNacimientoUsuario: usuario.fechaNacimientoUsuario, _id: usuario._id}, 'RESTFULAPIs')}));
      } else {
        res.status(404).jsonp('No existe el Usuario con id: ' + req.params.id);
      }
    });

    crudTools.update(req, MODEL_NAMES.USUARIO_NEGOCIO).then(function (usuario){
      res.status(200).json({token: jwt.sign({ email: usuario.email, nombre: usuario.nombre, apellido: usuario.apellido, tipoUsuario: usuario.tipoUsuario, sexoUsuario: usuario.sexoUsuario, nroCelular: usuario.nroCelular, recibeDescuentos: usuario.recibeDescuentos, fechaNacimientoUsuario: usuario.fechaNacimientoUsuario, _id: usuario._id}, 'RESTFULAPIs')});
    }).catch(function (err){
      res.status(200).jsonp(err);
    });
  }

  function register(req, res){
    var newUser = new UsuarioReserva(req.body);
    newUser.tipoUsuario="usuarioReserva";
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.email = _.toLower(newUser.email);
    UsuarioReserva.findOne({
      email: _.toLower(req.body.email)
    }, function(err, user) {
      if (err) throw err;
      if (user) {
        res.status(401).json({ message: 'El correo ya se encuentra registrado. Por favor utilice otro' });
      } else {
        newUser.save(function(err, user) {
        if (err) {
          return res.status(400).jsonp({
            message: err
          });
        } else {
          mailer.mailRegistro(user);
          user.hash_password = undefined;
          return res.json({token: jwt.sign({ email: user.email, nombre: user.nombre, apellido: user.apellido, tipoUsuario: user.tipoUsuario, sexoUsuario: user.sexoUsuario, nroCelular: user.nroCelular, recibeDescuentos: user.recibeDescuentos, fechaNacimientoUsuario: user.fechaNacimientoUsuario, _id: user._id}, 'RESTFULAPIs')});
        }
      });  
      }
    });
    
  }

  function sign_in(req, res) {
    UsuarioReserva.findOne({
      email: req.body.email
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.status(401).json({ message: 'Error de autenticación. Usuario incorrecto.' });
      } else if (user) {
        if (!user.comparePassword(req.body.password)) {
          res.status(401).json({ message: 'Error de autenticación. Password incorrecto.' });
        } else {
          return res.json({token: jwt.sign({ email: user.email, nombre: user.nombre, apellido: user.apellido, tipoUsuario: user.tipoUsuario, sexoUsuario: user.sexoUsuario, nroCelular: user.nroCelular, recibeDescuentos: user.recibeDescuentos, fechaNacimientoUsuario: user.fechaNacimientoUsuario, _id: user._id}, 'RESTFULAPIs')});
        }
      }
    });
  }

  function loginRequired(req, res, next){
    //TODO: validar el tipo de usuario
    if (req.user) {
      next();
    } else {
      return res.status(401).json({ message: 'Unauthorized user!' });
    }
  }
  //https://lorenstewart.me/2017/03/12/using-node-js-to-interact-with-facebooks-graph-api/
  function sign_in_facebook(req, res){

    const getMediaOptions = {
      method: 'GET',
      uri: 'https://graph.facebook.com/me?fields=first_name,relationship_status,gender,locale,email&access_token='+ req.body.access_token
    };

    request(getMediaOptions)
      .then( function(fbRes){
        // Search results are in the data property of the response.
        // There is another property that allows for pagination of results.
        // Pagination will not be covered in this post,
        // so we only need the data property of the parsed response.
        UsuarioReserva.upsertFbUser(req.body.access_token,  JSON.parse(fbRes), function(err, user) {
          res.json({token: jwt.sign({ email: user.email, nombre: user.nombre, apellido: user.apellido, tipoUsuario: user.tipoUsuario, sexoUsuario: user.sexoUsuario, nroCelular: user.nroCelular, recibeDescuentos: user.recibeDescuentos, fechaNacimientoUsuario: user.fechaNacimientoUsuario, _id: user._id}, 'RESTFULAPIs')});        });
      }).catch(function(err){
        res.status(400).json(err);
      });
  }

  //http://sahatyalkabov.com/how-to-implement-password-reset-in-nodejs/
  function olvide_pass(req, res){
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          console.log(token);
          done(err, token);
        });
      },
      function(token, done) {
        var query = { };
        query.resetPasswordToken = token;
        query.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        UsuarioReserva.findOneAndUpdate({ email: req.body.email }, query, function (err, modeloActualizado){
          if (err) {
            res.json('No hay usuarios registrados con este mail.');
          } else {
            done(err, token, modeloActualizado);
          }
        });
      },
      function(token, user, done) {
        mailer.olvidePass(user.email, token);
        res.json('se ha enviado un email de recuparacion de contrasena');
      }
    ], function(err) {
      res.json(err);
    });
  }

  function reset_pass(req, res){
    console.log(Date.now());
    async.waterfall([
      function(done) {
        UsuarioReserva.findOne({ resetPasswordToken: req.body.resetPasswordToken}, function(err, user) {
          var expired = Date.now() > user.resetPasswordExpires;
          if (expired) {
            res.json('El token de reset de contrasena ha expirado.');
            return false;
          } else if (!user) {
            res.json('El usuario ingresado no existe.');
            return false;
          } else {
            user.hash_password = bcrypt.hashSync(req.body.password, 10);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              done(err, user);
            });
          }
        });
      },
      function(user, done) {
        console.log(user.email);
        mailer.resetPass(user.email);
        res.json('se ha enviado un email de reset de contrasena');
      }
    ], function(err) {
      res.redirect('/');
    });
  }

})();
