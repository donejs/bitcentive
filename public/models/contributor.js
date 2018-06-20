import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import QueryLogic from "can-query-logic";
import superModel from '../lib/super-model';
import feathersQuery from './feathers-query';
import feathersClient from './feathers-client';

var Contributor = DefineMap.extend("Contributor", { seal: false }, {
  _id: {type: "string", identity: true},
  name: "string",
  email: "string",
  active: "boolean"
});

Contributor.List = DefineList.extend("ContributorList", {
  "#": Contributor
});

Contributor.connection = superModel({
  Map: Contributor,
  List: Contributor.List,
  feathersService: feathersClient.service("/api/contributors"),
  name: "contributor",
  queryLogic: new QueryLogic(Contributor, feathersQuery)
});


export default Contributor;
