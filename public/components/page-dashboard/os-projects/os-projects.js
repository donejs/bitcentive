import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './os-projects.stache';
import OSProject from '~/models/os-project';
import ContributionMonth from '~/models/contribution-month/';

export const ViewModel = DefineMap.extend({
  // Passed properties
  contributionMonth: ContributionMonth,
  contributionMonthsPromise: {
    value: function(){
      return ContributionMonth.getList({})
    }
  },
  contributionMonths: {
    get: function(lastSet, resolve){
      return this.contributionMonthsPromise.then(resolve)
    }
  },
  // Stateful properties
  adding: {
    type: 'boolean',
    value: false
  },
  newOSProjectName: 'string',
  selectedOSProjectId: {
    type: 'string',
    value: null
  },
  allOSProjects: {
    value: function() {
      return OSProject.getList();
    }
  },

  // Derived properties
  creatingNewOSProject: {
    get: function() {
      return this.selectedOSProjectId === null;
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
    if (this.selectedOSProjectId === null) {
      let newOSProject = new OSProject({
        name: this.newOSProjectName
      });

	    return newOSProject.save().then((osProject) => {
        this.toggleAddNewMonthlyOSProject();
        return this.contributionMonth.addNewMonthlyOSProject(osProject);
      });
    } else {
	    return this.allOSProjects.then((projects) => {
        projects.each((proj) => {
          if (this.selectedOSProjectId === proj._id) {
            this.contributionMonth.addNewMonthlyOSProject(proj);
            this.toggleAddNewMonthlyOSProject();
          }
        });
      });
    }
  }
});

export default Component.extend({
  tag: 'os-projects',
  ViewModel,
  view,
  helpers: {
    divide: function(a, b){
      return a / b;
    },
    dollarFormat: function(num){
      return '$' + num.toFixed(2);
    }
  }
});
