import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './select-contribution-month.less';
import template from './select-contribution-month.stache';

import moment from 'moment';
import ContributionMonth from 'bitcentive/models/contribution-month';
import "bootstrap/dist/css/bootstrap.css";


export const ViewModel = DefineMap.extend({
  init: function(){
    this.on("selectedContributionMonthId", (ev, newVal) => {
      if(newVal === "__new__") {
        var last = this.lastMonth.serialize();
        last.date = this.nextMonth;
        delete last._id;
        new ContributionMonth(last).save((newContributionMonth) => {
          this.selectedContributionMonthId = newContributionMonth._id;
        });
      }
    });
  },
  selectedContributionMonthId: {
    type: "string",
    value: null,
    get: function(lastSet, resolve){

      if(lastSet) {
        return lastSet;
      }
      if(this.lastMonth) {
        return this.lastMonth._id;
      }
    }
  },
  contributionMonthsPromise: {
    value: ContributionMonth.getList.bind(ContributionMonth,{$sort: {date: 1}})
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
  template
});
