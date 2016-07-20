import fixture from "can-fixture";
import ContributionMonth from 'bitcentive/models/contribution-month';
import OSProject from 'bitcentive/models/os-project';

var osProject = {
    _id: "somethingCrazey",
    name: "CanJS"
};

var clientProject = {
    _id: "asl;dfal;sfj ;lakwj",
    name: "HualHound"
};

var osProjectStore = fixture.store([osProject], OSProject.algebra);

var monthlyContributionStore = fixture.store([{
    _id: "aslkfalsjklas",
    date: 124234211310000,
    monthlyOSProjects: [{
        significance: 80,
        commissioned: true,
        osProjectId: osProject._id,
        osProject: osProject
    }],
    monthlyClientProjects: [{
        monthlyClientProjectsOsProjects: [{
            osProjectId: osProject._id,
            osProject: osProject
        }],
        hours: 100,
        clientProjectId: clientProject._id,
        clientProject: clientProject
    }]
}], ContributionMonth.algebra);

fixture({
    'GET /api/contribution_months': monthlyContributionStore.getListData,
    'GET /api/contribution_months/{_id/{_id}': monthlyContributionStore.getData,
    'POST /api/contribution_months': monthlyContributionStore.createData,
    'PUT /api/contribution_months/{_id}': function(req) {
      console.log(req.data.monthlyOSProjects)
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
