import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "../os-project";
import ClientProject from "../client-project";

const MonthlyClientProjectsOsProjectList = DefineList.extend("MonthlyClientProjectsOsProjectList", {
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


export default MonthlyClientProjectsOsProjectList;
