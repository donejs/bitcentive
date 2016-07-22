import QUnit from 'steal-qunit';
import { ClientProjectVM } from './client-projects';
import ClientProject from 'bitcentive/models/client-project';
import OSProject from 'bitcentive/models/client-project';
import ContributionMonth from 'bitcentive/models/contribution-month';
import fixture from 'can-fixture';

// ViewModel unit tests
QUnit.module('bitcentive/components/client-projects', {

    beforeEach: function() {
        localStorage.clear();
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

        this.clientProjectAlt = {
            _id: "testClient",
            name: "Our New Test Client"
        };

        this.contributionMonth = new ContributionMonth({
            _id: "aslkfalsjklas",
            date: 124234211310000,
            monthlyOSProjects: [{
                significance: 80,
                commissioned: true,
                osProjectId: this.osProject._id,
                osProject: this.osProject
            }],
            monthlyClientProjects: [{
                monthlyClientProjectsOsProjects: [{
                    osProjectId: this.osProject._id,
                    osProject: this.osProject
                }],
                hours: 100,
                clientProjectId: this.clientProject._id,
                clientProject: this.clientProject
            }]
        });
    }
});


QUnit.asyncTest('Can add existing Client Project to contribution month', function() {
    var vm = new ClientProjectVM();

    vm.contributionMonth = this.contributionMonth;
    vm.selectedClientId = this.clientProjectAlt._id;

    fixture({
        "GET /api/client_projects": (req, res) => {
            res({data: [this.clientProject, this.clientProjectAlt]});
        },
        "PUT /api/contribution_months/{_id}": (req, res) => {
            res(req.data);
        }
    });


    vm.addClient(false, this.contributionMonth.monthlyClientProjects).then(function(){
        QUnit.equal(vm.contributionMonth.monthlyClientProjects[1].clientProject._id , "testClient");
        QUnit.start();
    });
});

QUnit.asyncTest('Add an new Client Project to contribution month', function() {
    var vm = new ClientProjectVM();

    vm.contributionMonth = this.contributionMonth;
    vm.selectedClientId = "__new__";
    vm.newClientName = "test client";

    fixture({
        "POST /api/client_projects": (req, res) => {
            res({_id: "oaidhfoshf", name: req.data.name});
        },
        "PUT /api/contribution_months/{_id}": (req, res) => {
            res(req.data);
        }
    });


    vm.addClient(false, this.contributionMonth.monthlyClientProjects).then(() => {
        QUnit.equal(vm.contributionMonth.monthlyClientProjects[1].clientProject.name , 'test client');

        QUnit.start();
    });
});
