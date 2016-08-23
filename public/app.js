import DefineMap from 'can-define/map/';
import route from 'can-route';

// viewmodel debugging
import viewModel from 'can-view-model';
window.viewModel = viewModel;

// use fixtures
// import 'bitcentive/models/fixtures/';

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
