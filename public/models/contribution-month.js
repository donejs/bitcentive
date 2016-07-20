import ClientProject from "./client-project";
import OSProject from "./os-project";
import Contributor from "./contributor";

import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superMap from "can-connect/can/super-map/";


var contributionMonthAlgebra = new set.Algebra(
    set.comparators.id("_id")
);

var MonthlyOSProject = DefineMap.extend("MonthlyOSProject",{
  osProjectId: "string",
  significance: "number",
  commissioned: "boolean",
  osProject: { type: OSProject.connection.hydrateInstance.bind(OSProject.connection) }
});

var MonthlyClientProjectsOsProject = DefineMap.extend("MonthlyClientProjectOsProject",{
    osProjectId: "123123sdfasdf",
    osProject: {type: OSProject.connection.hydrateInstance.bind(OSProject.connection) }
});

var MonthlyClientProject = DefineMap.extend("MonthlyClientProject",{
  clientProjectId: "string",
  clientProject: ClientProject,
  hours: "number",
  monthlyClientProjectsOsProjects: {Type: [MonthlyClientProjectsOsProject]},
});


var ContributionMonth = DefineMap.extend({
  date: "date",
  monthlyOSProjects: {Type: [MonthlyOSProject]},
  monthlyClientProjects: {Type: [MonthlyClientProject]}
});


ContributionMonth.connection = superMap({
  Map: ContributionMonth,
  List: ContributionMonth.List,
  url: "/api/contribution_months",
  name: "contributionMonth",
  algebra: contributionMonthAlgebra
});
ContributionMonth.algebra = contributionMonthAlgebra;


export default ContributionMonth;
