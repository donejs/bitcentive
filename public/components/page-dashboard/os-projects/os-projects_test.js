import QUnit from 'steal-qunit';
import 'bitcentive/models/fixtures/fixtures-socket';
import { ViewModel } from './os-projects';
import ContributionMonth from 'bitcentive/models/contribution-month/';
import { store as contributionMonthStore } from 'bitcentive/models/fixtures/contribution-months';

//ViewModel unit tests
QUnit.module('bitcentive/components/page-dashboard/os-projects', {
  beforeEach: function() {
    this.osProject = {
      _id: "somethingCrazey",
      name: "CanJS"
    };

    this.osProject2 = {
      _id: "2-DoneJS",
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

QUnit.test('Can create new OS Project', function(assert) {
  var done = assert.async();

  contributionMonthStore.reset();
  var vm = new ViewModel();

  vm.contributionMonth = this.contributionMonth;
  vm.selectedOSProjectId = "__new__";
  vm.newOSProjectName = "something";

  vm.addNewMonthlyOSProject().then(() => {
    QUnit.equal(vm.contributionMonth.monthlyOSProjects[1].osProjectRef.value.name , 'something');
    QUnit.equal(vm.getTotal(vm.contributionMonth.monthlyOSProjects[1]) , '0.00');
    done();
  });
});

QUnit.test('Can add an existing OS Project to Monthly Contribution', function(assert) {
  var done = assert.async();

  contributionMonthStore.reset();
  var vm = new ViewModel();
  var projectToAdd = this.osProject2;

  vm.contributionMonth = this.contributionMonth;
  vm.selectedOSProjectId = projectToAdd._id;

  vm.addNewMonthlyOSProject().then(() => {
    QUnit.equal(vm.contributionMonth.monthlyOSProjects.length, 2, 'should be 2 projects');
    QUnit.equal(vm.contributionMonth.monthlyOSProjects[1].osProjectRef.value.name , projectToAdd.name, 'name should be set');
    done();
  });
});
