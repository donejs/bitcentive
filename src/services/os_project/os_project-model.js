'use strict';

// os_project-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const osProjectSchema = new Schema({
  name: { type: String, required: true }
});

const osProjectModel = mongoose.model('os_project', osProjectSchema);

module.exports = osProjectModel;
