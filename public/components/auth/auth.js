import Component from 'can-component';
import DefineMap from 'can-define/map/';
import route from 'can-route';
import './auth.less';
import template from './auth.stache';
import "bootstrap/dist/css/bootstrap.css";

export const ViewModel = DefineMap.extend({
  session: {
    type: "*"
  },
  page: {
    type: "string",
    value: ''
  },

  goTo(loc){
    window.location.hash = route.url({ page: loc });
  }
});

export default Component.extend({
  tag: 'bit-auth',
  ViewModel: ViewModel,
  template
});
