/**
 * @module {can-map} bitcentive/models/contribution-month/monthly-client-projects-os-project-list MonthlyClientProjectOsProjectList
 * @parent bitcentive.clientModels
 *
 * @group bitcentive/models/contribution-month/monthly-client-projects-os-project-list.properties 0 properties
 */

import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "../os-project";
import ClientProject from "../client-project";

const MonthlyClientProjectOsProjectList = DefineList.extend("MonthlyClientProjectOsProjectList", {
  "#": OSProject.Ref,
  get osProjectIdMap() {
    const map = {};
    this.forEach( osProjectRef => {
      map[osProjectRef._id] = osProjectRef;
    });
    return map;
  },
  has( monthlyOsProject ){
    return monthlyOsProject.osProjectRef._id in this.osProjectIdMap;
  },
  toggleProject( monthlyOSProject ){
    const osProjectRef = this.osProjectIdMap[monthlyOSProject.osProjectRef._id];
    if( osProjectRef ) {
      this.splice( this.indexOf(osProjectRef), 1);
    } else {
      this.push( monthlyOSProject.osProjectRef );
    }
  },
});

export default MonthlyClientProjectOsProjectList;
