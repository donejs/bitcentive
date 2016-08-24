import set from "can-set";
import DefineMap from "can-define/map/";
import superMap from "can-connect/can/super-map/";
import OSProject from "./os-project";
import Contributor from "./contributor";

var Contribution =  DefineMap.extend("Contribution", {
  _id: "string",
  __v: 'number',
  description: "string",
  points: "number",
  osProject: {
    Type: OSProject
  },
  contributor: {
    Type: Contributor
  }
});

var contributionAlgebra = new set.Algebra(
  set.comparators.id("_id")
);

Contribution.connection = superMap({
  idProp: "_id",
  Map: Contribution,
  List: Contribution.List,
  url: "/api/contributions",
  name: "contribution",
  algebra: contributionAlgebra,
  idProp: "_id"
});
Contribution.algebra = contributionAlgebra;

export default Contribution;
