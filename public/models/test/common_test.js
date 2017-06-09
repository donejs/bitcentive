import '../fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';

import QUnit from "steal-qunit";
import ContributionMonth from "../contribution-month/";
import MonthlyContribution from "../contribution-month/monthly-contribution";
import MonthlyOSProject from "../contribution-month/monthly-os-project";
import MonthlyClientProject from "../contribution-month/monthly-client-project";
import ClientProject from "../client-project";
import OSProject from "../os-project";
import Contributor from "../contributor";


QUnit.module("models", {});

QUnit.test("unsealed models", function(){
	[
		OSProject,
		ClientProject,
		Contributor,
		ContributionMonth,
		MonthlyContribution,
		MonthlyOSProject,
		MonthlyClientProject
	].forEach(function(Model){
		var instance = new Model();
		try {
			instance.__test_prop = 0;
			QUnit.ok(true, Model.name + " is unsealed");
		} catch(e) {
			QUnit.ok(false, Model.name + " is sealed when it should NOT be");
		}
	});
});
