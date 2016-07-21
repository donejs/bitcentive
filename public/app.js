import DefineMap from 'can-define/map/';
import route from 'can-route';
import viewModel from 'can-view-model';
import ContributionMonth from 'models/contribution-month';

window.viewModel = viewModel;

const AppViewModel = DefineMap.extend({
  route: "string",
  contributionMonthId: "string",
  title: {
    value: 'bitcentive',
    serialize: false
  }
});

route(":contributionMonthId");

export default AppViewModel;
