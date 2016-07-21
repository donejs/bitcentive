import fixture from 'can-fixture';
import ClientProject from '../client-project';

var clientProjectStore = fixture.store([
  { _id: "1-Levis", name: "Levi's" },
  { _id: "2-Walmart", name: "Wal-Mart" },
  { _id: "3-Haulhound", name: "HaulHound" },
  { _id: "4-Lowes", name: "Lowe's" },
  { _id: "5-Apple", name: "Apple" },
  { _id: "6-Microsoft", name: "Microsoft" }
], ClientProject.algebra);

fixture({
  'GET /api/client_projects': clientProjectStore.getListData,
  'GET /api/client_projects/{_id}': clientProjectStore.getData,
  'POST /api/client_projects': clientProjectStore.createData,
  'PUT /api/client_projects/{_id}': clientProjectStore.updateData,
  'DELETE /api/client_projects/{_id}': clientProjectStore.destroyData
});

