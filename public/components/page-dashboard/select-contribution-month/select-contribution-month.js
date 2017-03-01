import moment from 'moment';
import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './select-contribution-month.stache';
import ContributionMonth from 'bitcentive/models/contribution-month/';

export const ViewModel = DefineMap.extend({
  selectedContributionMonthId: {
    get: function(lastSet){
      if(lastSet) {
        return lastSet;
      }
      if(this.lastMonth) {
        return this.lastMonth._id;
      }
    },
    set: function(newVal, setVal) {
      if(newVal === null) {
        var last = this.lastMonth.serialize();
        last.date = this.nextMonth;
        last.monthlyContributions = [];
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
    value() {
      return ContributionMonth.getList({ $sort: { date: 1 } });
    }
  },

  contributionMonths: {
    get: function(initial, resolve){
      this.contributionMonthsPromise.then(resolve);
    }
  },
  get lastMonth() {
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
  },
  get nextMonth() {
		return moment(this.lastMonth.date).add(1,'months').startOf('month').toDate();
  }
});

export default Component.extend({
  tag: 'bit-select-contribution-month',
  ViewModel: ViewModel,
  view
});
