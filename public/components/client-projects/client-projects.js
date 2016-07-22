import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './client-projects.less';
import view from './client-projects.stache';
import ClientProject from '../../models/client-project';
import $ from 'jquery';


export const ClientProjectVM = DefineMap.extend({
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
    this.projects.then(projects => {
      projects.forEach(project => {
        if( project._id === this.selectedClientId ) {
          monthlyClientProjects.toggleProject(project);    
        }
      });
    });
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
    contributionMonth.save();
  },
  toggleUseProject: function(contributionMonth, monthlyClientProjectsOsProjects, monthlyOsProject) {
    monthlyClientProjectsOsProjects.toggleProject(monthlyOsProject);
    contributionMonth.save();
  },
  toggleEditMonthlyClientProject: function(monthlyClientProject) {
    if( this.editingClientProjectIds.get(monthlyClientProject.clientProjectId) ) {
      this.editingClientProjectIds.set(monthlyClientProject.clientProjectId, undefined);
    } else {
      this.editingClientProjectIds.set(monthlyClientProject.clientProjectId, true);
    }
  },
  isEditingMonthlyClientProject: function(monthlyClientProject){
    return this.editingClientProjectIds.get(monthlyClientProject.clientProjectId)
  },
  getRate: function(monthlyClientProject){
    const calc = this.contributionMonth.getCalculations(monthlyClientProject);
    return calc.rate;
  },
  getTotal: function(monthlyClientProject){
    const calc = this.contributionMonth.getCalculations(monthlyClientProject);
    return calc.total;
  }
});

export default Component.extend({
  tag: 'bit-client-projects',
  view,
  ViewModel: ClientProjectVM
});
