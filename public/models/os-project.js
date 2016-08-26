import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from 'can-define/list/';
import superMap from "can-connect/can/super-map/";
import feathers from "./feathers";

var OSProject =  DefineMap.extend("OSProject", {
  _id: "string",
  name: "string",
  accessList:{
    type: DefineList.List,
    serialize:false
  }
});

var osProjectAlgebra = new set.Algebra(
    set.comparators.id("_id")
);

OSProject.connection = superMap({
  parseInstanceProp: "data",
  idProp: "_id",
  Map: OSProject,
  List: OSProject.List,
  url: feathers.rest("/api/os_projects"),
  name: "osProject",
  algebra: osProjectAlgebra
});

OSProject.algebra = osProjectAlgebra;

export default OSProject;
