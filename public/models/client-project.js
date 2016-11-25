import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superModel from '../lib/super-model';
import { _idAlgebra as clientProjectAlgebra } from './algebras';

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
  url: '/api/client_projects',
  name: "client-projects",
  algebra: clientProjectAlgebra
});

ClientProject.algebra = clientProjectAlgebra;

export { clientProjectAlgebra as algebra };

export default ClientProject;
