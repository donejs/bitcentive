import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "../os-project";
import Contributor from "../contributor";

const MonthlyContribution = DefineMap.extend( "MonthlyContribution", { seal: false }, {
  _id: {type: "string", identity: true},
  contributorRef: Contributor.Ref,
  osProjectRef: OSProject.Ref,
  description: "string",
  points: "number"
});

MonthlyContribution.List = DefineList.extend( "MonthlyContributionList", {
  "#": MonthlyContribution,
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

export default MonthlyContribution;
