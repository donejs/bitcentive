import fixture from 'can-fixture';
import json from './contribution-months.json';

// Can't import algebra from the model since it will initiate connection.
//import { algebra } from '../contribution-month';
import canSet from 'can-set';
var algebra = new canSet.Algebra(canSet.props.id('_id'));

export var store = fixture.store(json, algebra);

export default function(mockServer){
  mockServer.onFeathersService("api/contribution_months", store, {id: "_id"});
}
