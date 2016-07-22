import fixture from "can-fixture";
import ContributionMonth from 'bitcentive/models/contribution-month';
import OSProject from 'bitcentive/models/os-project';
import ClientProject from 'bitcentive/models/client-project';
import "./client-project";

var osProject = {
    _id: "somethingCrazey",
    name: "CanJS"
};

var osProjectAlt = {
    _id: "anotheraskjldf",
    name: "DoneJS"
};

var clientProject = {
    _id: "3-Haulhound",
    name: "HaulHound"
};

var clientProject2 = {
  _id: "2-Walmart",
  name: "Wal-Mart"
};

var osProjectStore = fixture.store([osProject, osProjectAlt], OSProject.algebra);

var monthlyContributionStore = fixture.store([{
    _id: "aslkfalsjklas",
    date: 124234211310000,
    monthlyOSProjects: [{
        significance: 80,
        commissioned: true,
        osProjectId: osProject
    }],
    monthlyClientProjects: [{
        monthlyClientProjectsOsProjects: [{
            osProjectId: osProject
        }],
        hours: 100,
        clientProjectId: clientProject
    },{
      monthlyClientProjectsOsProjects: [{
        osProjectId: osProject._id
      }],
      hours: 40,
      clientProjectId: clientProject2._id
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
    'GET /api/os_projects': osProjectStore.getListData,
    'GET /api/os_projects/{_id}': osProjectStore.getData,
    'POST /api/os_projects': osProjectStore.createData,
    'PUT /api/os_projects/{_id}': osProjectStore.updateData,
});

export default monthlyContributionStore;

window.fixture = fixture;
