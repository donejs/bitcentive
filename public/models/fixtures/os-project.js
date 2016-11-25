import fixture from 'can-fixture';
import json from './os-projects.json';
//import { algebra } from '../os-project';
import canSet from 'can-set';
var algebra = new canSet.Algebra(canSet.props.id('_id'));

export var store = fixture.store(json, algebra);

export default function(mockServer){
  mockServer.onFeathersService("api/os_projects", store, {id: "_id"});
}
