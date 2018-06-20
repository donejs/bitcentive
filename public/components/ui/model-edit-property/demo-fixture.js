import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import superModel from 'can-super-model';
import fixture from 'can-fixture/fixture';

let Entity = DefineMap.extend({
  id: {type: 'number', identity: true},
  name: 'string'
});

Entity.List = DefineList.extend({
  '#': Entity
});


let mockData = fixture.store([{
    id: 1,
    name: 'Project'
  },
  {
    id: 2,
    name: 'Contributor'
  },
  {
    id: 3,
    name: 'View only option',
    viewOnly: true
  }
], Entity);

fixture('/entities/{id}', mockData );



Entity.connection = superModel({
  url: '/entities/{id}',
  Map: Entity,
  List: Entity.List,
  name: 'entity'
});

export default Entity;
