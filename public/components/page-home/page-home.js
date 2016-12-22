import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-home.less';
import view from './page-home.stache';
import openLoginPopup from 'feathers-authentication-popups';

export const ViewModel = DefineMap.extend({
  openLoginPopup
});

export default Component.extend({
  tag: 'page-home',
  ViewModel: ViewModel,
  view
});
