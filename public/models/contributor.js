/**
 * @module {can-map} bitcentive/models/contributor Contributor
 * @parent bitcentive.clientModels
 *
 * Contributor model
 *
 * @group bitcentive/models/contributor.properties 0 properties
 */

import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import set from "can-set";
import superModel from '../lib/super-model';
import algebra from './algebra';
import feathersClient from './feathers-client';

var Contributor = DefineMap.extend("Contributor", { seal: false }, {
	/**
	 * @property {String} bitcentive/models/contributor.properties._id _id
	 * @parent bitcentive/models/contributor.properties
	 * Id of the contributor.
	 */
  _id: "string",

	/**
	 * @property {String} bitcentive/models/contributor.properties.name name
	 * @parent bitcentive/models/contributor.properties
	 * The name of the contributor.
	 */
  name: "string",

	/**
	 * @property {String} bitcentive/models/contributor.properties.email email
	 * @parent bitcentive/models/contributor.properties
	 * Email of the contributor.
	 */
  email: "string",

	/**
	 * @property {Boolean} bitcentive/models/contributor.properties.active active
	 * @parent bitcentive/models/contributor.properties
	 * Indicates whether the contributor is active.
	 */
  active: "boolean"
});

/**
 * @constructor {can-list} bitcentive/models/contributor.static.List List
 * @parent bitcentive/models/contributor.static
 * A list of [bitcentive/models/contributor]
 */
Contributor.List = DefineList.extend("ContributorList", {
  "#": Contributor
});

/**
 * @property {can-connect} bitcentive/models/contributor.static.connection connection
 * @parent bitcentive/models/contributor.static
 * A `can-connect` connection linked to FeathersJS service `/api/contributors`.
 */
Contributor.connection = superModel({
  Map: Contributor,
  List: Contributor.List,
  feathersService: feathersClient.service("/api/contributors"),
  name: "contributor",
  algebra
});

/**
 * @property {can-set/Algebra} bitcentive/models/contributor.static.algebra algebra
 * @parent bitcentive/models/contributor.static
 * An algebra for the connection. References common [bitcentive/models/algebra]
 */
Contributor.algebra = algebra;

export default Contributor;
