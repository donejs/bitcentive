import set from "can-set";
import DefineMap from "can-define/map/";
import superModel from '../lib/super-model';
import feathersClient from './feathers';

var OSProject = DefineMap.extend("OSProject", {
  _id: "string",
  name: "string"
});

var osProjectAlgebra = new set.Algebra(
  set.comparators.id("_id")
);

OSProject.connection = superModel({
  parseInstanceProp: "data",
  idProp: "_id",
  Map: OSProject,
  List: OSProject.List,
  feathersService: feathersClient.service("/api/os_projects"),
  name: "osProject",
  algebra: osProjectAlgebra
});

OSProject.algebra = osProjectAlgebra;

export { osProjectAlgebra as algebra };

export default OSProject;
