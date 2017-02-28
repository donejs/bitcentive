import Component from 'can-component';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import view from './client-projects.stache';
import ClientProject from '~/models/client-project';
import ContributionMonth from '~/models/contribution-month/';

export const ClientProjectVM = DefineMap.extend({
  // Passed properties
  contributionMonth: {
    Type: ContributionMonth
  },
  // Stateful Props
  projects: {
    value() {
      return ClientProject.getList({});
    }
  },
  selectedClientProject: ClientProject,
  editingClientProjectIds: {
    Value: DefineMap.extend({seal: false},{}),
  },
  isAddingClients: {
    type: "boolean",
    value: false
  },
  activeOSProjectList: {
    type: '*',
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
    } else {
      promise = this.projects.then((projects) => {
        projects.forEach((project) => {
          if(project._id === selectedClientId) {
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
  setSelectedClientProject: function (clientProject) {
    this.selectedClientProject = clientProject;
  },
  deleteClientProject: function(clientProject) {
    this.contributionMonth.removeClientProject(clientProject);
    return this.contributionMonth.save();
  },
  toggleUseProject: function(monthlyClientProjectsOSProjects, monthlyOsProject) {
    monthlyClientProjectsOSProjects.toggleProject(monthlyOsProject);
    return this.contributionMonth.save();
  },
});

export default Component.extend({
  tag: 'bit-client-projects',
  view,
  ViewModel: ClientProjectVM
});
