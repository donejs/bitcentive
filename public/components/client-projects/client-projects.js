import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './client-projects.less';
import view from './client-projects.stache';
import ClientProject from '../../models/client-project';
import ContributionMonth from '../../models/contribution-month';
import $ from 'jquery';


export const ClientProjectVM = DefineMap.extend({
  // Passed properties
    contributionMonth: {
        Value: ContributionMonth
    },
  // Stateful Props
  projects: {
    value() {
      return ClientProject.getList({});
    }
  },
  editingClientProjectIds: {
    Value: DefineMap.extend({seal: false},{}),
  },
  isAddingClients: {
    type: "boolean",
    value: false
  },
  selectedClientId: {
    type: 'string',
    value: '__new__'
  },
  newClientName: {
    type: "string",
    value: ""
  },
  // Derived props
  creatingNewClientProject: {
    get: function() {
      return this.selectedClientId === "__new__";
    }
  },

  // Methods
  toggleClientInput: function() {
    this.isAddingClients = !this.isAddingClients;
  },
  addClient: function(event, monthlyClientProjects) {
    if(event) {
      event.preventDefault();
    }
    let promise;
    let selectedClientId = this.selectedClientId;
    if(this.selectedClientId === "__new__") {
      let newClientProject = new ClientProject({
        "name": this.newClientName
      });

      promise = newClientProject.save().then((clientProject) => {
        monthlyClientProjects.toggleProject(clientProject);
        this.contributionMonth.save();
        this.newClientName = "";
        this.toggleClientInput();
        this.selectedClientId = "__new__";

      });
    }
    else {
      promise = this.projects.then(projects => {
        projects.forEach(project => {
          if( project._id === selectedClientId ) {
            monthlyClientProjects.toggleProject(project);
            this.contributionMonth.save();
            this.toggleClientInput();
            this.selectedClientId = "__new__";
          }
        });
      });
    }
    return promise;
  },
  updateClientName: function(event, contributionMonth) {
    if (event) {
      event.preventDefault();
    }
    contributionMonth.clientProject.save();
  },
  updateClientProjectHours: function(event, contributionMonth) {
    if (event) {
      event.preventDefault();
    }
    contributionMonth.save();
  },
  deleteClientProject: function(contributionMonth, clientProject) {
    contributionMonth.removeClientProject(clientProject);
    return contributionMonth.save();
  },
  toggleUseProject: function(contributionMonth, monthlyClientProjectsOsProjects, monthlyOsProject) {
    monthlyClientProjectsOsProjects.toggleProject(monthlyOsProject);
    return contributionMonth.save();
  },
  toggleEditMonthlyClientProject: function(monthlyClientProject) {
    if( this.editingClientProjectIds.get(monthlyClientProject.clientProjectRef._id) ) {
      this.editingClientProjectIds.set(monthlyClientProject.clientProjectRef._id, undefined);
    } else {
      this.editingClientProjectIds.set(monthlyClientProject.clientProjectRef._id, true);
    }
  },
  isEditingMonthlyClientProject: function(monthlyClientProject){
    return this.editingClientProjectIds.get(monthlyClientProject.clientProjectRef._id);
  }
});

export default Component.extend({
  tag: 'bit-client-projects',
  view,
  ViewModel: ClientProjectVM
});
