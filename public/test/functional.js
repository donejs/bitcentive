import F from 'funcunit';
import QUnit from 'steal-qunit';

F.attach(QUnit);

QUnit.module('bitcentive functional smoke test', {
  beforeEach() {
    F.open('../development.html');
  }
});

QUnit.test('bitcentive main page shows up', function() {
  F('title').text('Bitcentive', 'Title is set');
});
