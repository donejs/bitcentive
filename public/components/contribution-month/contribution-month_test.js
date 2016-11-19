import QUnit from 'steal-qunit';

// Mock socket.io server:
import 'bitcentive/models/fixtures/fixtures-socket';

// Load VM:
import { ViewModel } from 'bitcentive/components/contribution-month/';

QUnit.asyncTest('test fixture socket', function(){
  let vm = new ViewModel({
    contributionMonthId: "1"
  });

  vm.contributionMonthPromise.then((contributionMonth) => {
    QUnit.equal(contributionMonth.monthlyOSProjects.length, 3, 'Loaded 3 OS projects');
    QUnit.start();
  });
});

QUnit.noop = function(){};

// ViewModel unit tests
QUnit.module('bitcentive/components/contribution-month', {
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

    this.contributionMonth = {
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
    };
  }
});

QUnit.noop('Check if the correct contribution month is loaded', function(){
    let vm = new ViewModel();
    let cm = this.contributionMonth;

    vm.contributionMonthId = this.contributionMonth._id;

    fixture({
      "POST /api/os_projects": (req, res) => {
        res({_id: "somethingRandom", name: req.data.name});
      },
      "GET /api/contribution_months/{_id}": (req, res) => {
        res(cm);
      }
    });

    vm.contributionMonthPromise.then((contributionMonth) => {
      QUnit.equal(contributionMonth.monthlyClientProjects.length, 1, 'Loaded correct monthly client projects');
      QUnit.equal(contributionMonth.monthlyOSProjects.length, 1, 'Loaded correct os projects');
      QUnit.start();
    });



});


QUnit.noop('Check if the correct contribution month totals are being calculated properly', function(){
  let vm = new ViewModel();
  let cm = this.contributionMonth;
  let clientProject = this.clientProject;
  vm.contributionMonthId = this.contributionMonth._id;

  fixture({
    "POST /api/os_projects": (req, res) => {
      res({_id: "somethingRandom", name: req.data.name});
    },
    "GET /api/contribution_months/{_id}": (req, res) => {
      res(cm);
    }
  });

  vm.contributionMonthPromise.then((contributionMonth) => {

    QUnit.equal(contributionMonth.calculations.totalDollarForAllClientProjects, 200, 'calculated correct total dollar amount for all client projects');
    QUnit.equal(contributionMonth.calculations.clientProjects[clientProject._id].rate, "2.00", 'calculated correct rate for first client project');
    QUnit.equal(contributionMonth.calculations.clientProjects[clientProject._id].totalAmount, "200.00", 'calculated correct total amount for first client project');
    QUnit.equal(contributionMonth.calculations.clientProjects[clientProject._id].totalSignificance, 80, 'calculated correct total significance for first client project');
    QUnit.start();
  });

});
