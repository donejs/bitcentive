'use strict';

// contribution_month-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const osProjectSchema = new Schema({
  clientProjectRef: { type: Schema.Types.ObjectId, ref: 'os_project' },
  significance: Number,
  commisioned: { type: Boolean, default: false }
});

const clientProjectSchema = new Schema({
  clientProjectRef: { type: Schema.Types.ObjectId, ref: 'client_project' },
  monthlyClientProjectsOSProjects: [ { type: Schema.Types.ObjectId, ref: 'os_project' } ],
  hours: Number
});

const contributionSchema = new Schema({
  clientProjectRef: { type: Schema.Types.ObjectId, ref: 'os_project' },
  points: Number,
  contributor: { type: Schema.Types.ObjectId, ref: 'contributor' },
  contribution: String
});

const contributionMonthSchema = new Schema({
  date: { type: Date, default: Date.now },
  monthlyOSProjects: [ osProjectSchema ],
  monthlyClientProjects: [ clientProjectSchema ],
  monthlyContributions: [ contributionSchema ]
});

const contributionMonthModel = mongoose.model('contribution_month', contributionMonthSchema);

module.exports = contributionMonthModel;
