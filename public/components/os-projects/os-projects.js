import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './os-projects.less';
import view from './os-projects.stache';
import OSProject from '../../models/os-project';
import ContributionMonth from '../../models/contribution-month/';

export const ViewModel = DefineMap.extend({
  // Passed properties
  contributionMonth: {
    Type: ContributionMonth
  },

  // Stateful properties
  activePromise: "any",
  adding: {
    type: 'boolean',
    value: false
  },
  newOSProjectName: 'string',
  selectedOSProjectId: {
    type: 'string',
    value: '__new__'
  },
  allOSProjects: {
    value: function() {
      return OSProject.connection.getList();
    }
  },

  // Derived properties
  creatingNewOSProject: {
    get: function() {
      return this.selectedOSProjectId === "__new__";
    }
  },

  // Methods
  toggleAddNewMonthlyOSProject: function() {
    this.newOSProjectName = '';
    this.adding = !this.adding;
  },
  addNewMonthlyOSProject: function(ev) {
    if (ev) {
      ev.preventDefault();
    }
    if (this.selectedOSProjectId === '__new__') {
      let newOSProject = new OSProject({
        name: this.newOSProjectName
      });

      this.activePromise = newOSProject.save().then((osProject) => {
        this.toggleAddNewMonthlyOSProject();
        return this.contributionMonth.addNewMonthlyOSProject(osProject);
      });
    } else {
      this.activePromise = this.allOSProjects.then((projects) => {
        projects.each((proj) => {
          if (this.selectedOSProjectId === proj._id) {
            this.contributionMonth.addNewMonthlyOSProject(proj);
            this.toggleAddNewMonthlyOSProject();
          }
        });
      });
    }
    return this.activePromise;
  },
  removeMonthlyOSProject: function(osProject) {
    this.contributionMonth.removeMonthlyOSProject(osProject);
    this.activePromise = this.contributionMonth.save();
  },
  updateNameForMonthlyOSProject: function(event, osProject) {
    osProject.name = event.target.value;
    this.activePromise = osProject.save();
  },
  updateComissionedForMonthlyOSProject: function(monthlyOSProject, commissioned) {
    monthlyOSProject.commissioned = commissioned;
    this.activePromise = this.contributionMonth.save();
  },
  getTotal: function(osProject) {
    var fullTotal = this.contributionMonth.calculations.osProjects[osProject._id] || 0.0;
    return fullTotal.toFixed(2);
  }
});

export default Component.extend({
  tag: 'os-projects',
  ViewModel,
  view
});
