import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superMap from "can-connect/can/super-map/";


var OSProject =  DefineMap.extend("OSProject",{
  _id: "string",
  name: "string"
});



var osProjectAlgebra = new set.Algebra(
    set.comparators.id("_id")
);

OSProject.connection = superMap({
  Map: OSProject,
  List: OSProject.List,
  url: "/api/client_projects",
  name: "contributionMonth",
  algebra: osProjectAlgebra
});


export default OSProject;
