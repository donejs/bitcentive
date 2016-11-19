import fixture from 'can-fixture';
import json from './contribution-months.json';

import algebra from '../algebras/contribution-month';

export var store = fixture.store(json, algebra);

export default function(mockServer){
  mockServer.onFeathersService("api/contribution_months", store, {id: "_id"});
}
