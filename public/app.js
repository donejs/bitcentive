/* global window */
import 'can-define-stream';
import canStream from 'can-stream';
import DefineMap from 'can-define/map/';
import route from 'can-route';
import 'can-route-pushstate';
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
    value () {
      var self = this;
      new Session().save().catch(err => console.log(err));
      Session.on('created', (event, session) => {
        self.session = session;
        // redirect to the dashboard if on the auth page
        if (self.page === 'auth') {
          history.replaceState(self.title, null, route.url({page: 'dashboard'}));
        }
      });
      Session.on('destroyed', (event, session) => {
        self.session = undefined;
      });
    },
    // stream(setStream){
      // var self = this;
      // console.log('streaming');
      // return canStream.toStream(Session, 'created').onValue(event => {
      //   let session = event.args[0];
      //   console.log(session);
      //   setTimeout(() => {
      //     self.session = session;
      //   }, 1);
      // });
    // }
  },

  /**
   * The `page` attribute determines which page-component is displayed.
   */
  page: {
    serialize: true,
    get(page, setPage){
      return this.routePage(page);
    }
  },

  pageId: {
    type: "string"
  },
  
  /**
   * The auth page uses the subpage attribute to switch between the 'login'
   * view and the 'signup' view. We have to set serialize to true to allow the
   * auth routes to work.
   */
  subpage: {
    serialize: true
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
  routePage: function(page){
    let pageConfig = {
      home: 'public',
      auth: 'public',
      login: 'public',
      signup: 'public',
      dashboard: 'private',
      contributors: 'private'
    };

    // if(page === 'logout'){
    //   page = 'home';
    //   this.session && this.session.destroy()
    //     .then(() => {
    //       if(!window.doneSsr){
    //         window.location.href = '/';
    //       }
    //     });
    // }

    if (this.session) {
      // Perform some custom logic for logged-in users.

    } else {
      // Logic for non-authenticated users.
      if (pageConfig[page] !== 'public') {
        page = 'login';
      }
    }

    // 404 if the page isn't in the config.
    if(!pageConfig[page]){
      page = 'four-oh-four';
    }
    return page;
  }
});

route('/login', {page: 'auth', subpage: 'login'}); 
route('/signup', {page: 'auth', subpage: 'signup'}); 
route('/auth/success', {page: 'auth', subpage: 'success'});
route('/auth/failure', {page: 'auth', subpage: 'failure'});
route('/{page}', {page: 'home'});

export default AppViewModel;
