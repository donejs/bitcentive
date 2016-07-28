import './fixtures/';

import QUnit from "steal-qunit";
import ContributionMonth from "./contribution-month";
import ClientProject from "./client-project";
import OSProject from "./os-project";

QUnit.module("models", {
	setup: function(){
		localStorage.clear();
	}
});

QUnit.asyncTest("getList of ContributionMonth", function() {
	ContributionMonth.getList({}).then(function(contributionMonths) {

	  console.log(contributionMonths);
		QUnit.ok(contributionMonths[0].monthlyClientProjects[0].clientProjectRef.value instanceof ClientProject);
		var first = contributionMonths[0].monthlyOSProjects[0].osProjectRef.value,
			second = contributionMonths[0].monthlyClientProjects[0].monthlyClientProjectsOSProjects[0].osProjectRef.value;

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
					osProjectRef: osProject._id,
					osProject: osProject
			}],
			monthlyClientProjects: [{
					monthlyClientProjectsOSProjects: [{
							osProjectRef: osProject._id,
							osProject: osProject
					}],
					hours: 100,
					clientProjectRef: clientProject._id,
					clientProject: clientProject
			}]
	});

	QUnit.equal(contributionMonth.monthlyOSProjects[0].osProject.name , "CanJS")

});
