import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superModel from '../lib/super-model';
import feathersClient from './feathers-client';
import QueryLogic from 'can-query-logic';
import feathersQuery from './feathers-query';

var ClientProject = DefineMap.extend('ClientProject', { seal: false }, {
  _id: {type: 'string', identity: true},
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
  queryLogic: new QueryLogic(ClientProject, feathersQuery)
});


export default ClientProject;
