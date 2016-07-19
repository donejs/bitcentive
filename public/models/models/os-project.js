import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import tag from 'can-connect/can/tag/';

export const ModelsOsProject = DefineMap.extend({
  seal: false
}, {
  '_id': '*',
  'name': 'string'
});

ModelsOsProject.List = DefineList.extend({
  '*': ModelsOsProject
});

export const models/os-projectConnection = superMap({
  url: '/api/os-projects',
  idProp: '_id',
  Map: ModelsOsProject,
  List: ModelsOsProject.List,
  name: 'models/os-project'
});

tag('models/os-project-model', models/os-projectConnection);

export default ModelsOsProject;
