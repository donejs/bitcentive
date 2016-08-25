'use strict';

// contributor-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contributorSchema = new Schema({
  name: { type: String, required: true },
  active: { type: Boolean }
});

const contributorModel = mongoose.model('contributor', contributorSchema);

module.exports = contributorModel;
