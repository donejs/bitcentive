import DefineMap from "can-define/map/";
import OSProject from "./os-project";
import Contributor from "./contributor";

var Contribution =  DefineMap.extend("Contribution", {
  _id: "string",
  __v: 'number',
  description: "string",
  points: "number",
  osProject: {
    Type: OSProject
  },
  contributor: {
    Type: Contributor
  }
});

export default Contribution;
