'use strict';

// client_project-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientProjectSchema = new Schema({
  name: { type: String, required: true }
});

const clientProjectModel = mongoose.model('client_project', clientProjectSchema);

module.exports = clientProjectModel;
