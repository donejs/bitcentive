'use strict';

// contribution_month-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const osProjectSchema = new Schema({
  osProjectRef: { type: Schema.Types.ObjectId, ref: 'os_project' },
  significance: Number,
  commissioned: { type: Boolean, default: false }
});

const clientProjectSchema = new Schema({
  clientProjectRef: { type: Schema.Types.ObjectId, ref: 'client_project' },
  monthlyClientProjectsOSProjects: [ { type: Schema.Types.ObjectId, ref: 'os_project' } ],
  hours: Number
});

const contributionSchema = new Schema({
  osProjectRef: { type: Schema.Types.ObjectId, ref: 'os_project' },
  contributorRef: { type: Schema.Types.ObjectId, ref: 'contributor' },
  description: String,
  points: Number
});

const contributionMonthSchema = new Schema({
  date: { type: Date, default: Date.now },
  startRate: { type: Number, default: 2 },
  endRate: { type: Number, default: 4 },
  monthlyOSProjects: [ osProjectSchema ],
  monthlyClientProjects: [ clientProjectSchema ],
  monthlyContributions: [ contributionSchema ]
});

const contributionMonthModel = mongoose.model('contribution_month', contributionMonthSchema);

module.exports = contributionMonthModel;
