import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';

import feathersBehavior from 'can-connect-feathers';
import feathersClient from './feathers';
import superModel from './super-model';

import clientProjectAlgebra from './algebras/id-comparator';

var ClientProject = DefineMap.extend({
  _id: 'string',
  name: 'string',
});

ClientProject.List = DefineList.extend({
  "*": ClientProject
});

ClientProject.connection = superModel([feathersBehavior], {
  parseInstanceProp: "data",
  Map: ClientProject,
  List: ClientProject.List,
  feathersService: feathersClient.service('/api/client_projects'),
  name: "client-projects",
  algebra: clientProjectAlgebra
});
ClientProject.algebra = clientProjectAlgebra;

export default ClientProject;
