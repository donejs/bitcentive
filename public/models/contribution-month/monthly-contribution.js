/**
 * @module {can-map} bitcentive/models/monthly-contribution MonthlyContribution
 * @parent bitcentive.clientModels
 *
 * A monthly contribution model
 *
 * @group bitcentive/models/monthly-contribution.properties 0 properties
 * @group bitcentive/models/monthly-contribution.static 1 static
 */

import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "../os-project";
import Contributor from "../contributor";

const MonthlyContribution = DefineMap.extend( "MonthlyContribution", { seal: false }, {
	/**
	 * @property {Contributor.Ref} bitcentive/models/monthly-contribution.properties.contributorRef contributorRef
	 * @parent bitcentive/models/monthly-contribution.properties
	 * A reference to a [bitcentive/models/contributor].
	 */
  contributorRef: Contributor.Ref,

	/**
	 * @property {OSProject.Ref} bitcentive/models/monthly-contribution.properties.osProjectRef osProjectRef
	 * @parent bitcentive/models/monthly-contribution.properties
	 * A reference to an [bitcentive/models/os-project].
	 */
  osProjectRef: OSProject.Ref,

	/**
	 * @property {String} bitcentive/models/monthly-contribution.properties.description description
	 * @parent bitcentive/models/monthly-contribution.properties
	 * A description of the contribution.
	 */
  description: "string",

	/**
	 * @property {Number} bitcentive/models/monthly-contribution.properties.points points
	 * @parent bitcentive/models/monthly-contribution.properties
	 * A number of points for the contribution.
	 */
  points: "number"
});

/**
 * @constructor {List} bitcentive/models/monthly-contribution.static.List List
 * @parent bitcentive/models/monthly-contribution.static
 * A list of [bitcentive/models/monthly-contribution].
 */
MonthlyContribution.List = DefineList.extend( "MonthlyContributionList",
/** @prototype **/
{
  "#": MonthlyContribution,

	/**
	 * @property {Object} contributorsMap
	 * A map of [bitcentive/models/contributor]s by id.
	 */
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
