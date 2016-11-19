import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";

import feathersBehavior from 'can-connect-feathers';
import feathersClient from './feathers';
import superModel from './super-model';

import osProjectAlgebra from './algebras/id-comparator';

var OSProject =  DefineMap.extend("OSProject", {
  _id: "string",
  name: "string"
});

OSProject.List = DefineList.extend({
	"*": OSProject
});

OSProject.connection = superModel([feathersBehavior], {
  parseInstanceProp: "data",
  idProp: "_id", // TODO: removing this line causes tests to break - not sure why
  Map: OSProject,
  List: OSProject.List,
  feathersService: feathersClient.service("/api/os_projects"),
  name: "osProject",
  algebra: osProjectAlgebra
});

OSProject.algebra = osProjectAlgebra;

export default OSProject;
