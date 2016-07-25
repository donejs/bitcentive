import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject  from "./os-project";
import ClientProject from "./client-project";

var MonthlyClientProjectsOsProject = DefineMap.extend("MonthlyClientProjectsOsProject",{
    osProjectId: "string",
    osProjectRef: {
      type: OSProject.Ref.type,
      serialize: function(ref) {
        debugger;
        return ref._id;
      }
    }
});

MonthlyClientProjectsOsProject.List = DefineList.extend({
  "*": MonthlyClientProjectsOsProject,
  osProjectIdMap: {
    get: function(){
      var map = {};
      this.forEach(function(monthlyClientProjectOSProject, index){
        map[monthlyClientProjectOSProject.osProjectRef._id] = index;
      });
      return map;
    }
  },
  has: function(monthlyOsProject){
    return monthlyOsProject.osProjectRef._id in this.osProjectIdMap;
  },
  toggleProject: function(monthlyOSProject){
    let newMonthlyOSProject = new MonthlyClientProjectsOsProject({
      osProjectId: monthlyOSProject.osProject._id,
      osProjectRef: monthlyOSProject.osProjectRef
    });
    var index = this.osProjectIdMap[newMonthlyOSProject.osProjectRef._id];

    if(index != undefined) {
      this.splice(index, 1);
    } else {
      this.push(newMonthlyOSProject);
    }
  },
});


export default MonthlyClientProjectsOsProject;
