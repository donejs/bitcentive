import set from "can-set";
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';

import feathersBehavior from 'can-connect-feathers';
import feathersClient from './feathers';
import superModel from './super-model';

import userAlgebra from './algebras/id-comparator';

var User = DefineMap.extend("User", {
  _id: "string",
  email: {
    type: "string"
  },
  password: {
    type: "string"
  }
});

User.List = DefineList.extend({"*": User});

User.connection = superModel([feathersBehavior], {
  Map: User,
  List: User.List,
  feathersService: feathersClient.service("/api/users"),
  name: "users",
  algebra: userAlgebra
});
User.algebra = userAlgebra;

export default User;
