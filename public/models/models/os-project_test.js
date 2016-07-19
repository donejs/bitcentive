import QUnit from 'steal-qunit';
import ModelsOsProject from './models/os-project';

QUnit.module('models/models/os-project');

QUnit.test('getList', function(){
  stop();
  ModelsOsProject.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
