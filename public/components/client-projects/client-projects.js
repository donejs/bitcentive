import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './client-projects.less';
import view from './client-projects.stache';
import ClientProject from '../../models/client-project';
import $ from 'jquery';


export const ClientProjectVM = DefineMap.extend({
  projects: {
    value() {
      return ClientProject.getList({});
    }
  },
  isEditing: {
    type: "boolean",
    value: true
  },
  toggleEditInput: function() {
    this.isEditing = !this.isEditing;
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
  }
});

export default Component.extend({
  tag: 'bit-client-projects',
  view,
  ViewModel: ClientProjectVM
});
