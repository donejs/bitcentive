import fixture from 'can-fixture';
import ClientProject from '../client-project';

var clientProjectStore = fixture.store([
  { _id: "1", name: "Levi's" },
  { _id: "2", name: "Wal-Mart" },
  { _id: "3", name: "Lowe's" },
  { _id: "4", name: "Apple" },
  { _id: "5", name: "Microsoft" }
], ClientProject.algebra);

fixture({
  'GET /api/client_projects': clientProjectStore.getListData,
  'GET /api/client_projects{_id}': clientProjectStore.getData,
  'POST /api/client_projects': clientProjectStore.createData,
  'PUT /api/client_projects/{_id}': clientProjectStore.updateData,
  'DELETE /api/client_projects/{_id}': clientProjectStore.destroyData
});