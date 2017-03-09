/**
 * @module {can-map} bitcentive/models/client-project ClientProject
 * @parent bitcentive.clientModels
 *
 * @group bitcentive/models/client-project.properties 0 properties
 * @group bitcentive/models/client-project.static 2 static
 */

import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import set from 'can-set';
import superModel from '../lib/super-model';
import algebra from './algebra';
import feathersClient from './feathers-client';

var ClientProject = DefineMap.extend('ClientProject', { seal: false }, {
	/**
	 * @property {String} bitcentive/models/client-project.properties.id id
	 * @parent bitcentive/models/client-project.properties
	 * Id of a client project.
	 */
  _id: 'string',

	/**
	 * @property {Number} bitcentive/models/client-project.properties.name name
	 * @parent bitcentive/models/client-project.properties
	 * Name of a client project
	 */
  name: 'string'
});

/**
 * @constructor {can-list} bitcentive/models/client-project.static.List ClientProjectList
 * @parent bitcentive/models/client-project.static
 * A list of [bitcentive/models/client-project]
 */
ClientProject.List = DefineList.extend('ClientProjectList', {
  "#": ClientProject
});

/**
 * @property {can-connect} bitcentive/models/client-project.static.connection connection
 * @parent bitcentive/models/client-project.static
 * A `can-connect` connection linked to FeathersJS service `/api/client_projects`.
 */
ClientProject.connection = superModel({
  Map: ClientProject,
  List: ClientProject.List,
  feathersService: feathersClient.service('/api/client_projects'),
  name: "client-projects",
  algebra
});

/**
 * @property {can-set/Algebra} bitcentive/models/client-project.static.algebra algebra
 * @parent bitcentive/models/client-project.static
 * An algebra for the connection. References common [bitcentive/models/algebra]
 */
ClientProject.algebra = algebra;

export default ClientProject;
