import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './client-projects.less';
import view from './client-projects.stache';
import ClientProject from '../../models/client_project';
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
    console.log(this.isEditing);
  },
  editClientName: function(event, id) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    return ClientProject.get({ _id: id}).then(function(project) {
      if (project) {
        return project.save();
      }
    });

  }
  //clientProjectPromise: Promise
});

export default Component.extend({
  tag: 'bit-client-projects',
  view,
  ViewModel: ClientProjectVM
});
