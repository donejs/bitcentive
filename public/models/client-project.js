import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';

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

var clientProjectAlgebra = new set.Algebra(
  set.comparators.id('_id')
);

var ClientProject = DefineMap.extend({
  _id: 'string',
  name: 'string',
});

ClientProject.List = DefineList.extend({
  "*": ClientProject
});

ClientProject.connection = connect(behaviorList, {
  parseInstanceProp: "data",
  Map: ClientProject,
  List: ClientProject.List,
  feathersService: feathersClient.service('/api/client_projects'),
  name: "client-projects",
  algebra: clientProjectAlgebra,
  idProp: "_id"
});

ClientProject.algebra = clientProjectAlgebra;

export default ClientProject;
