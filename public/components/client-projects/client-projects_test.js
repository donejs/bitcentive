import QUnit from 'steal-qunit';
import { ClientProjectVM } from './client-projects';
import ClientProject from 'bitcentive/models/client-project';
import OSProject from 'bitcentive/models/client-project';
import ContributionMonth from 'bitcentive/models/contribution-month';
import fixture from 'can-fixture';

// ViewModel unit tests
// QUnit.module('bitcentive/components/client-projects', {
//
//     beforeEach: function() {
//         localStorage.clear();
//         this.osProject = {
//             _id: "somethingCrazey",
//             name: "CanJS"
//         };
//
//         this.osProject2 = {
//           _id: "__donejs",
//           name: "DoneJS"
//         };
//
//         this.clientProject = {
//             _id: "asl;dfal;sfj ;lakwj",
//             name: "HualHound"
//         };
//
//         this.clientProjectAlt = {
//             _id: "testClient",
//             name: "Our New Test Client"
//         };
//
//         this.osProjectAlt = {
//           _id: "__bitballs",
//           name: "Bit Balls"
//         };
//
//         this.contributionMonth = new ContributionMonth({
//             _id: "aslkfalsjklas",
//             date: 124234211310000,
//             monthlyOSProjects: [{
//                 significance: 80,
//                 commissioned: true,
//                 osProjectRef: this.osProject._id,
//                 osProject: this.osProject
//             }],
//             monthlyClientProjects: [{
//                 monthlyClientProjectsOsProjects: [{
//                     osProjectRef: this.osProject._id,
//                     osProject: this.osProject
//                 }],
//                 hours: 100,
//                 clientProjectRef: this.clientProject._id,
//                 clientProject: this.clientProject
//             }]
//         });
//
//
//     }
// });
//
//
// QUnit.asyncTest('Can add existing Client Project to contribution month', function() {
//     var vm = new ClientProjectVM();
//
//     vm.contributionMonth = this.contributionMonth;
//     vm.selectedClientId = this.clientProjectAlt._id;
//
//     fixture({
//         "GET /api/client_projects": (req, res) => {
//             res({data: [this.clientProject, this.clientProjectAlt]});
//         },
//         "PUT /api/contribution_months/{_id}": (req, res) => {
//             res(req.data);
//         }
//     });
//
//     vm.addClient(false, this.contributionMonth.monthlyClientProjects).then(function(){
//         QUnit.equal(vm.contributionMonth.monthlyClientProjects[1].clientProject._id , "testClient");
//         QUnit.start();
//     });
// });
//
// QUnit.asyncTest('Add an new Client Project to contribution month', function() {
//     var vm = new ClientProjectVM();
//
//     vm.contributionMonth = this.contributionMonth;
//     vm.selectedClientId = "__new__";
//     vm.newClientName = "test client";
//
//     fixture({
//         "POST /api/client_projects": (req, res) => {
//             res({_id: "oaidhfoshf", name: req.data.name});
//         },
//         "PUT /api/contribution_months/{_id}": (req, res) => {
//             res(req.data);
//         }
//     });
//
//
//     vm.addClient(false, this.contributionMonth.monthlyClientProjects).then(() => {
//         QUnit.equal(vm.contributionMonth.monthlyClientProjects[1].clientProject.name , 'test client');
//
//         QUnit.start();
//     });
// });
//
// QUnit.asyncTest('Add an OS project to a monthly client project', function() {
//     var vm = new ClientProjectVM();
//     const newMonthlyOSProject = {
//         osProjectRef: this.osProjectAlt._id,
//         osProject: this.osProjectAlt
//     };
//     vm.contributionMonth = this.contributionMonth;
//
//     fixture({
//         "PUT /api/contribution_months/{_id}": (req, res) => {
//             res(req.data);
//         }
//     });
//     const monthlyClientProjectsOsProjects = vm.contributionMonth.monthlyClientProjects[0].monthlyClientProjectsOsProjects;
//     vm.toggleUseProject(vm.contributionMonth, monthlyClientProjectsOsProjects, newMonthlyOSProject).then( () => {
//         QUnit.equal(vm.contributionMonth.monthlyClientProjects[0].monthlyClientProjectsOsProjects.length , 2);
//         QUnit.equal(vm.contributionMonth.monthlyClientProjects[0].monthlyClientProjectsOsProjects[1].osProjectRef._id , newMonthlyOSProject.osProjectRef);
//         QUnit.start();
//     });
// });
//
// QUnit.asyncTest('Remove an OS project to a monthly client project', function() {
//     var vm = new ClientProjectVM();
//     const newMonthlyOSProject = {
//         osProjectRef: this.osProject._id,
//         osProject: this.osProject
//     };
//     vm.contributionMonth = this.contributionMonth;
//
//     fixture({
//         "PUT /api/contribution_months/{_id}": (req, res) => {
//             res(req.data);
//         }
//     });
//     const monthlyClientProjectsOsProjects = vm.contributionMonth.monthlyClientProjects[0].monthlyClientProjectsOsProjects;
//     vm.toggleUseProject(vm.contributionMonth, monthlyClientProjectsOsProjects, newMonthlyOSProject).then(() => {
//         QUnit.equal(vm.contributionMonth.monthlyClientProjects[0].monthlyClientProjectsOsProjects.length , 0);
//         QUnit.start();
//     });
// });
//
// QUnit.asyncTest('Create new monthly client from empty list', function() {
//     var vm = new ClientProjectVM();
//     vm.contributionMonth = this.contributionMonth;
//
//     fixture({
//         "GET /api/client_projects": (req, res) => {
//             res({data: [this.clientProject, this.clientProjectAlt]});
//         },
//         "PUT /api/contribution_months/{_id}": (req, res) => {
//             res(req.data);
//         }
//     });
//
//     vm.deleteClientProject(this.contributionMonth, this.clientProject).then(()=>{
//         QUnit.equal(vm.contributionMonth.monthlyClientProjects.length , 0, "Successfully removed all monthly client projects");
//         //QUnit.start();
//         //QUnit.stop();
//     });
//
//
//
//     vm.selectedClientId = this.clientProjectAlt._id;
//     vm.addClient(false, this.contributionMonth.monthlyClientProjects).then(function(){
//         QUnit.equal(vm.contributionMonth.monthlyClientProjects[0].clientProject._id , "testClient", "Successfully add monthly client project to an empty list");
//         QUnit.start();
//     });
// });
