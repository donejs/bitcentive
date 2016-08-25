import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from 'can-define/list/list';
import superMap from "can-connect/can/super-map/";
import User from "./user";
import $ from 'jquery';
import feathers from './feathers';
import route from 'can-route';

const Session = DefineMap.extend('Session', {
  user: {
    Value: User
  },
  token: {
    type: "string",
    value: ""
  },
  email: {
    type: "string",
    value: ""
  },
  type: {
    type: "string",
    value: "token"
  },
  password: {
    type: "string",
    value: ""
  },
  isUserLoggedIn:{
    type: "string",
    get(){
      return this.token;
    }
  },
  isUserInRole(role) {
    //todo
  },

  //use login so that we can add/remove the password property
  login(data){
    this.email = data.email;
    this.password = data.password;
    this.type = 'local';
    return this.save().then((res) => {
      this.password = undefined;
      return res;
    });
  },

  logout() {
    //TODO: should be able to use destroy
    // this.destroy().then(() => {
    feathers.logout().then(() => {
      window.localStorage.clear();
      window.location.hash = route.url({ page: "login" });
      this.token = undefined;
    });
  }
});

Session.List = DefineList.extend({
  Map: Session
});

var sessionAlgebra = new set.Algebra(
    set.comparators.id("_id")
);

Session.connection = superMap({
  Map: Session,
  List: Session.List,
  url: {
    createData(data){
      if(data.type === "token"){
        data = undefined
      }
      return feathers.authenticate(data).then((raw) => {
        //TODO: feathers shouldn't send this properties
        delete raw.data.__v;

        //TODO: ideally, this would be taken care of in the createdData can-connect callback.
        //      it seems like it isn't being called when feathers.authenticate is involved...
        return {
          token: raw.token,
          user: raw.data
        };
      });
    },
    destroyData(){
      feathers.logout();
    }
  },

  //TODO: this doesn't seem to be called when feathers.authenticate is involved. this should work
  // createdData: function(raw){
  //   return {
  //     token: raw.token,
  //     user: raw.data
  //   };
  // },

  idProp: "_id",
  name: "session",
  algebra: sessionAlgebra
});

Session.algebra = sessionAlgebra;

export default Session;
