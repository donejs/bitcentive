import './fixtures/';

import QUnit from "steal-qunit";
import ContributionMonth from "./contribution-month";
import ClientProject from "./client-project";

QUnit.module("models");

QUnit.asyncTest("basics of ContributionMonth", function(){
  ContributionMonth.getList({}).then(function(contributionMonths){

    QUnit.ok( contributionMonths[0].monthlyClientProjects[0].clientProject instanceof ClientProject );
    QUnit.start();
  }, function(err){
    debugger;
  });
});
