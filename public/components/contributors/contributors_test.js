import QUnit from 'steal-qunit';
import 'bitcentive/models/fixtures/fixtures-socket';
import { store } from 'bitcentive/models/fixtures/contribution-months.js';
import { ContributorsVM } from './contributors';
import Contributor from 'bitcentive/models/contributor';

QUnit.module('bitcentive/components/contributors/', {
  beforeEach: function(){}
});

QUnit.asyncTest('viewModel.addContributor', function(){
  Contributor.getList({}).then(items => {
    var vm = new ContributorsVM({
      contributors: items,
      newContributorName: 'Ilya',
      newContributorEmail: 'ilya@bitovi.com'
    });
    QUnit.equal(vm.contributors.length, 2, 'should have 2 contributors');
    vm.contributors.on('length', function(){
      QUnit.equal(vm.contributors.length, 3, 'should have 3 contributors after addContributor');
      QUnit.start();
    });
    vm.addContributor();
  });
});
