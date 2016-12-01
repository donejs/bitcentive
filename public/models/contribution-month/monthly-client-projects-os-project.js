import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "../os-project";
import ClientProject from "../client-project";

const MonthlyClientProjectsOsProject = DefineMap.extend( "MonthlyClientProjectsOsProject", {
  osProjectRef: {
    type: OSProject.Ref.type
  }
});

MonthlyClientProjectsOsProject.List = DefineList.extend({
  "#": MonthlyClientProjectsOsProject,
  get osProjectIdMap() {
    const map = {};
    this.forEach( monthlyClientProjectOSProject => {
      map[monthlyClientProjectOSProject.osProjectRef._id] = monthlyClientProjectOSProject;
    });
    return map;
  },
  has( monthlyOsProject ){
    return monthlyOsProject.osProjectRef._id in this.osProjectIdMap;
  },
  toggleProject( monthlyOSProject ){
    const monthlyClientProjectsOsProject = this.osProjectIdMap[monthlyOSProject.osProjectRef._id];
    if( monthlyClientProjectsOsProject ) {
      this.splice( this.indexOf(monthlyClientProjectsOsProject), 1);
    } else {
      this.push( new MonthlyClientProjectsOsProject({
        osProjectRef: monthlyOSProject.osProjectRef
      }) );
    }
  },
});


export default MonthlyClientProjectsOsProject;
