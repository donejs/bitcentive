import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './page-contributors.less';
import view from './page-contributors.stache';
import Contributor from 'bitcentive/models/contributor';

export const ViewModel = DefineMap.extend({
	contributors: {
		Type: Contributor.List,
		get() {
			return Contributor.getList({});
		}
	},
});

export default Component.extend({
	tag: 'page-contributors',
	ViewModel: ViewModel,
	view
});
