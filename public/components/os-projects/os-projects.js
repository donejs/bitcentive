import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './os-projects.less';
import template from './os-projects.stache';

export const ViewModel = DefineMap.extend({
  message: {
    value: 'This is the bit-os-projects component'
  }
});

export default Component.extend({
  tag: 'bit-os-projects',
  ViewModel: ViewModel,
  template
});
