'use strict';

// contribution-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contributionSchema = new Schema({
  description: { type: String },
  points: { type: Number }
});

const contributionModel = mongoose.model('contribution', contributionSchema);

module.exports = contributionModel;
