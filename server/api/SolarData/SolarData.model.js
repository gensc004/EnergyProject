'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SolarDataSchema = new Schema({
   metric: String,
   timestamp: Date,
   value: Number,
   tags: Schema.Types.Mixed
});

module.exports = mongoose.model('SolarData', SolarDataSchema);