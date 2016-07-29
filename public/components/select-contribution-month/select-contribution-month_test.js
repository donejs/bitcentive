import QUnit from 'steal-qunit';
import { ViewModel } from './select-contribution-month';
import moment from "moment";
import fixture from "can-fixture";

// ViewModel unit tests
QUnit.module('bitcentive/components/select-contribution-month',{
  setup: function(){
    localStorage.clear();
  }
});

QUnit.asyncTest('No contribution months', function(){
  fixture("GET /api/contribution_months", function(){
    return {data: []};
  });

  var vm = new ViewModel();

  vm.on("selectedContributionMonthId", function(){});
  vm.on("nextMonth", function(){});

  fixture("POST /api/contribution_months", function(req){
    return {
      _id: "fake id",
      monthlyOSProjects: [],
      monthlyClientProjects: [],
      monthlyContributions: []
    };
  });

  vm.contributionMonthsPromise.then(function(contributionMonths){
      QUnit.equal(contributionMonths.length, 0, "starting with no conribution months");
      QUnit.equal(vm.nextMonth.getTime(), moment().startOf('month').toDate().getTime(), "this month is picked");
      vm.selectedContributionMonthId = "__new__";

      contributionMonths.on("length", function(ev, newLength){

        console.log("length of contributionMonths is changing");

        QUnit.equal(newLength, 1, "got an item");
        QUnit.equal(contributionMonths[0]._id, "fake id");
        QUnit.equal(moment(contributionMonths[0].date).toDate().getTime(),
            moment().startOf('month').toDate().getTime(), "created with the right date");
        QUnit.start();
      });
  });

});
