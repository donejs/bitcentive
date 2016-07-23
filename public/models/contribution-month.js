import ClientProject from "./client-project";
import OSProject from "./os-project";
import Contributor from "./contributor";

import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superMap from "can-connect/can/super-map/";

import "../lib/prefilter";
import moment from "moment";

var contributionMonthAlgebra = new set.Algebra(
  set.comparators.id("_id"),
  set.comparators.sort("$sort", function($sort, cm1, cm2){
    if($sort.date) {
      if(parseInt($sort.date) === 1) {
        return moment(cm1.date).toDate() - moment(cm2.date).toDate();
      } else {
        return moment(cm2.date).toDate() - moment(cm1.date).toDate();
      }
    } else {
      throw "can't sort that way";
    }

  }),
  {
    "$populate": function(){
      return true;
    }
  }
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
  osProject: { type: makeOSProject },
  osProjectRef: {type: function(ref){
    if(typeof ref === "string") {
      OSProject.Ref.hydrateInstance({_id: ref});
    } else {
      OSProject.Ref.hydrateInstance({_id: ref._id, value: OSProject.hydrateInstance(ref)});
    }
  }}
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

    let newMonthlyOSProject = new MonthlyClientProjectsOsProject({
      osProjectId: monthlyOSProject.osProjectId,
      osProject: monthlyOSProject.osProject
    });
    var index = this.osProjectIdMap[newMonthlyOSProject.osProjectId];

    if(index != undefined) {
      this.splice(index, 1);
    } else {
      this.push(newMonthlyOSProject);
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
    let monthlyClientProject = new MonthlyClientProject({
        clientProjectId: clientProject._id,
        clientProject: clientProject,
        hours: 0,
        monthlyClientProjectsOsProjects: []
      });
    var index =  this.monthlyProjectIdMap[monthlyClientProject.clientProjectId];
    if(index != null) {
      this.splice(index, 1);
    } else {
      this.push(monthlyClientProject);
    }
  }
});


var ContributionMonth = DefineMap.extend("ContributionMonth",{
  _id: "string",
  __v:"number",
  date: "date",
  monthlyOSProjects: {
    Type: MonthlyOSProject.List,
    set: function(newVal){
      //debugger;



      return newVal;
    }
  },
  monthlyClientProjects: MonthlyClientProject.List,
  calculations: {
    get: function() {
      var calculations = {
          clientProjects: {},
          totalDollarForAllClientProjects: 0,
          osProjects: {}
      };

      var clientProjectsUsingOSProject = {};
      var monthlyOSProjectMap = {};
      var totalCommissionedSignificance = 0;
      this.monthlyOSProjects.forEach( osProject =>{
        monthlyOSProjectMap[osProject.osProjectId] = osProject;
        if(osProject.commissioned) {
          totalCommissionedSignificance += osProject.significance;
        }
      });
      // for each client project, calculate out:
      // - rate (based on how many commissioned projects it uses)
      // - total - (rate * hours)
      // - totalSignificance - the total significance for this project
      // - osProjectsUsed - a map of the OS projects used

      this.monthlyClientProjects.forEach((monthlyClientProject) => {

        let totalSignificance = 0;
        let usedCommissionedSignificance = 0;

        monthlyClientProject.monthlyClientProjectsOsProjects.forEach( usedOSProject => {
          var monthlyOSProject = monthlyOSProjectMap[usedOSProject.osProjectId];
          if(monthlyOSProject) {
            // calculate needed significances
            if(monthlyOSProject.commissioned) {
              usedCommissionedSignificance += monthlyOSProject.significance;
            }
            totalSignificance += monthlyOSProject.significance;

            // for an OS project, make it possible to get the clients using it
            if(!clientProjectsUsingOSProject[usedOSProject.osProjectId]) {
              clientProjectsUsingOSProject[usedOSProject.osProjectId] = [];
            }
            clientProjectsUsingOSProject[usedOSProject.osProjectId].push(monthlyClientProject);
          }
        });

        let rate = 4 - 2 * (usedCommissionedSignificance / totalCommissionedSignificance);
        let totalAmount = parseFloat(Math.round((rate * monthlyClientProject.hours) * 100) / 100).toFixed(2);

        calculations.totalDollarForAllClientProjects =+ totalAmount;

        calculations.clientProjects[monthlyClientProject.clientProjectId] = {
          rate: parseFloat(Math.round(rate * 100) / 100).toFixed(2),
          totalAmount,
          totalSignificance
        };
      });

      // once the rates are calculated, calculates for each OS project:
      // - total - for each clientProject using this project, take it's share
      this.monthlyOSProjects.forEach(function(osProject) {

        var clientProjects = clientProjectsUsingOSProject[osProject.osProjectId];
        if(clientProjects) {
          calculations.osProjects[osProject.osProjectId] = clientProjects.reduce(function(prev, monthlyClientProject){
            var clientProjectCalc = calculations.clientProjects[monthlyClientProject.clientProjectId];
            return prev + (clientProjectCalc.totalAmount * osProject.significance / clientProjectCalc.totalSignificance);
          },0)
        } else {
          calculations.osProjects[osProject.osProjectId] = 0;
        }
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
    this.save().then(function() {}, function() {
      console.error("Failed saving the contributionMonth obj: ", arguments);
    });
  },
  removeClientProject: function(clientProject) {
    this.monthlyClientProjects.splice(this.monthlyClientProjects.indexOf(clientProject), 1);
  },
  getRate: function(monthlyClientProject) {
    if(this.calculations.clientProjects[monthlyClientProject.clientProjectId]) {
        return this.calculations.clientProjects[monthlyClientProject.clientProjectId].rate;
    }
    return 0;

  },
  getTotal: function(monthlyClientProject) {
    if(this.calculations.clientProjects[monthlyClientProject.clientProjectId]) {
        return this.calculations.clientProjects[monthlyClientProject.clientProjectId].totalAmount;
    }
    return 0;

  }
});

var dataMassage = function(oType) {
  return function(item) {
    if (typeof item[oType + 'Id'] === 'object') {
      item[oType] = item[oType + 'Id'];
      item[oType + 'Id'] = item[oType]._id;
    }
  };
};

ContributionMonth.connection = superMap({
  idProp: "_id",
  Map: ContributionMonth,
  List: ContributionMonth.List,
  url: "/api/contribution_months",
  name: "contributionMonth",
  algebra: contributionMonthAlgebra,
  parseInstanceData(responseData) {
    responseData.monthlyOSProjects.forEach(dataMassage("osProject"));

    responseData.monthlyClientProjects.forEach( (monthlyClientProject) => {
      dataMassage("clientProject")(monthlyClientProject);
      monthlyClientProject.monthlyClientProjectsOsProjects.forEach(dataMassage("osProject"));
    });

    console.log(responseData);

    return responseData;
  }
});
ContributionMonth.algebra = contributionMonthAlgebra;

export default ContributionMonth;
