import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './users.less';
import view from './users.stache';
import User from 'bitcentive/models/user';
import $ from 'jquery';

export const UsersVM = DefineMap.extend({
  // Passed properties
  users: {
    Type: User.List
  },
  isAddingUser: {
    type: "boolean",
    value: false
  },
  isSaving: {
    type: "boolean",
    value: false
  },
  newUserName: {
    type: "string",
    value: "",
  },
  newUserEmail: {
    type: "string",
    value: "",
  },
  newUserActive: {
    type: "boolean",
    value: true,
  },
  newUserError: {
    type: "string",
    value: "",
  },
  // Methods
  resetNewUserFields() {
    this.newUserError = '';
    this.newUserName = '';
    this.newUserEmail = '';
    this.newUserActive = true;
  },
  toggleUserInput() {
    this.resetNewUserFields();
    this.isAddingUser = !this.isAddingUser;
  },
  setActive(user, state) {
    user.active = state;
    user.save();
  },
  addUser(ev) {
    if(ev) {
      ev.preventDefault();
    }
    let error = this.hasErrors();
    if (error){
      this.newUserError = error;
      return;
    }
    this.isSaving = true;
    return new User({
      name: this.newUserName,
      email: this.newUserEmail,
      active: this.newUserActive
    }).save().then(() => {
      this.resetNewUserFields();
      this.isSaving = false;
    }, (e) => {
      this.newUserError = e.message;
      this.isSaving = false;
    });
  },
  hasErrors(){
    return this.newUserName === '' && 'Name cannot be empty'
      || this.newUserEmail === '' && 'Email cannot be empty';
  }
});

export default Component.extend({
  tag: 'bit-users',
  view,
  ViewModel: UsersVM
});
