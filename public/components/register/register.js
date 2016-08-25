import Component from 'can-component';
import DefineMap from 'can-define/map/';
import route from 'can-route';
import './register.less';
import template from './register.stache';
import User from 'bitcentive/models/user';
import isEmptyObject from 'can-util/js/is-empty-object/is-empty-object';
import "bootstrap/dist/css/bootstrap.css";

export const ViewModel = DefineMap.extend({
  session: {
    type: "*"
  },
  email:{
    value:""
  },
  password:{
    value:""
  },
  serverError:{
    value:""
  },
  doRegister(defineMap, el, ev){
    let session = this.session;
    if(ev && ev.preventDefault){
      ev.preventDefault();
    }
    if(this.validate()) {
      new User({
        email: this.email,
        password: this.password
      }).save().then((res) => {
        session.login({
          email: this.email,
          password: this.password
        }).then((res) => {
          window.location.hash = route.url({ page: "contribution-month" });
        },(err) => {
          //TODO: global error handler
          console.log("Login error:", err);
        });
        
      }, (err) => {
        console.log("error saving", err);
        if(!err || !err.responseJSON){
          this.serverError = "Something went wrong. Please try again.";
          return;
        }
        switch(err.responseJSON.code){
          case 409: //Duplicate key error
            this.serverError = "There is already a user with that email.";
            break;
          default:
            this.serverError = "Something went wrong. Please try again.";
            break;
        }
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
    this.serverError = "";
    return isEmptyObject(this.errors);
  }
  //---- end validation ----//
});

export default Component.extend({
  tag: 'bit-register',
  ViewModel: ViewModel,
  template
});
