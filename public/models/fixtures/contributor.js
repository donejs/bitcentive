import fixture from 'can-fixture';
//import Contributor from '../contributor';
import { _idAlgebra as algebra } from '../algebra';

var store = fixture.store([{
    _id: "1-JustinMeyer",
    name: "Justin Meyer",
    active: true
  },{
    _id: "2-KyleGifford",
    name: "Kyle Gifford",
    active: false
  }], algebra);


export default function(mockServer){
  mockServer.onFeathersService("api/contributors", store, {id: "_id"});
}
