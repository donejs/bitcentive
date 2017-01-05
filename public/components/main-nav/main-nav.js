import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './main-nav.less!';
import view from './main-nav.stache!';
import Session from 'bitcentive/models/session';

export const ViewModel = DefineMap.extend('MainNav', {
	page: 'string',
	session: Session
});

export default Component.extend({
	tag: 'main-nav',
	ViewModel,
	view
});
