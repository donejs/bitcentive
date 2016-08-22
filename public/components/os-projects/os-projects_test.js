import QUnit from 'steal-qunit';
import { ViewModel } from './os-projects';
import fixture from 'can-fixture';
import ContributionMonth from 'bitcentive/models/contribution-month';

//ViewModel unit tests
QUnit.module('bitcentive/components/os-projects', {
  beforeEach: function() {
    this.osProject = {
      _id: "somethingCrazey",
      name: "CanJS"
    };

    this.osProject2 = {
      _id: "__donejs",
      name: "DoneJS"
    };

    this.clientProject = {
      _id: "asl;dfal;sfj ;lakwj",
      name: "HualHound"
    };

    this.contributionMonth = new ContributionMonth({
      _id: "aslkfalsjklas",
      date: 124234211310000,
      monthlyOSProjects: [{
        significance: 80,
        commissioned: true,
        osProjectRef: this.osProject._id,
        osProject: this.osProject
      }],
      monthlyClientProjects: [{
        monthlyClientProjectsOSProjects: [{
          osProjectRef: this.osProject._id,
          osProject: this.osProject
        }],
        hours: 100,
        clientProjectRef: this.clientProject._id,
        clientProject: this.clientProject
      }]
    });
  }
});

QUnit.asyncTest('Can create new OS Project', function() {
  var vm = new ViewModel();

  vm.contributionMonth = this.contributionMonth;
  vm.selectedOSProjectId = "__new__";
  vm.newOSProjectName = "something";

  fixture({
    "POST /api/os_projects": (req, res) => {
      res({_id: "somethingRandom", name: req.data.name});
    },
    "PUT /api/contribution_months/{_id}": (req, res) => {
      res(req.data);
    }
  });

  vm.addNewMonthlyOSProject().then(() => {
    QUnit.equal(vm.contributionMonth.monthlyOSProjects[1].osProjectRef.value.name , 'something');
    QUnit.equal(vm.getTotal(vm.contributionMonth.monthlyOSProjects[1]) , '0.00');
    QUnit.start();
  });
});

QUnit.asyncTest('Can add an existing OS Project to Monthly Contribution', function() {
  var vm = new ViewModel();
  var projectToAdd = this.osProject2;

  vm.contributionMonth = this.contributionMonth;
  vm.selectedOSProjectId = projectToAdd._id ;

  fixture({
    "GET /api/os_projects": (req, res) => {
      res({data: [projectToAdd]});
    },
    "PUT /api/contribution_months/{_id}": (req, res) => {
      res(req.data);
    }
  });

  vm.addNewMonthlyOSProject().then(() => {
    QUnit.equal(vm.contributionMonth.monthlyOSProjects.length, 2);
    QUnit.equal(vm.contributionMonth.monthlyOSProjects[1].osProjectRef.value.name , projectToAdd.name);
    QUnit.start();
  });
});
