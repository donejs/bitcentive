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

MonthlyClientProjectsOsProject.List = DefineList.extend({
  "*": MonthlyClientProjectsOsProject,
  osProjectIdMap: {
    get: function(){
      var map = {};
      this.forEach(function(monthlyClientProjectOSProject){
        map[monthlyClientProjectOSProject.osProjectId] = monthlyClientProjectOSProject;
      });
      return map;
    }
  },
  has: function(monthlyOsProject){
    return !!this.osProjectIdMap[monthlyOsProject.osProjectId];
  },
  addRemoveProjects: function(monthlyOSProject){
    if(this.has(monthlyOSProject)) {
      this.splice(this.indexOf(monthlyOSProject), 1);
      delete this.osProjectIdMap[monthlyOSProject.osProjectId];
    } else {
      this.push(monthlyOSProject);
      this.osProjectIdMap[monthlyOSProject.osProjectId] = monthlyOSProject;
    }
  }
});

var MonthlyClientProject = DefineMap.extend("MonthlyClientProject",{
  clientProjectId: "string",
  clientProject: ClientProject,
  hours: "number",
  monthlyClientProjectsOsProjects: MonthlyClientProjectsOsProject.List,
});

MonthlyClientProject.List = DefineList.extend({
  "*": MonthlyClientProject,
  monthlyProjectIdMap: {
    get: function() {
      var map = {};
      this.forEach(function(monthlyClientProject) {
        map[monthlyClientProject.clientProjectId] = monthlyClientProject;
      });
      return map;
    }
  },
  has: function(clientProject) {
    window.clientProject = clientProject;
    return !!this.monthlyProjectIdMap[clientProject.clientProjectId];
  },
  addRemoveProjects: function(monthlyClientProject){
    if(this.has(monthlyClientProject)) {
      this.splice(this.indexOf(monthlyClientProject), 1);
      delete this.monthlyProjectIdMap[monthlyClientProject.clientProjectId];
    } else {
      this.push(monthlyClientProject);
      this.monthlyProjectIdMap[monthlyClientProject.clientProjectId] = monthlyClientProject;
    }
  }
});


var ContributionMonth = DefineMap.extend({
  date: "date",
  monthlyOSProjects: {Type: [MonthlyOSProject]},
  monthlyClientProjects: MonthlyClientProject.List
});


ContributionMonth.connection = superMap({
  Map: ContributionMonth,
  List: ContributionMonth.List,
  url: "/api/contribution_months",
  name: "contributionMonth",
  algebra: contributionMonthAlgebra,
  idProp: "_id"
});
ContributionMonth.algebra = contributionMonthAlgebra;

export default ContributionMonth;
