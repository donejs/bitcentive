import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superModel from 'can-connect/can/super-map/';
import fixture from 'can-fixture/fixture';

let mockData = fixture.store([
  {
    id: 1,
    name: 'Project'
  },
  {
    id: 2,
    name: 'Contributor'
  }
]);

fixture({
  'GET /entities': mockData.getListData,
  'GET /entities/{id}': mockData.getData,
  'POST /entities': mockData.createData,
  'PUT /entities/{id}': mockData.updateData,
  'DELETE /entities/{id}': mockData.destroyData
});

let Entity = DefineMap.extend({
  id: 'number',
  name: 'string'
});

Entity.List = DefineList.extend({
  '#': Entity
});

Entity.connection = superModel({
  url: {
    getListData: 'GET /entities',
    getData: 'GET /entities/{id}',
    createData: 'POST /entities',
    updateData: 'PUT /entities/{id}',
    destroyData: 'DELETE /entities/{id}'
  },
  Map: Entity,
  List: Entity.List,
  name: 'entity'
});

export default Entity;
