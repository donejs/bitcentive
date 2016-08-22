import fixture from 'can-fixture';
import ClientProject from '../client-project';
import clientProjects from './client-projects.json';

var clientProjectStore = fixture.store(clientProjects, ClientProject.algebra);

fixture({
  'GET /api/client_projects': clientProjectStore.getListData,
  'GET /api/client_projects/{_id}': clientProjectStore.getData,
  'POST /api/client_projects': clientProjectStore.createData,
  'PUT /api/client_projects/{_id}': clientProjectStore.updateData,
  'DELETE /api/client_projects/{_id}': clientProjectStore.destroyData
});
