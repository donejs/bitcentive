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

var makeOSProject = function(props){
  if(props instanceof OSProject) {
    return props;
  } else {
    return OSProject.connection.hydrateInstance(props);
  }
};
var makeClientProject = function(props){
  if(props instanceof ClientProject) {
    return props;
  } else {
    return ClientProject.connection.hydrateInstance(props);
  }
};

var MonthlyOSProject = DefineMap.extend("MonthlyOSProject",{
  osProjectId: "string",
  significance: "number",
  commissioned: "boolean",
  osProject: { type: makeOSProject }
});

MonthlyOSProject.List = DefineList.extend({
  "*": MonthlyOSProject,
  monthlyOSProjectIdMap: {
    get: function() {
      var map = {};
      this.forEach((monthlyOSProject) => {
        map[monthlyOSProject.osProjectId] = monthlyOSProject;
      });
      return map;
    }
  },
  has: function(osProject){
    return osProject._id in this.monthlyOSProjectIdMap;
  },
  getSignificance: function(osProjectId) {
    var osProject = this.monthlyOSProjectIdMap[osProjectId];
    return osProject ? osProject.significance : 0;
  }
});

var MonthlyClientProjectsOsProject = DefineMap.extend("MonthlyClientProjectOsProject",{
    osProjectId: "123123sdfasdf",
    osProject: {type: makeOSProject }
});

var MonthlyClientProject = DefineMap.extend("MonthlyClientProject",{
  clientProjectId: "string",
  clientProject: {type: makeClientProject},
  hours: "number",
  monthlyClientProjectsOsProjects: {Type: [MonthlyClientProjectsOsProject]},
});


var ContributionMonth = DefineMap.extend({
  date: "date",
  monthlyOSProjects: MonthlyOSProject.List,
  monthlyClientProjects: {Type: [MonthlyClientProject]},
  calculations: {
    get: function() {
      var calculations = {};

      this.monthlyClientProjects.forEach((monthlyClientProject) => {
        calculations[monthlyClientProject.clientProjectId] = {
          significance: 0
        };
        monthlyClientProject.monthlyClientProjectsOsProjects.forEach((monthlyOSProject) => {
          calculations[monthlyClientProject.clientProjectId].significance =+ this.monthlyOSProjects.getSignificance(monthlyOSProject.osProjectId);

        });
      });

      return calculations;
    }
  },
  addNewMonthlyOSProject: function(newProject) {
    let monthlyOSProject = new MonthlyOSProject({
      significance: 0,
      commissioned: false,
      osProjectId: newProject._id,
      osProject: newProject
    });
    this.monthlyOSProjects.push(monthlyOSProject);
    this.save();
  }
});


ContributionMonth.connection = superMap({
  idProp: "_id",
  Map: ContributionMonth,
  List: ContributionMonth.List,
  url: "/api/contribution_months",
  name: "contributionMonth",
  algebra: contributionMonthAlgebra
});
ContributionMonth.algebra = contributionMonthAlgebra;

export default ContributionMonth;
