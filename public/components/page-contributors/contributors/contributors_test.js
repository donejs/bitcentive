import QUnit from 'steal-qunit';
import 'bitcentive/models/fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';
import { ContributorsVM } from './contributors';
import Contributor from 'bitcentive/models/contributor';

QUnit.module('bitcentive/components/page-contributors/contributors/', {
  beforeEach: function(){
    // Reset fixture store before every test:
    store.reset();
  }
});

QUnit.test('viewModel.addContributor', function(assert){
  let done = assert.async();
  Contributor.getList({}).then(items => {
    let vm = new ContributorsVM({
      contributors: items,
      newContributorName: 'Ilya',
      newContributorEmail: 'ilya@bitovi.com'
    });
    QUnit.equal(vm.contributors.length, 2, 'should have 2 contributors');
    let handler = function(){
      QUnit.equal(vm.contributors.length, 3, 'should have 3 contributors after addContributor');
      vm.contributors.off('length', handler);
      done();
    };
    vm.contributors.on('length', handler);
    vm.addContributor();
  });
});
