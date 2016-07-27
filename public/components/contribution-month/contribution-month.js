import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './contribution-month.less';
import template from './contribution-month.stache';
import ContributionMonth from 'bitcentive/models/contribution-month';
import "bootstrap/dist/css/bootstrap.css";


export const ViewModel = DefineMap.extend({
  // Passed props
  contributionMonthId: "string",

  // derived props
  contributionMonthPromise: {
    get: function(){
      if(this.contributionMonthId) {
        return ContributionMonth.get({_id: this.contributionMonthId
          //,$populate: ["monthlyOSProjects.osProjectRef._id"]
          });
      }
    }
  },
  contributionMonth: {
    get: function(initialValue, resolve){
      if(this.contributionMonthPromise) {

        this.contributionMonthPromise.then(function(res) {
          resolve(res);
        }, function(err){
          // debugger;
        });
      }
    }
  }
});

export default Component.extend({
  tag: 'bit-contribution-month',
  ViewModel: ViewModel,
  template
});
