import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import set from 'can-set';

var clientProjectAlgebra = new set.Algebra(
  set.comparators.id('_id')
);

var ClientProject = DefineMap.extend({
  _id: 'string',
  name: 'string'
});

ClientProject.List = DefineList.extend({
  "*": ClientProject
});

ClientProject.connection = superMap({
  Map: ClientProject,
  List: ClientProject.List,
  url: '/api/client_projects',
  name: "client-projects",
  algebra: clientProjectAlgebra,
  idProp: "_id"
});

ClientProject.algebra = clientProjectAlgebra;

export default ClientProject;