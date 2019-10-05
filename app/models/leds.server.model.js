'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	MODEL_NAMES = require('../constants/model.names.server.constant');

var LedSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Por favor complete el name del led',
		trim: true
	},
	number: {
		type: Number,
		default: 1,
		required: 'Por favor complete el numero de led',
		trim: true
	},
	type: {
		type: String,
		default: 'default',
		required: 'Por favor complete el type de led',
		trim: true
	},
	status: {
		type: Boolean,
		default: true,
		required: 'Por favor complete el status de led',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model(MODEL_NAMES.LED, LedSchema);
