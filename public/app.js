/* global window */
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
	 * Page component of the route.
	 */
	page: {
		serialize: true
	},

	/**
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
	 * The `title` attribute is used in index.stache as the HTML title.
	 */
	title: {
		default: 'Bitcentive'
	}
});

route.register('{page}', {page: 'home'});

export default AppViewModel;
