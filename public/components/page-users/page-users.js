import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './page-users.stache';
import User from 'bitcentive/models/user';

export const ViewModel = DefineMap.extend({
  usersPromise: {
    value() {
      return User.getList({ });
    }
  },
  users: {
    get(lastSet, resolve) {
      this.usersPromise.then(resolve, err => console.error(err));
    }
  }
});

export default Component.extend({
  tag: 'page-users',
  ViewModel,
  view
});
