import set from "can-set";
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';

import feathersClient from './feathers';
import connect from 'can-connect';
import feathersBehavior from 'can-connect-feathers';
import dataParse from 'can-connect/data/parse/';
import construct from 'can-connect/constructor/';
import constructStore from 'can-connect/constructor/store/';
import constructOnce from 'can-connect/constructor/callbacks-once/';
import canMap from 'can-connect/can/map/';
import canRef from 'can-connect/can/ref/';
import dataCallbacks from 'can-connect/data/callbacks/';
import realtime from 'can-connect/real-time/';

var behaviorList = [
  dataParse,
  construct,
  constructStore,
  constructOnce,
  canMap,
  canRef,
  dataCallbacks,
  realtime,
  feathersBehavior
];

var userAlgebra = new set.Algebra(
    set.comparators.id("_id")
);

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

User.connection = connect(behaviorList, {
  idProp: "_id",
  Map: User,
  List: User.List,
  feathersService: feathersClient.service("/api/users"),
  name: "users",
  algebra: userAlgebra
});

User.algebra = userAlgebra;

export default User;
