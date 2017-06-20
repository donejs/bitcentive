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
      return ContributionMonth.getList({});
    }
  },
  contributionMonths: {
    get: function(lastSet, resolve){
      this.contributionMonthsPromise.then(resolve);
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
  },

  get osProjectPointsMap() {
    if (!this.contributionMonths) {
        return {};
    }

    var map = {};
    this.contributionMonths.forEach((month) => {
      month.monthlyContributions.forEach((contribution) => {
        if (this.contributionMonth.contributorsMap[contribution.contributorRef._id]) {
          var projectId = contribution.osProjectRef._id;
          if(map[projectId] !== undefined) {
            map[projectId] += contribution.points;
          }
          else {
            map[projectId] = contribution.points;
          }
        }
      });
    });

    return map;
  },
  getPointTotalForOSProject(monthlyOSProject) {
      return this.osProjectPointsMap[monthlyOSProject.osProjectRef._id] || 0;
  },
  getTotalDollarsPerPointForOSProject(monthlyOSProject) {
      var points = this.getPointTotalForOSProject(monthlyOSProject);
      var dollars = monthlyOSProject.getTotal();

      return points ? (dollars / points) : dollars;
  },
});

export default Component.extend({
  tag: 'os-projects',
  ViewModel,
  view
});
