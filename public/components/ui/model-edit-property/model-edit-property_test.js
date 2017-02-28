import QUnit from 'steal-qunit';
import { ViewModel } from './model-edit-property';
import Entity from 'bitcentive/components/ui/model-edit-property/demo-fixture';

// ViewModel unit tests
QUnit.module('bitcentive/components/ui/model-edit-property');

QUnit.test('Has initial property value', function() {
  let name = 'Foo';

  let entity = new Entity({
    name
  });

  let vm = new ViewModel({
    model: entity,
    property: 'name'
  });

  QUnit.equal(vm.propertyValue, name);
});

QUnit.test('Can update and save property', function(assert) {
  let done = assert.async();

  Entity.getList({ }).then(records => {
    let newName = 'Bar';
    let entity = records[0];

    QUnit.notEqual(entity.name, newName);

    let vm = new ViewModel({
      model: entity,
      property: 'name'
    });

    vm.commitValue(newName).then(updatedEntity => {
      QUnit.equal(updatedEntity.name, newName);
      done();
    });
  });
});
