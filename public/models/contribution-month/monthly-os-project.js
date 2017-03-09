/**
 * @module {can-map} bitcentive/models/monthly-os-project MonthlyOSProject
 * @parent bitcentive.clientModels
 *
 * @group bitcentive/models/contribution-month/monthly-os-project.properties 0 properties
 */

import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import Observation from "can-observation";

import ContributionMonth from "./contribution-month";
import OSProject from "../os-project";

const MonthlyOSProject = DefineMap.extend("MonthlyOSProject", { seal: false }, {
  significance: "number",
  commissioned: "boolean",
  osProjectRef: OSProject.Ref,
  contributionMonth: {
    Type: ContributionMonth,
    serialize: false
  },
  getTotal() {
    // should this implementation be hidden and moved to contributionMonth: `contributionMonth.getOSProjectTotal( this )`?
    let calculations = this.contributionMonth &&
      this.contributionMonth.calculations;
    return calculations && calculations.osProjects[this.osProjectRef._id] || 0.0;
  },
  remove() {
    this.contributionMonth.removeMonthlyOSProject( this );
  }
});

MonthlyOSProject.List = DefineList.extend("MonthlyOSProjectList", {
  "#": {
    Type: MonthlyOSProject,
    added( items ) {
      this.contributionMonth && items.forEach( monthlyOSProject => {
        monthlyOSProject.contributionMonth = this.contributionMonth;
      } );
      return items;
    },
    removed( items ) {
      items.forEach( monthlyOSProject => {
        monthlyOSProject.contributionMonth = null;
      } );
      return items;
    }
  },
  contributionMonth: {
    set( contributionMonth ) {
      this.forEach( monthlyOSProject => {
        monthlyOSProject.contributionMonth = contributionMonth;
      });
      return contributionMonth;
    },
    Type: ContributionMonth,
    serialize: false
  },
  has( osProject ){
    return osProject._id in this.monthlyOSProjectIdMap;
  },
  getSignificance( osProjectRef ) {
    const monthlyOSProject = this.monthlyOSProjectIdMap[osProjectRef._id];
    return monthlyOSProject ? monthlyOSProject.significance : false;
  },
  get monthlyOSProjectIdMap() {
    const map = {};
    this.forEach( monthlyOSProject => {
      map[monthlyOSProject.osProjectRef._id] = monthlyOSProject;
    });
    return map;
  },
  get commissioned() {
    return this.filter({ commissioned: true });
  }
});

export default MonthlyOSProject;
