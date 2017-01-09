'use strict';

// user-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  github: {},
  githubId: {type: Number},
  isAdmin: { type: Boolean, default: false }
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;
