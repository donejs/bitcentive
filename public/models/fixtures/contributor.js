import fixture from 'can-fixture';
import Contributor from '../contributor';

var contributorStore = fixture.store([{
    _id: "1-JustinMeyer",
    name: "Justin Meyer",
    active: true
  },{
    _id: "2-KyleGifford",
    name: "Kyle Gifford",
    active: false
  }], Contributor.algebra);

fixture({
  'GET /api/contributors': contributorStore.getListData,
  'GET /api/contributors/{_id}': contributorStore.getData,
  'POST /api/contributors': contributorStore.createData,
  'PUT /api/contributors/{_id}': contributorStore.updateData,
  'DELETE /api/contributors/{_id}': contributorStore.destroyData
});
