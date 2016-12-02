import './fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';

import QUnit from "steal-qunit";
import ContributionMonth from "./contribution-month/";
import ClientProject from "./client-project";
import OSProject from "./os-project";

QUnit.module("models", {
	setup: function(){
		localStorage.clear();
		// Reset fixture store before every test:
		store.reset();
	}
});

QUnit.asyncTest("getList of ContributionMonth", function() {
	ContributionMonth.getList({}).then(function(contributionMonths) {

		// TODO: check if we need to test against `clientProjectRef.value`.
		QUnit.ok(contributionMonths[0].monthlyClientProjects[0].clientProjectRef._id === "1-Levis", 'contains a client project');
		var first = contributionMonths[0].monthlyOSProjects[0].osProjectRef._id,
			second = contributionMonths[0].monthlyClientProjects[0].monthlyClientProjectsOSProjects[0]._id;

		QUnit.ok(first, 'first exists');
		QUnit.ok(first === second, 'first and second are equal');

		QUnit.start();
	}, function(err) {
	  QUnit.ok(false, err);
	});
});

QUnit.test("make type convert able to accept instances (#23)", function() {
	var osProject = new OSProject({
			_id: "somethingCrazey",
			name: "CanJS"
	});

	var clientProject = new ClientProject({
			_id: "asl;dfal;sfj ;lakwj",
			name: "HualHound"
	});

	var contributionMonth = new ContributionMonth({
			_id: "aslkfalsjklas",
			date: 124234211310000,
			monthlyOSProjects: [{
					significance: 80,
					commissioned: true,
					osProjectRef: osProject._id,
					osProject: osProject
			}],
			monthlyClientProjects: [{
					monthlyClientProjectsOSProjects: [ osProject ],
					hours: 100,
					clientProjectRef: clientProject._id,
					clientProject: clientProject
			}]
	});

	QUnit.equal(contributionMonth.monthlyOSProjects[0].osProject.name , "CanJS");

});
