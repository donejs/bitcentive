import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './contribution-month.stache';
import ContributionMonth from 'bitcentive/models/contribution-month/';

export const ViewModel = DefineMap.extend({
  // Passed props
  contributionMonthId: "string",

  // derived props
  contributionMonthPromise: {
    get: function(){
      if(this.contributionMonthId) {
        return ContributionMonth.get({
          _id: this.contributionMonthId,
          query: {'$populate': ['monthlyOSProjects.osProjectRef']}
        });
      }
    }
  },
  contributionMonth: {
    get: function(initialValue, resolve){
      if(this.contributionMonthPromise) {
        this.contributionMonthPromise.then(resolve, (err) => {
          console.error("Error loading contribution month: ", err);
        });
      }
    }
  }
});

export default Component.extend({
  tag: 'bit-contribution-month',
  ViewModel: ViewModel,
  view
});
