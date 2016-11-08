import fixture from 'can-fixture';
import json from './client-projects.json';
//import { algebra } from '../client-project';
import canSet from 'can-set';
var algebra = new canSet.Algebra(canSet.props.id('_id'));

var store = fixture.store(json, algebra);

export default function(mockServer){
  mockServer.onFeathersService("api/client_projects", store, {id: "_id"});
}
