/* global window */
import 'can-define-stream';
import canStream from 'can-stream';
import DefineMap from 'can-define/map/';
import route from 'can-route';
//import 'can-route-pushstate';
import Session from 'bitcentive/models/session';
// import 'bitcentive/models/fixtures/';

// viewmodel debugging
import viewModel from 'can-view-model';
window.viewModel = viewModel;

const AppViewModel = DefineMap.extend({

  /**
   * By default, viewModel attributes will not be serialized into the URL as
   * route attributes.
   */
  '*': {
    serialize: false
  },

  /**
   * Uses whatever session data is available from Feathers JWT token, if
   * available. Because the token data is limited, a request is sent
   * to obtain the full session data.
   */
  session: {
    stream (setStream) {
      Session.get().catch(err => console.log(err));
      return canStream.toStream(Session, 'created')
        .merge(canStream.toStream(Session, 'destroyed'))
        .map(event => {
          let session = event.type === 'created' ? event.args[0] : undefined;
          return session;
        });
    }
  },

  /**
   * The `page` attribute determines which page-component is displayed.
   */
  page: {
    serialize: true,
    get (page, setPage) {
      return this.routePage(page);
    }
  },

  /**
   * The `title` attribute is used in index.stache as the HTML title.
   */
  title: {
    value: 'Bitcentive'
  },

  /**
   * `routePage` controls the pages that the current user can view.
   * If a non-authenticated user tries to access a private page, they will be
   * shown the login page. Also handles 404s.
   */
  routePage: function (page) {
    let pages = {
      home: 'public',
      dashboard: 'private',
      contributors: 'private'
    };

    if (page === 'logout') {
      this.logout();
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
