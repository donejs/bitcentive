import QUnit from 'steal-qunit';
import { ViewModel } from './os-projects';
import fixture from 'can-fixture';
import ContributionMonth from 'bitcentive/models/contribution-month';
// ViewModel unit tests
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

QUnit.asyncTest('Can create new OS Project', function() {
    var vm = new ViewModel();

    vm.contributionMonth = this.contributionMonth;
    vm.selectedOSProjectId = "__new__";
    vm.newOSProjectName = "something";

    fixture({
        "POST /api/os_projects": (req, res) => {
            QUnit.equal(req.data.name , "something");
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

// QUnit.asyncTest('Can add an existing OSProject to Monthly Contribution', function(){
//     var vm = new ViewModel();
//
//     vm.contributionMonth = this.contributionMonth;
//     vm.selectedOSProjectId = "__donejs";
// 
//     fixture({
//         "GET /api/os_projects": (req, res) => {
//             console.log("getting os projects");
//             res({data: [this.osProject, this.osProject2]});
//             debugger;
//         },
//         "PUT /api/contribution_months/{_id}": (req, res) => {
//             console.log('Monthly os project: ', req.data.monthlyOSProjects);
//             debugger;
//             QUnit.equal(req.data.monthlyOSProjects[1].osProject.name , 'something');
//             res(res.data);
//         }
//     });
//
//     vm.addNewMonthlyOSProject().then(function() {
//         QUnit.start();
//     });
// });
