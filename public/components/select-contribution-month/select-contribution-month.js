import moment from 'moment';
import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './select-contribution-month.less';
import view from './select-contribution-month.stache';
import ContributionMonth from 'bitcentive/models/contribution-month/';

export const ViewModel = DefineMap.extend({
  selectedContributionMonthId: {
    type: "string",
    value: null,
    get: function(lastSet){
      if(lastSet) {
        return lastSet;
      }
      if(this.lastMonth) {
        return this.lastMonth._id;
      }
    },
    set: function(newVal, setVal) {
      if(newVal === "__new__") {
        var last = this.lastMonth.serialize();
        last.date = this.nextMonth;
        delete last._id;
        new ContributionMonth(last).save((newContributionMonth) => {
          setVal(newContributionMonth._id);
        });
      } else {
        setVal(newVal);
      }
    }
  },
  contributionMonthsPromise: {
    get: function () {
      return ContributionMonth.getList({});
    }
  },

  contributionMonths: {
    get: function(initial, resolve){
      this.contributionMonthsPromise.then(resolve);
    }
  },
  lastMonth: {
    get: function(){
      if(this.contributionMonths && this.contributionMonths.length) {
        return this.contributionMonths[this.contributionMonths.length - 1];
      } else {
        return new ContributionMonth({
          monthlyClientProjects: [],
          monthlyOSProjects:[],
          monthlyContributions: [],
          date: moment().add(-1,'months').startOf('month').toDate()
        });
      }
    }
  },
  nextMonth: {
    get: function(){
      return moment(this.lastMonth.date).add(1,'months').startOf('month').toDate();
    }
  },

});

export default Component.extend({
  tag: 'bit-select-contribution-month',
  ViewModel: ViewModel,
  view
});
