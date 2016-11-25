import fixture from 'can-fixture';
import json from './os-projects.json';
//import { algebra } from '../os-project';
import { _idAlgebra as algebra } from '../algebras';

export var store = fixture.store(json, algebra);

export default function(mockServer){
  mockServer.onFeathersService("api/os_projects", store, {id: "_id"});
}
