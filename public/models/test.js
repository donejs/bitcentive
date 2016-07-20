import './fixtures/';
import QUnit from "steal-qunit";
import ContributionMonth from "./contribution-month";
import ClientProject from "./client-project";
import assign from "can-util/js/assign/";

QUnit.module("models");

QUnit.asyncTest("getList of ContributionMonth", function() {
	ContributionMonth.getList({}).then(function(contributionMonths) {

	  console.log(contributionMonths);
		QUnit.ok(contributionMonths[0].monthlyClientProjects[0].clientProject instanceof ClientProject);
		var first = contributionMonths[0].monthlyOSProjects[0].osProject,
			second = contributionMonths[0].monthlyClientProjects[0].monthlyClientProjectsOsProjects[0].osProject;

    console.log(first);
    console.log(second);

		QUnit.ok(first === second);
		QUnit.start();
	}, function(err) {
		debugger;
	});
});
