import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "../os-project";
import ContributionMonth from "./contribution-month";
import Observation from "can-observation";
import { indexOfRefForModel } from "bitcentive/lib/ref-list-utils";

var MonthlyOSProject = DefineMap.extend("MonthlyOSProject", {
  osProjectRef: { type: OSProject.Ref.type },
  significance: "number",
  commissioned: "boolean",
  contributionMonth: {
    Type: ContributionMonth,
    serialize: false
  }
});

MonthlyOSProject.List = DefineList.extend({
  "#": {
    Type: MonthlyOSProject,
    added: function( items ) {
      items.forEach( monthlyOSProject => {
        monthlyOSProject.contributionMonth = this.contributionMonth;
      } );
      return items;
    },
    removed: function( items ) {
      items.forEach( monthlyOSProject => {
        monthlyOSProject.contributionMonth = undefined;
      });
      return items;
    }
  },
  contributionMonth: {
    set( contributionMonth ) {
      this.forEach( monthlyOSProject => {
        monthlyOSProject.contributionMonth = contributionMonth;
      } );
      return contributionMonth;
    },
    Type: ContributionMonth,
    serialize: false
  },
  has( osProject ){
    const index = indexOfRefForModel( this, osProject, 'osProjectRef' );
    return index !== -1;
  },
  getMonthlyOsProject( osProject ) {
    const index = indexOfRefForModel( this, osProject, 'osProjectRef' );
    return this[index];
  },
  getSignificance( osProject ) {
    return this.getMonthlyOsProject( osProject ).significance;
  },
  commissioned: {
    get: function(){
      return this.filter({ commissioned: true });
    }
  }
});

export default MonthlyOSProject;
