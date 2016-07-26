import ClientProject from "./client-project";
import OSProject from "./os-project";
import Contributor from "./contributor";

import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superMap from "can-connect/can/super-map/";

import "../lib/prefilter";
import moment from "moment";
import MonthlyOSProject from "./monthly-os-project";
import MonthlyClientProject from "./monthly-client-project";

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
  monthlyContributions: DefineList.List,
  calculations: {
    get: function() {
      console.log("Calculating..");
      var calculations = {
          clientProjects: {},
          totalDollarForAllClientProjects: 0,
          osProjects: {}
      };

      var clientProjectsUsingOSProject = {};
      var monthlyOSProjectMap = {};
      var totalCommissionedSignificance = 0;
      this.monthlyOSProjects.forEach( osProject => {
        monthlyOSProjectMap[osProject.osProjectRef._id] = osProject;
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
        let commissionedMonthlyOSProjects = [];
        let uncommissionedMonthlyOSProjects = [];

        monthlyClientProject.monthlyClientProjectsOsProjects.forEach( usedOSProject => {
          var monthlyOSProject = monthlyOSProjectMap[usedOSProject.osProjectRef._id];
          if(monthlyOSProject) {
            // calculate needed significances
            if(monthlyOSProject.commissioned) {
              usedCommissionedSignificance += monthlyOSProject.significance;
              commissionedMonthlyOSProjects.push(monthlyOSProject);
            } else {
              uncommissionedMonthlyOSProjects.push(monthlyOSProject);
            }
            totalSignificance += monthlyOSProject.significance;

            // for an OS project, make it possible to get the clients using it
            if(!clientProjectsUsingOSProject[usedOSProject.osProjectRef._id]) {
              clientProjectsUsingOSProject[usedOSProject.osProjectRef._id] = [];
            }
            clientProjectsUsingOSProject[usedOSProject.osProjectRef._id].push(monthlyClientProject);
          }
        });

        let rate = 4 - 2 * (usedCommissionedSignificance / totalCommissionedSignificance);
        let totalAmount = parseFloat(Math.round((rate * monthlyClientProject.hours) * 100) / 100).toFixed(2);

        calculations.totalDollarForAllClientProjects =+ totalAmount;

        calculations.clientProjects[monthlyClientProject.clientProjectRef._id] = {
          rate: parseFloat(Math.round(rate * 100) / 100).toFixed(2),
          totalAmount,
          totalSignificance,
          commissionedMonthlyOSProjects,
          uncommissionedMonthlyOSProjects
        };
      });

      // once the rates are calculated, calculates for each OS project:
      // - total - for each clientProject using this project, take it's share
      this.monthlyOSProjects.forEach(function(osProject) {

        var clientProjects = clientProjectsUsingOSProject[osProject.osProjectRef._id];
        if(clientProjects) {
          calculations.osProjects[osProject.osProjectRef._id] = clientProjects.reduce(function(prev, monthlyClientProject){
            var clientProjectCalc = calculations.clientProjects[monthlyClientProject.clientProjectRef._id];
            return prev + (clientProjectCalc.totalAmount * osProject.significance / clientProjectCalc.totalSignificance);
          },0);
        } else {
          calculations.osProjects[osProject.osProjectRef._id] = 0;
        }
      });

      return calculations;
    }
  },
  commissionedMonthlyOSProjectsCountFor: function(monthlyClientProject){
    return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].commissionedMonthlyOSProjects.length;
  },
  uncommissionedMonthlyOSProjectsCountFor: function(monthlyClientProject){
    return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].uncommissionedMonthlyOSProjects.length;
  },
  addNewMonthlyOSProject: function(newProject) {
    let monthlyOSProject = new MonthlyOSProject({
      significance: 0,
      commissioned: false,
      osProjectRef: newProject,
      osProject: newProject._id
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
    if(this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id]) {
        return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].rate;
    }
    return 0;

  },
  getTotal: function(monthlyClientProject) {
    if(this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id]) {
        return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].totalAmount;
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
  algebra: contributionMonthAlgebra
});
ContributionMonth.algebra = contributionMonthAlgebra;

export default ContributionMonth;
