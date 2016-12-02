import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "../os-project";
import Contributor from "../contributor";

const MonthlyContributions = DefineMap.extend( "MonthlyContributions", {
  contributorRef: {
    type: Contributor.Ref.type
  },
  osProjectRef: {
    type: OSProject.Ref.type
  },
  description: "string",
  points: "number"
});

MonthlyContributions.List = DefineList.extend({
  "#": MonthlyContributions
});

export default MonthlyContributions;
