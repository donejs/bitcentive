import set from "can-set";
import DefineMap from "can-define/map/";
import superModel from '../lib/super-model';
import feathersClient from './feathers';
import { _idAlgebra as osProjectAlgebra } from './algebras';

var OSProject = DefineMap.extend("OSProject", {
  _id: "string",
  name: "string"
});

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
