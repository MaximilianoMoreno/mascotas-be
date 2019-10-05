'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	MODEL_NAMES = require('../constants/model.names.server.constant');

var MascotaSchema = new Schema({
	especieMascota: {
		type: String,
		default: '',
		required: 'Por favor complete la especie de la mascota',
		trim: true
	},
	nombreMascota: {
		type: String,
		default: '',
		required: 'Por favor complete el nombre de la mascota',
		trim: true
	},
	razaMascota: {
		type: String,
		default: '',
		required: 'Por favor complete la raza de la mascota',
		trim: true
	},
	descripcionMascota: {
		type: String,
		default: '',
		trim: true
	},
	tamanoMascota: {
		type: String,
		default: '',
		trim: true
	},
	colorMascota: {
		type: String,
		default: '',
		trim: true
	},
	pesoMascota: {
		type: String,
		default: '',
		trim: true
	},
	fechaNacimientoMascota: {
        type: Date,
        default: Date.now
	},
	fechaCreacion: {
		type: Date,
		default: Date.now
	},
	idUsuario: { type: Schema.Types.ObjectId, ref: MODEL_NAMES.USUARIO_MASCOTA }
});

mongoose.model(MODEL_NAMES.MASCOTA, MascotaSchema);

