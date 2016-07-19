import fixture from 'can-fixture';

const store = fixture.store([{
  _id: 0,
  significance: 80,
  commissioned: true
}, {
  _id: 1,
  significance: 10,
  commissioned: true
}]);

fixture({
  'GET /api/os_projects': store.findAll,
  'GET /api/os_projects/{_id}': store.findOne,
  'POST /api/os_projects': store.create,
  'PUT /api/os_projects/{_id}': store.update,
  'DELETE /api/os_projects/{_id}': store.destroy
});

export default store;
