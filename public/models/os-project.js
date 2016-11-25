import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superModel from '../lib/super-model';
import { _idAlgebra as osProjectAlgebra } from './algebras';

var OSProject = DefineMap.extend("OSProject", {
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
  url: "/api/os_projects",
  name: "osProject",
  algebra: osProjectAlgebra
});

OSProject.algebra = osProjectAlgebra;

export { osProjectAlgebra as algebra };

export default OSProject;
