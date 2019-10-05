'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	MODEL_NAMES = require('../constants/model.names.server.constant'),
	_ = require('lodash');

var UsuarioSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Por favor complete el nombre del Usuario',
		trim: true
	},
	apellido: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		default: '',
		required: 'Por favor complete el mail de Usuario',
		trim: true,
		unique: true,
		match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	},
	facebookProvider: {
		type: {
			id: String,
			token: String
		},
		select: false
	},
	hash_password: {
		type: String,
		required: true
	},
	sexoUsuario: {
		type: String,
		trim: true
	},
	nroCelular: {
		type: String,
		trim: true
	},
	fechaNacimientoUsuario: {
		type: String
	},
	fechaCreacion: {
		type: Date,
		default: Date.now
	},
	resetPasswordToken: String,
	resetPasswordExpires: Number
});

UsuarioSchema.methods.comparePassword = function(password){
	return !_.isUndefined(this.hash_password) ? bcrypt.compareSync(password, this.hash_password) : false;
};

UsuarioSchema.statics.upsertFbUser = function(accessToken, profile, cb) {
	var That = this;
	return this.findOne({
		'facebookProvider.id': profile.id
	}, function(err, user) {
		console.log('facebook login');
		console.log(profile);
		// no user was found, lets create a new one
		if (!user) {
			console.log('nuevo usuario');
			console.log(profile);
			var mail = getMailUsuario(profile);
			var newUser = new That({
				email: mail,
				nombre: profile.first_name,
				facebookProvider: {
					id: profile.id,
					token: accessToken
				},
				tipoUsuario : "usuarioReserva",
				sexoUsuario : profile.gender,
				hash_password : bcrypt.hashSync(profile.id, 10)
			});

			newUser.save(function(error, savedUser) {
				if (error) {
					console.log(error);
				}
				return cb(error, savedUser);
			});
		} else {
			var email = user.email;
			if (email.includes(profile.id)){
				console.log('mail de contacto de facebook actualizado');
				user.email = profile.email;
				user.save(function(error, savedUser) {
					if (error) {
						console.log(error);
					}
					return cb(error, savedUser);
				});
			} else {
				return cb(err, user);
			}
		}
	});
};

function getMailUsuario(profile) {
	var mail = '';

	if (profile.emails) {
		mail = profile.emails[0].value;
	}	else if (profile.email) {
		mail = profile.email;
	} else {
		mail = profile.id + '@facebook.com';
	}

	return mail ;
}

mongoose.model(MODEL_NAMES.USUARIO_MASCOTA, UsuarioSchema);
