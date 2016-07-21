import ClientProject from "./client-project";
import OSProject from "./os-project";
import Contributor from "./contributor";

import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superMap from "can-connect/can/super-map/";

import "../lib/prefilter";


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

var MonthlyClientProjectsOsProject = DefineMap.extend("MonthlyClientProjectOsProject",{
    osProjectId: "123123sdfasdf",
    osProject: {type: makeOSProject }
});

MonthlyClientProjectsOsProject.List = DefineList.extend({
  "*": MonthlyClientProjectsOsProject,
  osProjectIdMap: {
    get: function(){
      var map = {};
      this.forEach(function(monthlyClientProjectOSProject, index){
        map[monthlyClientProjectOSProject.osProjectId] = index;
      });
      return map;
    }
  },
  has: function(monthlyOsProject){
    return monthlyOsProject.osProjectId in this.osProjectIdMap;
  },
  toggleProject: function(monthlyOSProject){
    var index = this.osProjectIdMap[monthlyOSProject.osProjectId];

    if(index != undefined) {
      this.splice(index, 1);
    } else {
      this.push(monthlyOSProject);
    }
  },
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
      this.forEach(function(monthlyClientProject, index) {
        map[monthlyClientProject.clientProjectId] = index;
      });
      return map;
    }
  },
  has: function(clientProject) {
    let monthlyClientProject;
    if (!!clientProject._id) {
      monthlyClientProject = new MonthlyClientProject({
        clientProjectId: clientProject._id,
        clientProject: clientProject,
        hours: 0
      });
    }
    else {
      monthlyClientProject = clientProject;
    }
    return monthlyClientProject.clientProjectId in this.monthlyProjectIdMap;
  },
  toggleProject: function(clientProject){
    let monthlyClientProject;
    if (!!clientProject._id) {
      monthlyClientProject = new MonthlyClientProject({
        clientProjectId: clientProject._id,
        clientProject: clientProject,
        hours: 0
      });
    }
    else {
      monthlyClientProject = clientProject;
    }
    var index =  this.monthlyProjectIdMap[monthlyClientProject.clientProjectId];
    if(index != null) {
      this.splice(index, 1);
    } else {
      this.push(monthlyClientProject);
    }
  }
});


var ContributionMonth = DefineMap.extend({
  date: "date",
  monthlyOSProjects: {Type: [MonthlyOSProject]},
  monthlyClientProjects: MonthlyClientProject.List,
  addNewMonthlyOSProject: function(newProject) {
    console.log("adding new project to monthly OS project list", newProject);
    let monthlyOSProject = new MonthlyOSProject({
      significance: 0,
      commissioned: false,
      osProjectId: newProject._id,
      osProject: newProject
    });

    console.log("Monthly OS Project: ", monthlyOSProject);
    this.monthlyOSProjects.push(monthlyOSProject);
    this.save().then(function() { console.info("contributionMonth saved"); }, function() {
      console.error("Failed saving the contributionMonth obj: ", arguments);
    });
  },
  removeClientProject: function(clientProject) {
    this.monthlyClientProjects.splice(this.monthlyClientProjects.indexOf(clientProject), 1);
  },
  getRate: function(monthlyClientProject) {
    const monthlyOSProjects = this.monthlyOSProjects;
    const map = {};
    let totalSignificance = 0;

    monthlyOSProjects.forEach( osProject =>{
      totalSignificance += osProject.significance;
      map[osProject.osProjectId] = osProject;
    });
    let usedSignificance = 0;
    monthlyClientProject.monthlyClientProjectsOsProjects.forEach( usedOSProject => {
      if(!!map[usedOSProject.osProjectId]) {
        usedSignificance += map[usedOSProject.osProjectId].significance;
      }
    });
    return 4 - 2 * (usedSignificance / totalSignificance);
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
