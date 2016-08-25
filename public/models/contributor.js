import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superMap from "can-connect/can/super-map/";
import feathers from "./feathers";

var Contributor = DefineMap.extend("Contributor", {
  _id: "string",
  name: "string",
  active: "boolean"
});

var contributorAlgebra = new set.Algebra(
  set.comparators.id("_id")
);

Contributor.List = DefineList.extend({
  "*": Contributor
});

Contributor.connection = superMap({
  idProp: "_id",
  Map: Contributor,
  List: Contributor.List,
  url: feathers.rest("/api/contributors"),
  name: "contributor",
  idProp: "_id"
});
Contributor.algebra = contributorAlgebra;

export default Contributor;
