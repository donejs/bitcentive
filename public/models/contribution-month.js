import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';

export const ContributionMonth = DefineMap.extend({
  seal: false
}, {
  '_id': '*',
  'date': 'date',
  'clientProjects': 'observable',
  'osProjects': {
    set: function(raw) {
      console.log(raw);
    }
  },
  'contributions': 'observable'
});

ContributionMonth.List = DefineList.extend({
  '*': ContributionMonth
});

export const contributionMonthConnection = superMap({
  url: '/api/contribution_months',
  idProp: '_id',
  Map: ContributionMonth,
  List: ContributionMonth.List,
  name: 'contribution-month'
});

tag('contribution-month-model', contributionMonthConnection);

export default ContributionMonth;
