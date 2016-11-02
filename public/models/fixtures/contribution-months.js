import fixture from 'can-fixture';
import json from './contribution-months.json';
import canSet from 'can-set';

// TODO: import algebra from ContributionMonths model.
var contributionMonthStore = fixture.store(json, new canSet.Algebra(canSet.props.id('_id')));

export default function(mockServer){
  mockServer.onFeathersService("api/contribution_months", contributionMonthStore, {id: "_id"});
}
