import DefineMap from "can-define/map/";
import superMap from "can-connect/can/super-map/";

var Contributor = DefineMap.extend("Contributor", {
  _id: "string",
  name: "string"
});

Contributor.connection = superMap({
  idProp: "_id",
  Map: Contributor,
  List: Contributor.List,
  url: "/api/contributors",
  name: "contributor",
  idProp: "_id"
});

export default Contributor;
