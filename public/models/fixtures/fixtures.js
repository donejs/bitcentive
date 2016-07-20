import fixture from "can-fixture";
import ContributionMonth from 'bitcentive/models/contribution-month';
import OSProject from 'bitcentive/models/os-project';
import ClientProject from 'bitcentive/models/client-project';

var osProject = new OSProject({
    _id: "somethingCrazey",
    name: "CanJS"
});

var clientProject = new ClientProject({
    _id: "asl;dfal;sfj ;lakwj",
    name: "HaulHound"
});


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
    'GET /api/contribution_months/{_id}': monthlyContributionStore.getData,
    'POST /api/contribution_months': monthlyContributionStore.create,
    'PUT /api/contribution_months/{_id}': function(req) {
      //console.log("--> ", req.data);
      // monthlyContributionStore.update();
      return req.data;
    },
    'DELETE /api/contribution_months/{_id}': monthlyContributionStore.destroy,
    'GET /api/os_projects': function(req) {
      //console.log("get osProject request: ", req)
      return req.data;
    }
      ,
    'GET /api/os_projects/{_id}': osProjectStore.getData,
    'POST /api/os_projects': osProjectStore.create,
    'PUT /api/os_projects/{_id}': osProjectStore.update,
});

window.fixture = fixture;
