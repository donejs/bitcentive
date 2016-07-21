import QUnit from 'steal-qunit';
import { ClientProjectVM } from './client-projects';
import ClientProject from 'bitcentive/models/client-project';
import OSProject from 'bitcentive/models/client-project';

// ViewModel unit tests
QUnit.module('bitcentive/components/client-projects');

// QUnit.test('Has message', function(){
//   var osProject = new OSProject({
//     _id: "somethingCrazey",
//     name: "CanJS"
//   });
//   var osProject2 = new OSProject({
//     _id: "232131",
//     name: "DoneJS"
//   });
//   var clientProject = new ClientProject({
//     _id: "asl;dfal;sfj ;lakwj",
//     name: "HaulHound"
//   });

//   var vm = new ClientProjectVM({
//     new ContributionMonth({
//       _id: "aslkfalsjklas",
//       date: 124234211310000,
//       monthlyOSProjects: [{
//         significance: 80,
//         commissioned: true,
//         osProjectId: osProject._id,
//         osProject: osProject
//       },{
//         significance: 10,
//         commissioned: true,
//         osProjectId: osProject2._id,
//         osProject: osProject2
//       }],
//       monthlyClientProjects: [{
//         monthlyClientProjectsOsProjects: [{
//           osProjectId: osProject._id,
//           osProject: osProject
//         }],
//         hours: 70,
//         clientProjectId: clientProject._id,
//         clientProject: clientProject
//       }]
//     })


//   });
//   // QUnit.equal(vm.message, 'This is the bit-client-projects component');
// });
