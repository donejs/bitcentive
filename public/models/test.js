import './fixtures/';

import QUnit from "steal-qunit";
import ContributionMonth from "./contribution-month";
import ClientProject from "./client-project";
import OSProject from "./os-project";

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
    QUnit.ok(first);

		QUnit.start();
	}, function(err) {
		debugger;
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
					osProjectId: osProject._id,
					osProject: osProject
			}],
			monthlyClientProjects: [{
					monthlyClientProjectsOsProjects: [{
							osProjectId: osProject._id,
							osProject: osProject
					}],
					hours: 100,
					clientProjectId: clientProject._id,
					clientProject: clientProject
			}]
	});

	QUnit.equal(contributionMonth.monthlyOSProjects[0].osProject.name , "CanJS")

});
