import QUnit from 'steal-qunit';
import { ViewModel } from './select-contribution-month';
import moment from "moment";
import 'bitcentive/models/fixtures/fixtures-socket';
import { store as contributionMonthStore } from 'bitcentive/models/fixtures/contribution-months';

window.store = contributionMonthStore;

// ViewModel unit tests
QUnit.module('bitcentive/components/page-dashboard/select-contribution-month',{
  setup: function(){
    localStorage.clear();
  }
});

QUnit.skip('No contribution months', function(){

  contributionMonthStore.reset();

  var vm = new ViewModel();

  vm.contributionMonthsPromise.then(function(contributionMonths){
      QUnit.equal(contributionMonths.length, 3, "starting with no conribution months");
      QUnit.equal(vm.nextMonth.getTime(), moment().startOf('month').toDate().getTime(), "this month is picked");

      const timeout = setTimeout(()=>{
        // fail test
        QUnit.ok(false, 'contribution month list did not get new item before test timeout');
        QUnit.start();
      }, 2000);

      contributionMonths.on("length", function(ev, newLength){
        clearTimeout(timeout);
        QUnit.equal(newLength, 4, "got an item");
        QUnit.equal(moment(contributionMonths[3].date).toDate().getTime(),
            moment().startOf('month').toDate().getTime(), "created with the right date");
        QUnit.start();
      });

      vm.selectedContributionMonthId = "__new__";
  }, err => console.error("PROBLEM", err));

});
