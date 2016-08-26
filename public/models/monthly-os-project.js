import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject  from "./os-project";

var MonthlyOSProject = DefineMap.extend("MonthlyOSProject",{
  significance: "number",
  commissioned: "boolean",
  osProjectRef: {
    type: OSProject.Ref.type
  },
  accessList:{
    type: DefineList.List,
    serialize:false
  }
});

MonthlyOSProject.List = DefineList.extend({
  "*": MonthlyOSProject,
  accessList:{
    type: DefineList.List,
    serialize:false
  },
  monthlyOSProjectIdMap: {
    get: function() {
      var map = {};
      this.forEach((monthlyOSProject) => {
        map[monthlyOSProject.osProjectRef._id] = monthlyOSProject;
      });
      return map;
    }
  },
  has: function(osProject){
    return osProject._id in this.monthlyOSProjectIdMap;
  },
  getSignificance: function(osProjectRef) {
    var osProject = this.monthlyOSProjectIdMap[osProjectRef._id];
    return osProject ? osProject.significance : 0;
  },
  commissioned: {
    get: function(){
      return this.filter({commissioned: true});
    }
  }
});

export default MonthlyOSProject;
