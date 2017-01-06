import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './page-dashboard.stache';

export const ViewModel = DefineMap.extend({
	contributionMonthId: {
		type: "string",
	}
});

export default Component.extend({
	tag: 'page-dashboard',
	ViewModel: ViewModel,
	view
});
