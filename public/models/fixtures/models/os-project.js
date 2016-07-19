import fixture from 'can-fixture';

const store = fixture.store([{
  _id: 0,
  description: 'First item'
}, {
  _id: 1,
  description: 'Second item'
}]);

fixture({
  'GET /api/os-projects': store.findAll,
  'GET /api/os-projects/{_id}': store.findOne,
  'POST /api/os-projects': store.create,
  'PUT /api/os-projects/{_id}': store.update,
  'DELETE /api/os-projects/{_id}': store.destroy
});

export default store;
