import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject  from "./os-project";

var MonthlyClientProjectsOsProject = DefineMap.extend("MonthlyClientProjectsOsProject",{
    clientProjectRef: "123123sdfasdf",
    osProjectRef: { type: OSProject.Ref.type }
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
      clientProjectRef: monthlyOSProject.osProjectRef._id,
      osProject: monthlyOSProject.osProject
    });
    var index = this.osProjectRef._idMap[newMonthlyOSProject.osProjectRef._id];

    if(index != undefined) {
      this.splice(index, 1);
    } else {
      this.push(newMonthlyOSProject);
    }
  },
});


export default MonthlyClientProjectsOsProject;
