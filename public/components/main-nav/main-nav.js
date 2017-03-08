/**
 * @module {can.Component} bitcentive/components/main-nav <main-nav>
 * @parent bitcentive.components
 * @group bitcentive/components/main-nav.prototype 0 prototype
 * @group bitcentive/components/main-nav.properties 1 properties
 *
 * Main navigation of the app
 *
 * @signature `<main-nav {(page)}="page" {(session)}="session"></main-nav>`
 *
 *   Creates the main navigation
 *
 *   @param {String} page The name of the active page
 *
 *   @param {bitcentive/models/session} session The session of the app
 *
 * @body
 *
 * To create a `<main-nav>` element pass the [bitcentive/models/session] and `page`:
 *
 * ```
 * <main-nav
 *     {(page)}="displayedPage"
 *     {(session)}="session"></main-nav>
 * ```
 *
 * ## Example
 *
 * @demo public/components/main-nav/main-nav.html
 *
 */

import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './main-nav.stache!';
import Session from 'bitcentive/models/session';

export const ViewModel = DefineMap.extend('MainNav', {
	/**
	 * @property {String} bitcentive/components/main-nav.page page
	 * @parent bitcentive/components/main-nav.properties
	 *
	 * The name of the active page.
	 **/
	page: 'string',

	/**
	 * @property {bitcentive/models/session} bitcentive/components/main-nav.session session
	 * @parent bitcentive/components/main-nav.properties
	 *
	 * The session of the application.
	 **/
	session: Session
});

export default Component.extend({
	tag: 'main-nav',
	ViewModel,
	view
});
