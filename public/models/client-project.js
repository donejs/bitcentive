import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import feathersClient from './feathers';
import superModel from '../lib/super-model';

var clientProjectAlgebra = new set.Algebra(
  set.comparators.id('_id')
);

var ClientProject = DefineMap.extend({
  _id: 'string',
  name: 'string'
});

ClientProject.List = DefineList.extend({
  "#": ClientProject
});

ClientProject.connection = superModel({
  parseInstanceProp: "data",
  Map: ClientProject,
  List: ClientProject.List,
  feathersService: feathersClient.service('/api/client_projects'),
  name: "client-projects",
  algebra: clientProjectAlgebra,
  idProp: "_id"
});

ClientProject.algebra = clientProjectAlgebra;

export { clientProjectAlgebra as algebra };

export default ClientProject;
