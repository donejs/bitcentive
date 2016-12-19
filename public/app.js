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

  // Once https://github.com/canjs/can-define-stream/issues/15 is fixed, 
  // we can move the initialSession into the session `value` function.
  initialSession: {
    value () {
      Session.get().then(session => {
        this.initialSession = session;
      })
      .catch(err => console.log(err));
    }
  },

  /**
   * Use Session.get() to see if there's a valid JWT. If one exists, 
   * a new Session will be created.
   */
  session: {
    // value () {},
    stream (setStream) {
      return canStream.toStream(Session, 'created')
        .merge(canStream.toStream(Session, 'destroyed'))
        .map(event => event.type !== 'destroyed' ? event.args[0] : undefined)
        .merge(this.stream('.initialSession'));
    }
  },

  /**
   * Determines which page-level component is displayed.
   */
  page: {
    serialize: true,
    get (page, setPage) {
      if (page === 'logout') {
        return this.logout();
      }

      if (pages[page]) {
        // Logic for authenticated users.
        if (this.session) {
          if (page === 'home') {
            page = 'dashboard';
          }
        // Logic for non-authenticated users.
        } else {
          if (pages[page] !== 'public') {
            page = 'home';
          }
        }
      // 404 if the page isn't in the list of pages.
      } else {
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
  },

  logout () {
    this.session && this.session.destroy()
      .then(() => {
        if (!window.doneSsr) {
          this.page = 'home';
        }
      });
  }
});

route('{page}', {page: 'home'});

export default AppViewModel;
