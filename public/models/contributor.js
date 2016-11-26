import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import set from "can-set";
import superModel from '../lib/super-model';
import algebra from './algebras';

var Contributor = DefineMap.extend("Contributor", {
  _id: "string",
  name: "string",
  email: "string",
  active: "boolean"
});

Contributor.List = DefineList.extend({
  "#": Contributor
});

Contributor.connection = superModel({
  Map: Contributor,
  List: Contributor.List,
  url: "/api/contributors",
  name: "contributor",
  algebra
});

Contributor.algebra = algebra;

export default Contributor;
