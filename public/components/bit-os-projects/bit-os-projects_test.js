import QUnit from 'steal-qunit';
import { ViewModel } from './bit-os-projects';

// ViewModel unit tests
QUnit.module('bitcentive/components/bit-os-projects');

/*QUnit.test('Has adding property', function(){
  var vm = new ViewModel();

  vm.contributionMonth = new ContributionMonth();
  this.selectedOSProjectId = "__new__";
  vm.newOSProjectName = "something";

  fixture("POST /api/os_projects", function(req){
    QUnit.equal(req.data.name , "something");
    res({_id: Math.random()})
  });

  fixture("POST /api/contribution_month", function(req){
    QUnit.deepEqual(req.data.monthlyOSProjects[1] , {});
    res({_id: Math.random()})
  });
  vm.addNewProject().then(function(){
    QUnit.start();
  }, function(err){
    QUnit.ok(false, "error "+err)
    QUnit.start();
  });
});*/
