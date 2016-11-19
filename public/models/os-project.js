import set from "can-set";
import DefineMap from "can-define/map/";

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

var OSProject =  DefineMap.extend("OSProject", {
  _id: "string",
  name: "string"
});

var osProjectAlgebra = new set.Algebra(
  set.comparators.id("_id")
);

OSProject.connection = connect(behaviorList, {
  parseInstanceProp: "data",
  idProp: "_id",
  Map: OSProject,
  List: OSProject.List,
  feathersService: feathersClient.service("/api/os_projects"),
  name: "osProject",
  algebra: osProjectAlgebra
});

OSProject.algebra = osProjectAlgebra;

export default OSProject;
