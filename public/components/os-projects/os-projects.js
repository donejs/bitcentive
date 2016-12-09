import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './os-projects.less';
import view from './os-projects.stache';
import OSProject from '../../models/os-project';
import ContributionMonth from '../../models/contribution-month/';
import 'can-stache-converters';


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
  selectedOSProject: {
    Type: OSProject
  },

  // Derived properties
  osProjectPromise: {
    get: function() {
      return OSProject.getList()
    }
  },
  osProjectList: {
    get: function(lastSaved, resolve) {
      this.osProjectPromise.then(resolve);
    },
    value: []
  },
  osProjectsNotInMonth: {
    get: function() {
      return this.osProjectList.filter((osProject)=> {
        return !this.contributionMonth.monthlyOSProjects.has(osProject);
      });
    }
  },
  osProjectOptions: {
    get: function() {
      return this.osProjectsNotInMonth.concat(new OSProject({name: 'Add New OS Project'}));
    }
  },
  showCreateForm: {
    get: function() {
      return !!(this.selectedOSProject && this.selectedOSProject.isNew());
    }
  },

  // Methods
  toggleCreateForm: function(vm, el, ev) {
    if (ev) {
      ev.preventDefault();
    }
    this.showCreateForm = !this.showCreateForm;
  },
  toggleAddMonthlyOSProject: function() {
    this.newOSProjectName = '';
    this.showCreateForm = false;
    this.adding = !this.adding;
  },
  addMonthlyOSProject: function(vm, el, ev) {
    let promise = Promise.resolve(null);

    if (ev) {
      ev.preventDefault();
    }

    if (this.showCreateForm) {
      promise = (new OSProject({
        name: this.newOSProjectName
      }).save().then((osProject) => {
        this.toggleAddMonthlyOSProject();
        return this.contributionMonth.addNewMonthlyOSProject(osProject);
      }));
    } else {
      this.contributionMonth.addNewMonthlyOSProject(this.selectedOSProject);
      this.toggleAddMonthlyOSProject();
    }

    return promise
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
