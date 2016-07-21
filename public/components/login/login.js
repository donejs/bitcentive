import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './login.less';
import template from './login.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the bit-login component'
  }
});

export default Component.extend({
  tag: 'bit-login',
  ViewModel: ViewModel,
  template
});
