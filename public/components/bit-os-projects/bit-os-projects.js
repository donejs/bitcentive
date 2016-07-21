import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './bit-os-projects.less';
import template from './bit-os-projects.stache';
import OSProject from '../../models/os-project';
import ContributionMonth from '../../models/contribution-month';

export const ViewModel = DefineMap.extend({
    // Passed properties
    contributionMonth: {
        Value: ContributionMonth
    },

    // Stateful properties
    activePromise: "*",
    adding: {
        type: 'boolean',
        value: false
    },
    newOSProjectName: 'string',
    selectedOSProjectId: {type: 'string', value: '__new__'},

    allOSProjects: {
      value: function() {
        return OSProject.getList();
      }
    },
    // Derived properties
    creatingNewOSProject: {
      get: function(){
        return this.selectedOSProjectId === "__new__";
      }
    },


    // Methods
    toggleAddNewProject: function() {
        this.newOSProjectName = '';
        this.adding = !this.adding;
    },
    addNewProject: function(ev) {
        console.log("Creating a new OS Project " + this.newOSProjectName);
        ev.preventDefault();
        let newOSProject = new OSProject({
            name: this.newOSProjectName
        });
        return this.activePromise = newOSProject.save().then((osProject) => {
            this.toggleAddNewProject();
            this.selectedOSProjectId = "__new__";
            return this.contributionMonth.addNewMonthlyOSProject(osProject);
        });
    },
    logIt: function() {
        console.log('logging', arguments);
    },
    updateComissionedForMonthlyOSProject: function(monthlyOSProject, commissioned) {
        monthlyOSProject.commissioned = commissioned;

        this.activePromise = this.contributionMonth.save();
    },
    totalForMonthlyOSProject: function(monthlyOSProject) {
        return 0;
    }
});

export default Component.extend({
    tag: 'bit-os-projects',
    ViewModel: ViewModel,
    template: template
});
