/**
 * @module {can-map} bitcentive/models/contribution-month/monthly-contribution MonthlyContribution
 * @parent bitcentive.clientModels
 *
 * @group bitcentive/models/contribution-month/monthly-contribution.properties 0 properties
 */

import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "../os-project";
import Contributor from "../contributor";

const MonthlyContribution = DefineMap.extend( "MonthlyContribution", { seal: false }, {
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
