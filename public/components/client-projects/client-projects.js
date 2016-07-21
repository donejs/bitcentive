import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './client-projects.less';
import view from './client-projects.stache';
import ClientProject from '../../models/client-project';
import $ from 'jquery';


export const ClientProjectVM = DefineMap.extend({
  // Passed Props

  // Stateful Props

  // Derived props

  // Methods

  projects: {
    value() {
      return ClientProject.getList({});
    }
  },
  editingClientProjectIds: {
    Value: DefineMap.extend({seal: false},{}),
  },

  toggleEditInput: function(event) {
    if(event) {
      event.preventDefault();
    }
    this.isEditing = !this.isEditing;
  },
  isAddingClients: {
    type: "boolean",
    value: false
  },
  toggleClientInput: function(event){
    if (event) {
      event.preventDefault();
    }
    this.isAddingClients = !this.isAddingClients;
  },

  addClient: function(clientProject, monthlyClientProjects) {
    monthlyClientProjects.addRemoveProjects(clientProject);
  },
  editClientName: function(event, contributionMonth) {
    if (event) {
      event.preventDefault();
    }
    contributionMonth.clientProject.save();
  },
  editClientProjectHours: function(event, contributionMonth) {
    if (event) {
      event.preventDefault();
    }
    contributionMonth.save();
  },
  deleteClientProject: function(event, clientProject) {

  },
  toggleUseProject: function(contributionMonth, monthlyClientProjectsOsProjects, monthlyOsProject) {
    monthlyClientProjectsOsProjects.addRemoveProjects(monthlyOsProject);
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
  }
});

export default Component.extend({
  tag: 'bit-client-projects',
  view,
  ViewModel: ClientProjectVM
});
