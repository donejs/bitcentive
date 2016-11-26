import fixture from 'can-fixture';
import json from './os-projects.json';
import algebra from '../algebras';

export var store = fixture.store(json, algebra);

export default function(mockServer){
  mockServer.onFeathersService("api/os_projects", store, {id: "_id"});
}
