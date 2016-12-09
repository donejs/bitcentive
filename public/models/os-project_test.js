import QUnit from 'steal-qunit';
import OsProject from './os-project';
import { store } from './fixtures/os-project';

QUnit.module('models/os-project');

QUnit.test('getList', function(){
  QUnit.stop();
  store.reset();
  OsProject.getList().then(function(items) {
    QUnit.equal(items.length, 3);
    QUnit.equal(items.item(0).name, 'CanJS');
    QUnit.start();
  });
});
