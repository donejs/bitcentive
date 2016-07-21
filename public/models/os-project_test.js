import QUnit from 'steal-qunit';
import OsProject from './os-project';

QUnit.module('models/os-project');

QUnit.test('getList', function(){
  stop();
  OsProject.getList().then(function(items) {
    QUnit.equal(items.length, 2);
    QUnit.equal(items.item(0).description, 'First item');
    start();
  });
});
