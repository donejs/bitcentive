import moment from 'moment';
import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './select-contribution-month.stache';
import ContributionMonth from 'bitcentive/models/contribution-month/';

export const ViewModel = DefineMap.extend({

    // Stateful properties
	isAdmin: {
		type: 'boolean',
		default: true
	},
    contributionMonthsPromise: {
		default () {
			return ContributionMonth.getList({
				$sort: {
					date: 1
				}
			});
		}
	},

    // stateful and derived properties
	selectedContributionMonthId: {
        value({resolve, listenTo,lastSet}){
            listenTo("lastMonth", function(ev, lastMonth) {
                if (this.lastMonth) {
        			resolve( this.lastMonth._id);
        		}
            });
            listenTo(lastSet, resolve);
        }
    },

    // Derived properties
	contributionMonths: {
		get: function(initial, resolve) {
			this.contributionMonthsPromise.then(resolve);
		}
	},
	get lastMonth() {
		if (this.contributionMonths && this.contributionMonths.length) {
			return this.contributionMonths[this.contributionMonths.length - 1];
		} else {
			return new ContributionMonth({
				monthlyClientProjects: [],
				monthlyOSProjects: [],
				monthlyContributions: [],
				date: moment.utc().add(-1, 'months').startOf('month').toDate()
			});
		}
	},
	get nextMonth() {
		return moment.utc(this.lastMonth.date).add(1, 'months').startOf('month').toDate();
	},

    // side effects
	connectedCallback() {
		// side effectually listen to when selectedContributionMonthId is set to `null` or is null
		// after we have the contribution months
		this.listenTo("contributionMonths", (ev, contributionMonths) => {
			this.stopListening("selectedContributionMonthId")
			this.listenTo("selectedContributionMonthId", (ev, selectedContributionMonthId) => {
				if (selectedContributionMonthId == null) {
					var last = this.lastMonth.serialize();
					last.date = this.nextMonth;
					last.monthlyContributions = [];
					delete last._id;
					new ContributionMonth(last).save();
				}
			});

			if (this.selectedContributionMonthId == null) {
				// Creating a contribution for this month.
				new ContributionMonth({
					monthlyClientProjects: [],
					monthlyOSProjects: [],
					monthlyContributions: [],
					date: moment.utc().add(-1, 'months').startOf('month').toDate()
				}).save();
			}
		});
	}
});

export default Component.extend({
	tag: 'bit-select-contribution-month',
	ViewModel: ViewModel,
	view
});
