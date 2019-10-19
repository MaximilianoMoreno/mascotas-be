'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	MODEL_NAMES = require('../constants/model.names.server.constant'),
	_ = require('lodash');

var PaseadorSchema = new Schema({
	nombrePaseador: {
		type: String,
		default: '',
		required: 'Por favor complete el nombre del Paseador',
		trim: true
	},
	apellidoPaseador: {
		type: String,
		trim: true
	},
	emailPaseador: {
		type: String,
		default: '',
		trim: true,
		unique: true,
		match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
	},
	nroCelularPaseador: {
		type: String,
		trim: true
	},
	fechaNacimientoPaseador: {
		type: String
	},
	reputacionPaseador: {
		type: Number,
		min: 1,
		max: 5
	},
	fechaCreacion: {
		type: Date,
		default: Date.now
	}
});

mongoose.model(MODEL_NAMES.PASEADOR, PaseadorSchema);
