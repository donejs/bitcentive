import fixture from 'can-fixture';

const store = fixture.store([{
  _id: 0,
  date: new Date(),
  clientProjects: {},
  osProjects: {},
  contributions: {}
}, {
  _id: 1,
  date: new Date(),
  clientProjects: {},
  osProjects: {},
  contributions: {}
}]);

fixture({
  'GET /api/contribution_months': store.findAll,
  'GET /api/contribution_months/{_id}': store.findOne,
  'POST /api/contribution_months': store.create,
  'PUT /api/contribution_months/{_id}': store.update,
  'DELETE /api/contribution_months/{_id}': store.destroy
});

export default store;
