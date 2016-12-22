import QUnit from 'steal-qunit';
import { ViewModel } from './page-home';

// ViewModel unit tests
QUnit.module('bitcentive/components/page-home');

QUnit.test('viewModel attributes', function(){
	var vm = new ViewModel();
	QUnit.ok(vm.openLoginPopup, 'The viewModel has a openLoginPopup method.');
});
