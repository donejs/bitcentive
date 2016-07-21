import DefineMap from 'can-define/map/';
import route from 'can-route';
import 'can-route-pushstate';

import ContributionMonth from 'models/contribution-month';

const AppViewModel = DefineMap.extend({
  route: "string",
  page: "string",
  message: {
    value: 'Hello World!',
    serialize: false
  },
  title: {
    value: 'bitcentive',
    serialize: false
  },
  contributionMonthPromise: {
      get: function() {
          return ContributionMonth.getList({});
      }
  }
});

route(":page",{page: "home"});

export default AppViewModel;
