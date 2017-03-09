/**
 * @module {can-map} bitcentive/models/os-project OSProject
 * @parent bitcentive.clientModels
 *
 * OS project model
 *
 * @group bitcentive/models/os-project.properties 0 properties
 */

import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superModel from '../lib/super-model';
import algebra from './algebra';
import feathersClient from './feathers-client';

var OSProject = DefineMap.extend("OSProject", { seal: false }, {
	/**
	 * @property {String} bitcentive/models/os-project.properties._id _id
	 * @parent bitcentive/models/os-project.properties
	 * Id of the OS project.
	 */
  _id: "string",

	/**
	 * @property {String} bitcentive/models/os-project.properties.name name
	 * @parent bitcentive/models/os-project.properties
	 * The name of the OS project.
	 */
  name: "string"
});

/**
 * @constructor {can-list} bitcentive/models/os-project.static.List List
 * @parent bitcentive/models/os-project.static
 * A list of [bitcentive/models/os-project]
 */
OSProject.List = DefineList.extend("OSProjectList", {
  "#": OSProject
});

/**
 * @property {can-connect} bitcentive/models/os-project.static.connection connection
 * @parent bitcentive/models/os-project.static
 * A `can-connect` connection linked to FeathersJS service `/api/os_projects`.
 */
OSProject.connection = superModel({
  Map: OSProject,
  List: OSProject.List,
  feathersService: feathersClient.service("/api/os_projects"),
  name: "osProject",
  algebra
});

/**
 * @property {can-set/Algebra} bitcentive/models/os-project.static.algebra algebra
 * @parent bitcentive/models/os-project.static
 * An algebra for the connection. References common [bitcentive/models/algebra]
 */
OSProject.algebra = algebra;

export default OSProject;
