import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject  from "./os-project";

var MonthlyOSProject = DefineMap.extend("MonthlyOSProject",{
  significance: "number",
  commissioned: "boolean",
  osProjectRef: {
    type: OSProject.Ref.type,
    serialize: function(ref) {
      debugger;
      return ref._id;
    }
  }
});

MonthlyOSProject.List = DefineList.extend({
  "*": MonthlyOSProject,
  monthlyOSProjectIdMap: {
    get: function() {
      var map = {};
      debugger;
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
