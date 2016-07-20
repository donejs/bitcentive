import DefineMap from "can-define/map/";
import superMap from "can-connect/can/super-map/";

var OSProject = DefineMap.extend({
  _id: "string",
  name: "string"
});

var osProjectAlgebra = new set.Algebra(
    set.comparators.id("_id")
);

OSProject.connection = superMap({
  idProp: "_id",
  Map: OSProject,
  List: OSProject.List,
  url: "/api/os_projects",
  name: "osProject",
  algebra: osProjectAlgebra
});
OSProject.algebra = osProjectAlgebra;

export default OSProject;