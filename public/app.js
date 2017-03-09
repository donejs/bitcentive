/* global window */
/**
 * @module {can-map} bitcentive/app AppViewModel
 * @parent bitcentive
 *
 * Application view model.
 *
 * Usage:
 * ```
 * <can-import from="bitcentive/app" export-as="viewModel" />
 * ```
 *
 * @group bitcentive/app.properties 0 properties
 */
import DefineMap from 'can-define/map/';
import route from 'can-route';
// import 'can-route-pushstate';
import Session from 'bitcentive/models/session';
// import 'bitcentive/models/fixtures/';
import zone from 'can-zone';

// viewmodel debugging
import viewModel from 'can-view-model';
window.viewModel = viewModel;

var pages = {
	home: 'public',
	dashboard: 'private',
	contributors: 'private',
	users: 'private',
	loading: 'public'
};

const AppViewModel = DefineMap.extend({

	/**
	 * By default, viewModel attributes will not be serialized into the URL as
	 * route attributes.
	 */
	'*': {
		serialize: false
	},

	/**
	 * @property {bitcentive/models/session} bitcentive/app.session session
	 * @parent bitcentive/app.properties
	 * Use Session.get() to see if there's a valid JWT. If one exists,
	 * a new Session will be created.
	 */
	session: {
		get () {
			return zone.ignore(function(){
				return Session.current;
			})();
		}
	},

	/**
	 * @property {String} bitcentive/app.page page
	 * @parent bitcentive/app.properties
	 * Page component of the route.
	 */
	page: {
		serialize: true
	},

	/**
	 * @property {String} bitcentive/app.displayedPage displayedPage
	 * @parent bitcentive/app.properties
	 * Determines which page-level component is displayed.
	 */
	displayedPage: {
		get () {
			let page = this.page;

			// Unknown session:
			if (this.session === undefined) {
				page = 'loading';
			}
			// Non-authenticated session:
			else if (this.session === null) {
				page = pages[page] === 'private' ? 'home' : page;
			} else if (page === 'home') {
				page = 'dashboard';
			}
			return pages[page] ? page : 'four-oh-four';
		}
	},

	/**
	 * @property {String} bitcentive/app.title title
	 * @parent bitcentive/app.properties
	 * The `title` attribute is used in index.stache as the HTML title.
	 */
	title: {
		value: 'Bitcentive'
	}
});

route('{page}', {page: 'home'});

export default AppViewModel;
