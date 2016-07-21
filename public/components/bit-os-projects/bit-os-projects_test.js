import QUnit from 'steal-qunit';
import { ViewModel } from './bit-os-projects';
import fixture from 'can-fixture';
import OSProject from 'bitcentive/models/os-project';
import ClientProject from 'bitcentive/models/client-project';
import ContributionMonth from 'bitcentive/models/contribution-month';
import DefineList from 'can-define/list/';
// ViewModel unit tests
QUnit.module('bitcentive/components/bit-os-projects');

var osProject = {
    _id: "somethingCrazey",
    name: "CanJS"
};

var osProject2 = {
  _id: "__donejs",
  name: "DoneJS"
};

var osProjectStore = fixture.store([osProject], OSProject.algebra);

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
  vm.selectedOSProjectId = "__new__";
  vm.newOSProjectName = "something";

  fixture({
        "POST /api/os_projects": (req, res) => {
            QUnit.equal(req.data.name , "something");
            debugger;
            res({_id: "oaidhfoshf", name: req.data.name});
        },
        "PUT /api/contribution_months/{_id}": (req, res) => {
            QUnit.equal(req.data.monthlyOSProjects[1].osProject.name , 'something');
            res(req.data);
        }
  });


  vm.addNewMonthlyOSProject().then(function(){
    QUnit.start();
  });



});




QUnit.asyncTest('Can add an existing OSProject to Monthly Contribution', function(){
  var vm = new ViewModel();
  vm.contributionMonth = contributionMonth;
  vm.selectedOSProjectId = "__donejs";
  fixture({
        "GET /api/os_projects": (req, res) => {
          console.log("getting os projects");
          return new DefineList([osProject]);
        },
        "PUT /api/contribution_months/{_id}": (req, res) => {
          console.log('Monthly os project: ', req.data.monthlyOSProjects);
          QUnit.equal(req.data.monthlyOSProjects[1].osProject.name , 'something');
          res(res.data);
        }
  });
  debugger;
  vm.addNewMonthlyOSProject();
});
