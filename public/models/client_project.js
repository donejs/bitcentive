import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superMap from 'can-connect/can/super-map/';
import set from 'can-set';
import fixture from 'can-fixture';

var clientProjectAlgebra = new set.Algebra(
  set.comparators.id('_id')
);

var clientProjectStore = fixture.store([
  { _id: "1", name: "Levi's" },
  { _id: "2", name: "Wal-Mart" },
  { _id: "3", name: "Lowe's" },
  { _id: "4", name: "Apple" },
  { _id: "5", name: "Microsoft" }
], clientProjectAlgebra);

//fixture("/api/client_projects/{_id}", clientProjectStore);

fixture({
  'GET /api/client_projects': clientProjectStore.getListData,
  'GET /api/client_projects{_id}': clientProjectStore.getData,
  'POST /api/client_projects': clientProjectStore.createData,
  'PUT /api/client_projects/{_id}': clientProjectStore.updateData,
  'DELETE /api/client_projects/{_id}': clientProjectStore.destroyData
});

var ClientProject = DefineMap.extend({
  _id: 'string',
  name: 'string'
});

ClientProject.List = DefineList.extend({
  "*": ClientProject
});

ClientProject.connection = superMap({
  Map: ClientProject,
  List: ClientProject.List,
  url: '/api/client_projects',
  name: "client-projects",
  algebra: clientProjectAlgebra,
  idProp: "_id"
});

ClientProject.algebra = clientProjectAlgebra;

export default ClientProject;