import ClientProject from "../client-project";
import OSProject from "../os-project";
import Contributor from "../contributor";

import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";

import "../../lib/prefilter";
import superModel from '../../lib/super-model';

import moment from "moment";
import MonthlyOSProject from "./monthly-os-project";
import MonthlyClientProject from "./monthly-client-project";
import MonthlyContributions from "./monthly-contributions";

import feathersBehavior from 'can-connect-feathers';

import { contributionMonthAlgebra } from '../algebras';

var ContributionMonth = DefineMap.extend("ContributionMonth",{
  _id: "string",
  __v:"number",
  date: "date",
  monthlyOSProjects: {
    Type: MonthlyOSProject.List,
    set: function(monthlyOSProjects){
      monthlyOSProjects.contributionMonth = this;
      return monthlyOSProjects;
    }
  },
  monthlyClientProjects: MonthlyClientProject.List,
  monthlyContributions: MonthlyContributions.List,
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

        monthlyClientProject.monthlyClientProjectsOSProjects.forEach( usedOSProject => {
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

        // Don't divide by 0 if there are no commissioned projects
        if (totalCommissionedSignificance === 0) {
          totalCommissionedSignificance = 1;
        }

        let rate = 4 - 2 * (usedCommissionedSignificance / totalCommissionedSignificance);
        rate = isNaN(rate) ? 0 : rate; //handle the situation where there is not significance
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

  // Can add using an osProject or monthlyOSProject
  addNewMonthlyOSProject: function(project) {
    let monthlyOSProject;
    if (project instanceof MonthlyOSProject) {
      monthlyOSProject = project;
      this.monthlyOSProjects.push(project);
    }
    else {
      monthlyOSProject = new MonthlyOSProject({
        significance: 0,
        commissioned: false,
        osProjectRef: project,
        osProjectID: project._id
      });
      this.monthlyOSProjects.push(monthlyOSProject);
    }
    this.save().then(function() {
    }, function() {
      console.error("Failed saving the contributionMonth obj: ", arguments);
    });
    return monthlyOSProject;
  },
  removeMonthlyOSProject: function(monthlyOSProject) {
    this.monthlyOSProjects.splice(this.monthlyOSProjects.indexOf(monthlyOSProject), 1);
    this.monthlyClientProjects.forEach((clientProject) => {
      clientProject.monthlyClientProjectOSProjects.splice(clientProject.monthlyClientProjectsOSProjects.indexOf(monthlyOSProject), 1);
    });
    this.save().then(function() {
    }, function() {
      console.error("Failed saving the contributionMonth obj: ", arguments);
    });
  },

  commissionedMonthlyOSProjectsCountFor: function(monthlyClientProject) {
    if(this.calculations.clientProjects.hasOwnProperty(monthlyClientProject.clientProjectRef._id)) {
      return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].commissionedMonthlyOSProjects.length;
    }
    return 0;
  },
  uncommissionedMonthlyOSProjectsCountFor: function(monthlyClientProject) {
    if(this.calculations.clientProjects.hasOwnProperty(monthlyClientProject.clientProjectRef._id)) {
      return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].uncommissionedMonthlyOSProjects.length;
    }
    return 0;
  },
  addNewMonthlyOSProject: function(newProject) {
    let monthlyOSProject = new MonthlyOSProject({
      significance: 0,
      commissioned: false,
      osProjectRef: newProject,
      osProject: newProject._id
    });
    this.monthlyOSProjects.push(monthlyOSProject);
    this.save().then(function() {
    }, function() {
      console.error("Failed saving the contributionMonth obj: ", arguments);
    });
  },
  removeMonthlyOSProject: function(osProject) {
    this.monthlyOSProjects.splice(this.monthlyOSProjects.indexOf(osProject), 1);
    this.monthlyClientProjects.forEach((clientProject) => {
      clientProject.monthlyClientProjectsOSProjects.splice(clientProject.monthlyClientProjectsOSProjects.indexOf(osProject), 1);
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

  },

  addContribution(newContribution) {
    this.monthlyContributions.push(newContribution);
    this.save().then(function() {}, function() {
      console.error("Failed saving the contributionMonth obj: ", arguments);
    });
  },

  removeContribution(contribution) {
    const index = this.monthlyContributions.indexOf(contribution);
    this.monthlyContributions.splice(index, 1);
    this.save().then(function() {}, function() {
      console.error("Failed saving the contributionMonth obj: ", arguments);
    });
  }
});

ContributionMonth.List = DefineList.extend({
  "#": ContributionMonth
});

var dataMassage = function(oType) {
  return function(item) {
    if (typeof item[oType + 'Id'] === 'object') {
      item[oType] = item[oType + 'Id'];
      item[oType + 'Id'] = item[oType]._id;
    }
  };
};

ContributionMonth.connection = superModel({
  parseInstanceProp: "data",
  Map: ContributionMonth,
  List: ContributionMonth.List,
  url: "/api/contribution_months",
  name: "contributionMonth",
  algebra: contributionMonthAlgebra
});

ContributionMonth.algebra = contributionMonthAlgebra;

export default ContributionMonth;

export { contributionMonthAlgebra as algebra };
