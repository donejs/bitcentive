import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './login.less';
import view from './login.stache';
import Session from 'bitcentive/models/session';
import route from 'can-route';
import isEmptyObject from 'can-util/js/is-empty-object/is-empty-object';
import "bootstrap/dist/css/bootstrap.css";

const LoginViewModel = DefineMap.extend({
  session: {
    type: "*"
  },
  // session: {
  //   Type: Session,
  //   set() {
  //     debugger;
  //     console.log("setting session: ", arguments);
  //   }
  // },
  email:{
    type: "string"
  },
  password:{
    type: "string"
  },
  doLogin(defineMap, el, ev){
    if(ev && ev.preventDefault){
      ev.preventDefault();
    }

    if(!this.session){
      alert("login vm - must have session");
    }

    if(this.validate()) {

      this.session.login({
        email: this.email,
        password: this.password
      }).then((res) => {
        // update my ui
        console.log("session save success", res);
        window.location.hash = route.url({ page: "contribution-month" });
      },(err) => {
        //TODO: global error handler
        console.log("Login error:", err);
      });

    }
  },

  //---- validation ----//
  errors:{
    get(){
      let errors = {};
      if(!this.hasValidated){
        return errors;
      }

      if(!this.email){
        errors.email = "Please enter an email address";
      }

      if(!this.password){
        errors.password = "Please enter a password";
      }

      return errors;
    }
  },
  hasValidated:{
    type: "boolean",
    value: false
  },
  validate(){
    this.hasValidated = true;
    return isEmptyObject(this.errors);
  }
  //---- end validation ----//
});

export default Component.extend({
  tag: 'bit-login',
  ViewModel: LoginViewModel,
  view
});
