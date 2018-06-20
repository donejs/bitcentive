import fixture from 'can-fixture';
import json from './os-projects.json';
import OSProject from '../os-project';

export var store = fixture.store(json, OSProject.connection.queryLogic);

export default function(mockServer){
  mockServer.onFeathersService("api/os_projects", store, {id: "_id"});
}
