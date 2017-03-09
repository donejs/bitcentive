/**
 * @module {can-map} bitcentive/models/contribution-month/monthly-client-projects-os-project-list MonthlyClientProjectOsProjectList
 * @parent bitcentive.clientModels
 */

import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import OSProject from "../os-project";
import ClientProject from "../client-project";

const MonthlyClientProjectOsProjectList = DefineList.extend("MonthlyClientProjectOsProjectList",
/** @prototype */
{
  "#": OSProject.Ref,
	/**
	 * @property {Object} osProjectIdMap
	 * A map of [bitcentive/models/os-project] refs by id
	 */
  get osProjectIdMap() {
    const map = {};
    this.forEach( osProjectRef => {
      map[osProjectRef._id] = osProjectRef;
    });
    return map;
  },

	/**
	 * @function has
	 *
	 * Indicates whether the given project is in the list.
	 *
	 * @param {bitcentive/models/os-project} monthlyOsProject
	 * @return {Boolean} True if the project is in the list
	 */
  has( monthlyOsProject ){
    return monthlyOsProject.osProjectRef._id in this.osProjectIdMap;
  },

	/**
	 * @function toggleProject
	 *
	 * Toggles the given [bitcentive/models/os-project] to/from the list.
	 *
	 * @param {bitcentive/models/os-project} monthlyOsProject
 	 */
  toggleProject( monthlyOSProject ){
    const osProjectRef = this.osProjectIdMap[monthlyOSProject.osProjectRef._id];
    if( osProjectRef ) {
      this.splice( this.indexOf(osProjectRef), 1);
    } else {
      this.push( monthlyOSProject.osProjectRef );
    }
  },
});

export default MonthlyClientProjectOsProjectList;
