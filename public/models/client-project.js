import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superModel from '../lib/super-model';
import algebra from './algebras';

var ClientProject = DefineMap.extend('ClientProject', {
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
  algebra
});

ClientProject.algebra = algebra;

export default ClientProject;
