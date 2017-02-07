import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superModel from '../lib/super-model';
import algebra from './algebra';
import feathersClient from './feathers-client';

var OSProject = DefineMap.extend("OSProject", { seal: false }, {
  _id: "string",
  name: "string"
});

OSProject.List = DefineList.extend({
  "#": OSProject
});

OSProject.connection = superModel({
  parseInstanceProp: "data",
  Map: OSProject,
  List: OSProject.List,
  feathersService: feathersClient.service("/api/os_projects"),
  name: "osProject",
  algebra
});

OSProject.algebra = algebra;

export default OSProject;
