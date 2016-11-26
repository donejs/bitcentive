import fixture from 'can-fixture';
import json from './client-projects.json';
import algebra from '../algebras';

var store = fixture.store(json, algebra);

export default function(mockServer){
  mockServer.onFeathersService("api/client_projects", store, {id: "_id"});
}
