import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "./os-project";
import ContributionMonth from "./contribution-month/";
import Observation from "can-observation";

var MonthlyOSProject = DefineMap.extend("MonthlyOSProject",{
  significance: "number",
  commissioned: "boolean",
  osProjectRef: { type: OSProject.Ref.type },
  osProjectID: "number",
  contributionMonth: {
    Type: ContributionMonth,
    serialize: false
  },
  init: function() {
    if (!this.osProjectID && this.osProjectRef) {
      this.osProjectID = this.osProjectRef._id;
    }
  }
});

MonthlyOSProject.List = DefineList.extend({
  "#": {
    Type: MonthlyOSProject,
    added: function(items) {
      items.forEach(function(monthlyOSProject) {
        monthlyOSProject.contributionMonth = this.contributionMonth;
        this.monthlyOSProjectIdMap[monthlyOSProject.osProjectID] = monthlyOSProject;
      }, this);
      return items;
    },
    removed: function(items) {
      items.forEach(function(monthlyOSProject) {
        monthlyOSProject.contributionMonth = null;
        this.monthlyOSProjectIdMap[monthlyOSProject.osProjectID] = null;
      }, this);
      return items;
    }
  },
  init: function() {
    this.forEach((monthlyOSProject) => {
      this.monthlyOSProjectIdMap[monthlyOSProject.osProjectRef.id] = monthlyOSProject;
    }, this);
  },
  contributionMonth: {
    set: function(contributionMonth) {
      this.forEach(function(monthlyOSProject) {
        monthlyOSProject.contributionMonth = contributionMonth;
      });
      return contributionMonth;
    },
    Type: ContributionMonth,
    serialize: false
  },
  monthlyOSProjectIdMap: {
    type: "any",
    value: {}
  },
  has: function(osProject){
    return osProject._id in this.monthlyOSProjectIdMap;
  },
  getSignificance: function(osProjectRef) {
    var monthlyOSProject = this.monthlyOSProjectIdMap[osProjectRef._id];
    return monthlyOSProject ? monthlyOSProject.significance : false;
  },
  commissioned: {
    get: function(){
      return this.filter({ commissioned: true });
    }
  }
});

export default MonthlyOSProject;
