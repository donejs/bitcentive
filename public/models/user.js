import set from "can-set";
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';

import superModel from '../lib/super-model';
import algebra from './algebras';

var User = DefineMap.extend("User", {
  _id: "string",
  email: {
    type: "string"
  },
  password: {
    type: "string"
  }
});

User.List = DefineList.extend({
  "#": User
});

User.connection = superModel({
  Map: User,
  List: User.List,
  url: "/api/users",
  name: "users",
  algebra
});

User.algebra = algebra;

export default User;
