import DefineMap from "can-define/map/";

import set from "can-set";
import DefineList from "can-define/list/";
import superMap from "can-connect/can/super-map/";


var ClientProject =  DefineMap.extend("ClientProject",{
  _id: "string",
  name: "string"
});



var clientProjectAlgebra = new set.Algebra(
    set.comparators.id("_id")
);

ClientProject.connection = superMap({
  Map: ClientProject,
  List: ClientProject.List,
  url: "/api/client_projects",
  name: "contributionMonth",
  algebra: clientProjectAlgebra
});


export default ClientProject;
