import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import MonthlyClientProjectsOsProject from "./monthly-client-projects-os-project";
import ClientProject from "./client-project";

var MonthlyClientProject = DefineMap.extend("MonthlyClientProject",{
  clientProjectRef: {
    type: ClientProject.Ref.type
  },
  hours: "number",
  monthlyClientProjectsOSProjects: {
    Type: MonthlyClientProjectsOsProject.List,
    Value: MonthlyClientProjectsOsProject.List
  },
  accessList:{
    type: DefineList.List,
    serialize:false
  }
});

MonthlyClientProject.List = DefineList.extend({
  "*": MonthlyClientProject,
  accessList:{
    type: DefineList.List,
    serialize:false
  },
  monthlyProjectIdMap: {
    get: function() {
      var map = {};
      this.forEach(function(monthlyClientProject, index) {
        map[monthlyClientProject.clientProjectRef._id] = index;
      });
      return map;
    }
  },
  has: function(clientProject) {
    let monthlyClientProject;
    if (!!clientProject._id) {
      monthlyClientProject = new MonthlyClientProject({
        clientProjectRef: clientProject._id,
        clientProject: clientProject,
        hours: 0
      });
    }
    else {
      monthlyClientProject = clientProject;
    }
    return monthlyClientProject.clientProjectRef._id in this.monthlyProjectIdMap;
  },
  toggleProject: function(clientProjectRef){
    let monthlyClientProject = new MonthlyClientProject({
        clientProjectRef: clientProjectRef._id,
        clientProject: clientProjectRef,
        hours: 0,
        monthlyClientProjectsOSProjects: []
      });
    var index =  this.monthlyProjectIdMap[monthlyClientProject.clientProjectRef._id];
    if(index != null) {
      this.splice(index, 1);
    } else {
      this.push(monthlyClientProject);
    }
  }
});

export default MonthlyClientProject;
