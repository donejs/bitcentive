import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import MonthlyClientProjectsOsProjectList from "./monthly-client-projects-os-project-list";
import ClientProject from "../client-project";

const MonthlyClientProject = DefineMap.extend( "MonthlyClientProject", {
  clientProjectRef: ClientProject.Ref,
  hours: "number",
  monthlyClientProjectsOSProjects: {
    Type: MonthlyClientProjectsOsProjectList,
    Value: MonthlyClientProjectsOsProjectList
  }
});

MonthlyClientProject.List = DefineList.extend({
  "#": MonthlyClientProject,
  has( clientProject ) {
    return clientProject._id in this.monthlyClientProjectIdMap;
  },
  toggleProject( clientProject ) {
    const instance = this.monthlyClientProjectIdMap[clientProject._id];
    if( instance ) {
      this.splice(this.indexOf(instance), 1);
    } else {
      this.push( new MonthlyClientProject({
        clientProjectRef: clientProject,
        hours: 0,
        monthlyClientProjectsOSProjects: []
      }) );
    }
  },
  get monthlyClientProjectIdMap() {
    const map = {};
    this.forEach( monthlyClientProject => {
      map[monthlyClientProject.clientProjectRef._id] = monthlyClientProject;
    });
    return map;
  }
});

export default MonthlyClientProject;
