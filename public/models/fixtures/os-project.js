import fixture from 'can-fixture';
import OSProject from '../os-project';
import osProjects from './os-projects.json';

var osProjectStore = fixture.store(osProjects, OSProject.algebra);

fixture({
  'GET /api/os_projects': osProjectStore.getListData,
  'GET /api/os_projects/{_id}': osProjectStore.getData,
  'POST /api/os_projects': osProjectStore.createData,
  'PUT /api/os_projects/{_id}': osProjectStore.updateData,
  'DELETE /api/os_projects/{_id}': osProjectStore.destroyData
});
