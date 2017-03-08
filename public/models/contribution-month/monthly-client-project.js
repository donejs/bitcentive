/**
 * @module {can-map} bitcentive/models/contribution-month/monthly-client-project MonthlyClientProject
 * @parent bitcentive.clientModels
 *
 * @group bitcentive/models/contribution-month/monthly-client-project.properties 0 properties
 */

import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import MonthlyClientProjectOsProjectList from "./monthly-client-project-os-project-list";
import ClientProject from "../client-project";

const MonthlyClientProject = DefineMap.extend( "MonthlyClientProject", { seal: false }, {
  clientProjectRef: ClientProject.Ref,
  hours: "number",
  monthlyClientProjectsOSProjects: {
    Type: MonthlyClientProjectOsProjectList,
    Value: MonthlyClientProjectOsProjectList
  }
});

MonthlyClientProject.List = DefineList.extend( "MonthlyClientProjectList", {
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
        clientProjectRef: clientProject.serialize(),
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
