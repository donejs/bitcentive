import DefineMap from "can-define/map/";
import DefineList from 'can-define/list/';

export default DefineMap.extend({
  _id: "string",
  name: "string",
  accessList:{
    type: DefineList.List,
    serialize:false
  }
})
