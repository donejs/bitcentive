import fixture from 'can-fixture';
import json from './contribution-months-data';
import ContributionMonth from '../contribution-month/';

export var store = fixture.store(json, ContributionMonth.connection.queryLogic);

export default function (mockServer) {
	mockServer.onFeathersService("api/contribution_months", store, { id: "_id" });
}
