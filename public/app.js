/* global window */
import 'can-define-stream';
import canStream from 'can-stream';
import DefineMap from 'can-define/map/';
import route from 'can-route';
// import 'can-route-pushstate';
import Session from 'bitcentive/models/session';
// import 'bitcentive/models/fixtures/';

// viewmodel debugging
import viewModel from 'can-view-model';
window.viewModel = viewModel;

var pages = {
  home: 'public',
  dashboard: 'private',
  contributors: 'private'
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
      return Session.current;
    },
  },

  /**
   * Determines which page-level component is displayed.
   */
  page: {
    serialize: true,
    get (page) {
      if (this.session) {
        if (page === 'home') {
          page = 'dashboard';
        } 
      } else {
        if (pages[page] === 'private') {
          page = 'home';
        }
      }
      if (!pages[page]) {
        page = 'four-oh-four';
      }
      return page;
    }
  },

  /**
   * The `title` attribute is used in index.stache as the HTML title.
   */
  title: {
    value: 'Bitcentive'
  }
});

route('{page}', {page: 'home'});

export default AppViewModel;
