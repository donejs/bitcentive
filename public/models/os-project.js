import QueryLogic from 'can-query-logic';
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superModel from '../lib/super-model';
import feathersQuery from './feathers-query';
import feathersClient from './feathers-client';

var OSProject = DefineMap.extend("OSProject", { seal: false }, {
  _id: {type: "string", identity: true},
  name: "string"
});

OSProject.List = DefineList.extend("OSProjectList", {
  "#": OSProject
});

OSProject.connection = superModel({
  Map: OSProject,
  List: OSProject.List,
  feathersService: feathersClient.service("/api/os_projects"),
  name: "osProject",
  queryLogic: new QueryLogic(OSProject, feathersQuery)
});

export default OSProject;
