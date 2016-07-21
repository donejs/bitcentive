import QUnit from 'steal-qunit';
import { ViewModel } from './bit-os-projects';
import fixture from 'can-fixture';
import OSProject from 'bitcentive/models/os-project';
import ClientProject from 'bitcentive/models/client-project';
import ContributionMonth from 'bitcentive/models/contribution-month';
// ViewModel unit tests
QUnit.module('bitcentive/components/bit-os-projects');

var osProject = new OSProject({
    _id: "somethingCrazey",
    name: "CanJS"
});

var clientProject = new ClientProject({
    _id: "asl;dfal;sfj ;lakwj",
    name: "HualHound"
});

var contributionMonth = new ContributionMonth({
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
});

QUnit.asyncTest('Can create new OS Project', function() {
  var vm = new ViewModel();

  vm.contributionMonth = contributionMonth;
  this.selectedOSProjectId = "__new__";
  vm.newOSProjectName = "something";

    // Create the new os project
    fixture({
        "POST /api/os_projects": (req, res) => {
            QUnit.equal(req.data.name , "something");
            res({_id: Math.random()});
        },
        "PUT /api/contribution_months/{_id}": (req, res) => {
          QUnit.equal(req.data.monthlyOSProjects[1].osProject.name , 'something');
          res({_id: Math.random()});
        }
  });

  vm.addNewMonthlyOSProject();
});
