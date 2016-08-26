import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import set from 'can-set';
import feathers from './feathers';

var clientProjectAlgebra = new set.Algebra(
  set.comparators.id('_id')
);

var ClientProject = DefineMap.extend({
  _id: 'string',
  name: 'string',
  accessList:{
    type: DefineList.List,
    serialize:false
  }
});

ClientProject.List = DefineList.extend({
  "*": ClientProject,
  accessList:{
    type: DefineList.List,
    serialize:false
  }
});

ClientProject.connection = superMap({
  parseInstanceProp: "data",
  Map: ClientProject,
  List: ClientProject.List,
  url: feathers.rest('/api/client_projects'),
  name: "client-projects",
  algebra: clientProjectAlgebra,
  idProp: "_id"
});

ClientProject.algebra = clientProjectAlgebra;

export default ClientProject;
