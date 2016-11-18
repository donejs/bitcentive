import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-auth.less!';
import template from './page-auth.stache!';
import openLoginPopup from 'feathers-authentication-popups';

export const ViewModel = DefineMap.extend({
  openLoginPopup
});

export default Component.extend({
  tag: 'page-auth',
  ViewModel,
  template
});
