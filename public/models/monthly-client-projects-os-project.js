import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject  from "./os-project";
import ClientProject from "./client-project";

var MonthlyClientProjectsOsProject = DefineMap.extend("MonthlyClientProjectsOsProject",{
    osProjectRef: {
      type: OSProject.Ref.type
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
  serialize: function() {
    let osProjectIds = [];
    for(var i in this.osProjectIdMap) {
      osProjectIds.push(i);
    }
    return osProjectIds;
  },
  has: function(monthlyOsProject){
    return monthlyOsProject.osProjectRef._id in this.osProjectIdMap;
  },
  toggleProject: function(monthlyOSProject){
    let newMonthlyOSProject = new MonthlyClientProjectsOsProject({
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
