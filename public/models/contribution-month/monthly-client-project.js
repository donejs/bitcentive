import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "../os-project";
import ClientProject from "../client-project";
import { indexOfRefForModel } from "bitcentive/lib/ref-list-utils";

var MonthlyClientProject = DefineMap.extend("MonthlyClientProject", {
  clientProjectRef: { type: ClientProject.Ref.type },
  hours: "number",
  osProjects: [ { type: OSProject.Ref.type } ]
});

MonthlyClientProject.List = DefineList.extend({
  "#": MonthlyClientProject,
  has: function( clientProject ) {
    const index = indexOfRefForModel( this, clientProject, 'clientProjectRef' );
    return index !== -1;
  },
  toggleProject: function( clientProject ){
    const index = indexOfRefForModel( this, clientProject, 'clientProjectRef' );
    if ( index !== -1 ) {
      this.splice(index, 1);
    } else {
      const newMCP = new MonthlyClientProject({
        clientProjectRef: clientProject,
        hours: 0,
        osProjects: []
      });
      this.push( newMCP );
    }
  }
});

export default MonthlyClientProject;
