import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './os-projects.stache';
import OSProject from '~/models/os-project';
import ContributionMonth from '~/models/contribution-month/';

export const ViewModel = DefineMap.extend({
  // Passed properties
  contributionMonth: ContributionMonth,
  contributionMonthsPromise: {
    default() {
      return ContributionMonth.getList({});
    }
  },

  // Stateful properties
  adding: {
    type: 'boolean',
    default: false
  },
  newOSProjectName: 'string',
  selectedOSProjectId: {
    type: 'string',
    default: null
  },
  allOSProjects: {
    default() {
      return OSProject.getList();
    }
  },

  // Derived properties
  contributionMonths: {
    get: function(lastSet, resolve){
      this.contributionMonthsPromise.then(resolve);
    }
  },
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
        projects.forEach((proj) => {
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
    return this.contributionMonths.osProjectContributionsMap(this.contributionMonth);
  },
  getPointTotalForOSProject(monthlyOSProject) {
    const osProject = this.osProjectPointsMap[monthlyOSProject.osProjectRef._id];
    return (osProject && osProject.totalPoints) || 0;
  },
	sumOSProjectSignifances() {
		let sum = 0;

    this.contributionMonth.monthlyOSProjects.forEach(project => {
			if (project.osProjectRef.value) {
			  sum += project.significance;
			}
		});

		return sum;
	},
	avgOSProjectSignifances() {
		return (this.sumOSProjectSignifances() / this.contributionMonth.monthlyOSProjects.length).toFixed(2);
	},
  sumPointsForMonthlyProjects() {
		var sum = 0;

		for (const id in this.osProjectPointsMap) {
      sum += this.osProjectPointsMap[id].totalPoints || 0;
		}

		return sum.toFixed(4);
  },
  avgTotalDollarsPerPointForOSProjects() {
		let points = 0;
		let dollars = 0;
    let projectCount = this.contributionMonth.monthlyOSProjects.length || 1;

    this.contributionMonth.monthlyOSProjects.forEach(project => {
			if (project.osProjectRef.value) {
			  dollars += project.getTotal();
			  points += this.getPointTotalForOSProject(project);
			}
		});

    return points ? (dollars / points) : dollars;
  },
  getTotalDollarsPerPointForOSProject(monthlyOSProject) {
    const points = this.getPointTotalForOSProject(monthlyOSProject);
    const dollars = monthlyOSProject.getTotal();

    return points ? (dollars / points) : dollars;
  },
});

export default Component.extend({
  tag: 'os-projects',
  ViewModel,
  view
});
