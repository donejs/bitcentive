import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "../os-project";
import Contributor from "../contributor";

const MonthlyContributor = DefineMap.extend( "MonthlyContributor", { seal: false }, {
  _id: {type: "string", identity: true},
  contributorRef: Contributor.Ref,
});

MonthlyContributor.List = DefineList.extend( "MonthlyContributorList", {
  "#": MonthlyContributor
});

export default MonthlyContributor;
