import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import set from "can-set";
import superModel from '../lib/super-model';
import feathersClient from './feathers';
import { _idAlgebra as contributorAlgebra } from './algebra';

var Contributor = DefineMap.extend("Contributor", {
  _id: "string",
  name: "string",
  email: "string",
  active: "boolean"
});

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
