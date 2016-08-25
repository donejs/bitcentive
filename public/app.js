import DefineMap from 'can-define/map/';
import route from 'can-route';
import ContributionMonth from 'models/contribution-month';
import Session from 'models/session';
import feathers from 'models/feathers';

// viewmodel debugging
import viewModel from 'can-view-model';
window.viewModel = viewModel;

// use fixtures
// import 'bitcentive/models/fixtures/';

const AppViewModel = DefineMap.extend({
  title: {
    value: 'bitcentive',
    serialize: false
  },
  page: {
    type: "string",
    value: "login" //contribution-month
  },
  pageId: {
    type: "string"
  },

  //TODO: remove this
  //no idea what this is for...  things break without it
  route:{
    type: "string"
  },

  /**
   * The `sessionPromise` is needed on the SSR server to see if the current user
   * is authenticated before rendering.
   */
  sessionPromise: {
    serialize: false,
    value(){
      return new Session().save().then((res) => {
        this.sessionPromiseStatus = "resolved";
        return res;
      },(err) => {
        //just resolve when error, that way we'll just get the login
        this.sessionPromiseStatus = "resolved";
        return {};
      });
    }
  },
  //TODO: this shouldn't be necessary
  //can we get the status of a native javascript promise?
  sessionPromiseStatus:{
    serialize: false,
    type: "string",
    value: "pending"
  },

  /**
   * Uses whatever session data is available from Feathers JWT token, if
   * available. Because the token data is usually limited, a request is sent
   * to obtain the full session data.
   */
  session: {
    serialize: false,
    value() {
      this.sessionPromise.then(response => {
        if(response.token){
          this.session = response;
          window.location.hash = route.url({ page: "contribution-month" });
        }
        return response;
      });

      return new Session();
    }
  },
  doLogout(vm, el, ev){
    if(ev && ev.preventDefault){
      ev.preventDefault();
    }
    this.session.logout();
  },
  init(){
    //TODO: shouldn't have to do this if we can get the status of the sessionPromise from the view
    this.sessionPromise;
  }
});

route(":page");
route(":page/:pageId");

export default AppViewModel;
