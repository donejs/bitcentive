import set from "can-set";
import DefineMap from "can-define/map/";
import superMap from "can-connect/can/super-map/";

var OSProject =  DefineMap.extend("OSProject", {
  _id: "string",
  __v: 'number',
  name: "string"
});

var osProjectAlgebra = new set.Algebra(
    set.comparators.id("_id")
);

OSProject.connection = superMap({
  Map: OSProject,
  List: OSProject.List,
  url: "/api/os_projects",
  name: "osProject",
  algebra: osProjectAlgebra
});
OSProject.algebra = osProjectAlgebra;

export default OSProject;
