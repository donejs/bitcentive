import fixture from "can-fixture";
import ContributionMonth from 'bitcentive/models/contribution-month';
import OSProject from 'bitcentive/models/os-project';
import ClientProject from 'bitcentive/models/client-project';

import "./client-project";
import clientProjects from "./client-projects.json";
import "./os-project";
import osProjects from "./os-projects.json";

const osProject = new OSProject(osProjects[0]);
const clientProject1 = new ClientProject(clientProjects[1]);
const clientProject2 = new ClientProject(clientProjects[2]);

var monthlyContributionStore = fixture.store([{
  _id: "1-MonthlyContribution-08-2016",
  date: 1470009600000,
  monthlyOSProjects: [{
    significance: 80,
    commissioned: true,
    osProjectRef: osProject,
  }],
  monthlyClientProjects: [{
    monthlyClientProjectsOSProjects: [{
      osProjectRef: osProject,
    }],
    hours: 100,
    clientProjectRef: clientProject1,
  },{
    monthlyClientProjectsOSProjects: [{
      osProjectRef: osProject,
    }],
    hours: 40,
    clientProjectRef: clientProject2,
  }]
}], ContributionMonth.algebra);

fixture({
    'GET /api/contribution_months': monthlyContributionStore.getListData,
    'GET /api/contribution_months/{_id}': monthlyContributionStore.getData,
    'POST /api/contribution_months': monthlyContributionStore.createData,
    'PUT /api/contribution_months/{_id}': function(req) {
      return req.data;
    },
    'DELETE /api/contribution_months/{_id}': monthlyContributionStore.destroyData,
});

export default monthlyContributionStore;

window.fixture = fixture;
