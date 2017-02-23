import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superModel from '../lib/super-model';
import algebra from './algebra';
import feathersClient from './feathers-client';

var ClientProject = DefineMap.extend('ClientProject', { seal: false }, {
  _id: 'string',
  name: 'string'
});

ClientProject.List = DefineList.extend('ClientProjectList', {
  "#": ClientProject
});

ClientProject.connection = superModel({
  Map: ClientProject,
  List: ClientProject.List,
  feathersService: feathersClient.service('/api/client_projects'),
  name: "client-projects",
  algebra
});

ClientProject.algebra = algebra;

export default ClientProject;
