import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import set from "can-set";
import superModel from '../lib/super-model';
import feathersClient from './feathers';

var Contributor = DefineMap.extend("Contributor", {
  _id: "string",
  name: "string",
  email: "string",
  active: "boolean"
});

var contributorAlgebra = new set.Algebra(
  set.comparators.id("_id")
);

Contributor.List = DefineList.extend({
  "*": Contributor
});

Contributor.connection = superModel({
  idProp: "_id",
  Map: Contributor,
  List: Contributor.List,
  feathersService: feathersClient.service("/api/contributors"),
  name: "contributor"
});

Contributor.algebra = contributorAlgebra;

export { contributorAlgebra as algebra };

export default Contributor;
