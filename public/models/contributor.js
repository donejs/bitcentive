import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";

import feathersBehavior from 'can-connect-feathers';
import feathersClient from './feathers';
import superModel from './super-model';

import contributorAlgebra from './algebras/id-comparator';

var Contributor = DefineMap.extend("Contributor", {
  _id: "string",
  name: "string",
  email: "string",
  active: "boolean"
});

Contributor.List = DefineList.extend({
  "*": Contributor
});

Contributor.connection = superModel([feathersBehavior], {
  Map: Contributor,
  List: Contributor.List,
  feathersService: feathersClient.service("/api/contributors"),
  name: "contributor",
  algebra: contributorAlgebra,
});
Contributor.algebra = contributorAlgebra;

export default Contributor;
