import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "../os-project";
import Contributor from "../contributor";

const MonthlyContributions = DefineMap.extend( "MonthlyContributions", { seal: false }, {
  contributorRef: Contributor.Ref,
  osProjectRef: OSProject.Ref,
  description: "string",
  points: "number"
});

MonthlyContributions.List = DefineList.extend({
  "#": MonthlyContributions,
  get contributorsMap() {
    const map = {};
    this.forEach(contributor => {
      if(!map[contributor.contributorRef._id]) {
        map[contributor.contributorRef._id] = {
          contributorRef: contributor.contributorRef
        };
      }
    });
    return map;
  }
});

export default MonthlyContributions;
