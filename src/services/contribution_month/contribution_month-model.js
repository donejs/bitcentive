'use strict';

// contribution_month-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// {
//   date: 124234211310000,
//   clientProjects: [{
//     clientProjectId: "123131321",
//     openSourceProjects: [{
//       openSourceProjectId: "23i1yoi31h31hn2"
//     }]
//   }],
//   osProjects: [{
//     osProjectId: "123123sdfasdf",
//     significance: 80,
//     commissioned: true
//   }],
//   contributions: [{
//     osProjectId: "123123sdfasdf",
//     points: 13,
//     contributor: "xcvbxcvbxdfasdf",
//     contribution: "I did https://github.com/canjs/canjs/issues/2437"
//   }]
// }

const clientProjectSchema = new Schema({
  clientProject: { type: Schema.Types.ObjectId, ref: 'client_project' },
  osProjects: [ { type: Schema.Types.ObjectId, ref: 'os_project' } ]
});

const osProjectSchema = new Schema({
  osProject: { type: Schema.Types.ObjectId, ref: 'os_project' },
  significance: Number,
  commisioned: { type: Boolean, default: false }
});

const contributionSchema = new Schema({
  osProject: { type: Schema.Types.ObjectId, ref: 'os_project' },
  points: Number,
  contributor: { type: Schema.Types.ObjectId, ref: 'contributor' },
  contribution: String
});

const contributionMonthSchema = new Schema({
  date: { type: Date, default: Date.now },
  clientProjects: [ clientProjectSchema ],
  osProjects: [ osProjectSchema ],
  contributions: [ contributionSchema ]
});

const contributionMonthModel = mongoose.model('contribution_month', contributionMonthSchema);

module.exports = contributionMonthModel;
