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
  }
});

MonthlyOSProject.List = DefineList.extend("MonthlyOSProjectList", {
  "#": {
    Type: MonthlyOSProject,
    added( items ) {
      items.forEach( monthlyOSProject => {
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
