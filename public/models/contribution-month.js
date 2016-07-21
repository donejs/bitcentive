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
  }
});

var MonthlyClientProjectsOsProject = DefineMap.extend("MonthlyClientProjectOsProject",{
    osProjectId: "123123sdfasdf",
    osProject: {type: makeOSProject }
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
  clientProject: {type: makeClientProject},
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
  monthlyOSProjects: MonthlyOSProject.List,
  monthlyClientProjects: MonthlyClientProject.List,
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
  algebra: contributionMonthAlgebra,
  idProp: "_id"
});
ContributionMonth.algebra = contributionMonthAlgebra;

export default ContributionMonth;
