import fixture from 'can-fixture';
import json from './client-projects.json';
import ClientProject from '../client-project';

var store = fixture.store(json, ClientProject.connection.queryLogic);

export default function(mockServer){
  mockServer.onFeathersService("api/client_projects", store, {id: "_id"});
}
