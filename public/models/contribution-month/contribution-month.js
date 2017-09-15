import ClientProject from "../client-project";
import OSProject from "../os-project";
import Contributor from "../contributor";

import set from "can-set";
import memoize from "can-compute-memoize";
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superModel from '../../lib/super-model';
import feathersClient from '../feathers-client';

import moment from "moment";
import MonthlyOSProject from "./monthly-os-project";
import MonthlyClientProject from "./monthly-client-project";
import MonthlyContribution from "./monthly-contribution";
import MonthlyContributor from "./monthly-contributor";

import algebra from '../algebra';

/**
 * Builds a sorting function for sorting by a property on a ref field
 */
const sortByRefField = (refName, fieldName) => {
	return (a, b) => {
		if (!a[refName].value || !b[refName].value) {
			return 0;
		}
		const lowerA = a[refName].value[fieldName].toLowerCase();
		const lowerB = b[refName].value[fieldName].toLowerCase();
		return lowerA < lowerB ? -1 : lowerA > lowerB ? 1 : 0;
	};
};

var ContributionMonth = DefineMap.extend("ContributionMonth", { seal: false }, {
	_id: "string",
	date: "date",
	monthlyOSProjects: {
		Type: MonthlyOSProject.List,
		set: function(monthlyOSProjects){
			monthlyOSProjects.contributionMonth = this;
			return monthlyOSProjects;
		}
	},
	monthlyClientProjects: MonthlyClientProject.List,
	monthlyContributions: MonthlyContribution.List,
	monthlyContributors: MonthlyContributor.List,
	startRate: {
		value: 2,
		set(value) {
			return value == null ? 2 : value;
		}
	},
	endRate: {
		value: 4,
		set(value) {
			return value == null ? 4: value;
		}
	},
	sortedMonthlyOSProjects: {
		get () {
			var sortedList = new this.monthlyOSProjects.constructor();
			sortedList.contributionMonth = this.monthlyOSProjects.contributionMonth;
			sortedList.push.apply(sortedList, this.monthlyOSProjects);
			sortedList.sort( sortByRefField('osProjectRef', 'name') );

			return sortedList;
		}
	},
	sortedMonthlyClientProjects: {
		get () {
			// sort a clone so that an infinite loop doesn't happen
			return this.monthlyClientProjects.slice(0).sort(sortByRefField('clientProjectRef', 'name'));
		}
	},
	sortedMonthlyContributors: {
		get () {
			// sort a clone so that an infinite loop doesn't happen
			return this.monthlyContributors.slice(0).sort(sortByRefField('contributorRef', 'name'));
		}
	},
	totalPayouts: {
	  type: 'number',
	  get: function() {
		let total = 0;

		this.monthlyOSProjects.forEach( osProject => {
			if (osProject.commissioned) {
				const totalAmountForOSProject = this.calculations.osProjects[osProject.osProjectRef._id];
				if (totalAmountForOSProject !== undefined){
					total += totalAmountForOSProject;
				}
			}
		});

		return total;
	  }
	},
	calculations: {
		get: function() {
			var calculations = {
					clientProjects: {},
					totalDollarForAllClientProjects: 0,
					osProjects: {}
			};

			var clientProjectsUsingOSProject = {};
			var monthlyOSProjectMap = {};
			var totalCommissionedSignificance = 0;
			this.monthlyOSProjects.forEach( osProject => {
				monthlyOSProjectMap[osProject.osProjectRef._id] = osProject;
				if(osProject.commissioned) {
					totalCommissionedSignificance += osProject.significance;
				}
			});
			// for each client project, calculate out:
			// - rate (based on how many commissioned projects it uses) = 4 - 2 * (usedCommissionedSignificance / totalCommissionedSignificance)
			// - total = (rate * hours)
			// - totalSignificance - the total significance for this project
			// - osProjectsUsed - a map of the OS projects used
			this.monthlyClientProjects.forEach((monthlyClientProject) => {

				let totalSignificance = 0;
				let usedCommissionedSignificance = 0;
				let commissionedMonthlyOSProjects = [];
				let uncommissionedMonthlyOSProjects = [];

				monthlyClientProject.monthlyClientProjectsOSProjects.forEach( usedOSProjectRef => {
					var monthlyOSProject = monthlyOSProjectMap[usedOSProjectRef._id];
					if(monthlyOSProject) {
						// calculate needed significances
						if(monthlyOSProject.commissioned) {
							usedCommissionedSignificance += monthlyOSProject.significance;
							commissionedMonthlyOSProjects.push(monthlyOSProject);
						} else {
							uncommissionedMonthlyOSProjects.push(monthlyOSProject);
						}
						totalSignificance += monthlyOSProject.significance;

						// for an OS project, make it possible to get the clients using it
						if(!clientProjectsUsingOSProject[usedOSProjectRef._id]) {
							clientProjectsUsingOSProject[usedOSProjectRef._id] = [];
						}
						clientProjectsUsingOSProject[usedOSProjectRef._id].push(monthlyClientProject);
					}
				});

				// Don't divide by 0 if there are no commissioned projects
				if (totalCommissionedSignificance === 0) {
					totalCommissionedSignificance = 1;
				}

				let rate = this.endRate - (this.endRate - this.startRate) * (usedCommissionedSignificance / totalCommissionedSignificance);
				rate = isNaN(rate) ? 0 : rate; //handle the situation where there is not significance
				let totalAmount = parseFloat(Math.round((rate * monthlyClientProject.hours) * 100) / 100);

				calculations.totalDollarForAllClientProjects += totalAmount;

				calculations.clientProjects[monthlyClientProject.clientProjectRef._id] = {
					rate: parseFloat(Math.round(rate * 100) / 100),
					totalAmount,
					totalSignificance,
					commissionedMonthlyOSProjects,
					uncommissionedMonthlyOSProjects
				};

			});

			// once the rates are calculated, calculates for each OS project:
			// - total - for each clientProject using this project, take it's share
			this.monthlyOSProjects.forEach(function(osProject) {

				var clientProjects = clientProjectsUsingOSProject[osProject.osProjectRef._id];
				if(clientProjects) {
					calculations.osProjects[osProject.osProjectRef._id] = clientProjects.reduce(function(prev, monthlyClientProject){
						var clientProjectCalc = calculations.clientProjects[monthlyClientProject.clientProjectRef._id];
						return prev + (clientProjectCalc.totalAmount * osProject.significance / clientProjectCalc.totalSignificance);
					},0);
				} else {
					calculations.osProjects[osProject.osProjectRef._id] = 0;
				}
			});

			return calculations;
		}
	},

	get contributorsMap() {
		let contributorsMap = {};

		this.monthlyContributors.forEach(monthlyContributor => {
			contributorsMap[monthlyContributor.contributorRef._id] = monthlyContributor.contributorRef;
		});

		return contributorsMap;
	},

	// Can add using an osProject or monthlyOSProject
	addNewMonthlyOSProject( project ) {
		let monthlyOSProject;
		if (project instanceof MonthlyOSProject) {
			monthlyOSProject = project;
		}
		else {
			monthlyOSProject = new MonthlyOSProject({
				significance: 0,
				commissioned: false,
				osProjectRef: project.serialize(),
				osProjectID: project._id
			});
		}
		this.monthlyOSProjects.push(monthlyOSProject);
		this.save().catch(err => {
			console.error("Failed saving the contributionMonth obj: ", err);
		});
		return monthlyOSProject;
	},
	removeMonthlyOSProject( monthlyOSProject ) {
		this.monthlyOSProjects.splice(this.monthlyOSProjects.indexOf(monthlyOSProject), 1);
		this.monthlyClientProjects.forEach( clientProject => {
			let index = clientProject.monthlyClientProjectsOSProjects.indexOf(monthlyOSProject.osProjectRef);
			if (index > -1) {
				clientProject.monthlyClientProjectsOSProjects.splice(index, 1);
			}
		});
		this.save().catch(err => {
			console.error("Failed saving the contributionMonth obj: ", err);
		});
	},

	// can add using a contributor or monthlyContributor
	addNewMonthlyContributor( contributor ) {
		let monthlyContributor;
		if (contributor instanceof MonthlyContributor) {
			monthlyContributor = contributor;
		}
		else {
			monthlyContributor = new MonthlyContributor({
				contributorRef: contributor.serialize(),
				contributorID: contributor._id
			});
		}
		this.monthlyContributors.push(monthlyContributor);
		this.save().catch(err => {
			console.error("Failed saving the contributionMonth obj: ", err);
		});
		return monthlyContributor;
	},
	removeMonthlyContributor( monthlyContributor ) {
		this.monthlyContributors.splice(this.monthlyContributors.indexOf(monthlyContributor), 1);
		this.monthlyContributions = this.monthlyContributions.filter( contribution => {
			return contribution.contributorRef._id !== monthlyContributor.contributorRef._id;
		});
		this.save().catch(err => {
			console.error("Failed saving the contributionMonth obj: ", err);
		});
	},

	commissionedMonthlyOSProjectsCountFor: function(monthlyClientProject) {
		if(this.calculations.clientProjects.hasOwnProperty(monthlyClientProject.clientProjectRef._id)) {
			return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].commissionedMonthlyOSProjects.length;
		}
		return 0;
	},
	uncommissionedMonthlyOSProjectsCountFor: function(monthlyClientProject) {
		if(this.calculations.clientProjects.hasOwnProperty(monthlyClientProject.clientProjectRef._id)) {
			return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].uncommissionedMonthlyOSProjects.length;
		}
		return 0;
	},
	removeClientProject: function(clientProject) {
		this.monthlyClientProjects.splice(this.monthlyClientProjects.indexOf(clientProject), 1);
	},
	getRate: function(monthlyClientProject) {

		if(this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id]) {
				return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].rate;
		}
		return 0;

	},
	getTotal: function(monthlyClientProject) {
		if(this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id]) {
				return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].totalAmount;
		}
		return 0;

	},

	addContribution(newContribution) {
		this.monthlyContributions.push(newContribution);
		this.save().then(function() {}, function() {
			console.error("Failed saving the contributionMonth obj: ", arguments);
		});
	},
	removeContribution(contribution) {
		const index = this.monthlyContributions.indexOf(contribution);
		this.monthlyContributions.splice(index, 1);
		this.save().then(function() {}, function() {
			console.error("Failed saving the contributionMonth obj: ", arguments);
		});
	}
});

ContributionMonth.List = DefineList.extend("ContributionMonthList", {
	"#": ContributionMonth,
	osProjectContributionsMap(currentContributionMonth) {
		var osProjectContributionsMap = {};

		this.forEach(contributionMonth => {
			if (moment(contributionMonth.date).isBefore(moment(currentContributionMonth.date).add(1, 'day'))) {
				contributionMonth.monthlyContributions.forEach(monthlyContribution => {
					if (currentContributionMonth.contributorsMap[monthlyContribution.contributorRef._id]) {
						if (!osProjectContributionsMap[monthlyContribution.osProjectRef._id]) {
							osProjectContributionsMap[monthlyContribution.osProjectRef._id] = {
								contributors: {},
								totalPoints: 0
							};
						}

						if (!osProjectContributionsMap[monthlyContribution.osProjectRef._id].contributors[monthlyContribution.contributorRef._id]) {
							osProjectContributionsMap[monthlyContribution.osProjectRef._id].contributors[monthlyContribution.contributorRef._id] = {
								points: 0
							};
						}

						osProjectContributionsMap[monthlyContribution.osProjectRef._id].totalPoints += monthlyContribution.points;
						osProjectContributionsMap[monthlyContribution.osProjectRef._id].contributors[monthlyContribution.contributorRef._id].points += monthlyContribution.points;
					}
				});
			}
		});

		return osProjectContributionsMap;
	},
	getOSProjectPayoutTotal(monthlyOSProject, contributor, contributionMonth) {
		const cachedOSProjectPayouts = memoize(this, 'osProjectsPayout', [contributionMonth], function(contributionMonth){
			const contributorsMap = this.osProjectContributionsMap(contributionMonth);
			const payouts = {};
			for(const projectRef in contributorsMap){
				if(!payouts[projectRef]){
					payouts[projectRef] = {};
				}
				for(const contributorRef in contributorsMap[projectRef].contributors){
					if(!payouts[projectRef][contributorRef]){
						payouts[projectRef][contributorRef] = 0;
					}
					const contributorData = contributorsMap[projectRef].contributors[contributorRef];
					const points = contributorData.points;
					const totalPoints = contributorsMap[projectRef].totalPoints;
					const totalAmountForOSProject = contributionMonth.calculations.osProjects[projectRef];
		
					payouts[projectRef][contributorRef] = (points / totalPoints) * totalAmountForOSProject;
				}
			}
			return payouts;
		});

		const payouts = cachedOSProjectPayouts();
		
		return payouts[monthlyOSProject.osProjectRef._id] && payouts[monthlyOSProject.osProjectRef._id][contributor.contributorRef._id] || 0;
	},
	getTotalForAllPayoutsForContributor(contributorRef, contributionMonth) {
		const cachedTotals = memoize(this, 'totalForAllPayoutsForContributor', [contributionMonth], function(contributionMonth){
			const totals = {};
			const contributorsMap = this.osProjectContributionsMap(contributionMonth);
			for (const osProjectID in contributorsMap) {
				const projectContributors = contributorsMap[osProjectID].contributors;
				for (const contributor in projectContributors) {
					if (totals[contributor] === undefined) {
						totals[contributor] = 0;
					}
	
					const contributorData = projectContributors[contributor];
					const points = contributorData.points;
					const totalPoints = contributorsMap[osProjectID].totalPoints;
					const totalAmountForOSProject = contributionMonth.calculations.osProjects[osProjectID];
	
					// TODO: figure out what to do with `osProjectContributionsMap` if an `OSProject` gets removed from a month:
					// since `osProjectContributionsMap` will still have the removed project whereas `contributionMonth.calculations.osProjects` won't
					// which will cause NaN for total. For now just ignore undefined for calculation:
					if (totalAmountForOSProject !== undefined){
						totals[contributor] = totals[contributor] + ((points / totalPoints) * totalAmountForOSProject);
					}
				}
			}
			return totals;
		});

		return cachedTotals()[contributorRef._id] || 0;
	},
	getOwnershipPercentageForContributor(monthlyOSProject, contributor, contributionMonth) {
		const cachedOwershipPercentages = memoize(this, 'ownershipPercentageForContributor', [contributionMonth], function(contributionMonth){
			const percentages = {};
			
			const contributorsMap = this.osProjectContributionsMap(contributionMonth);

			for(const projectRef in contributorsMap){
				if(!percentages[projectRef]){
					percentages[projectRef] = {};
				}
				for(const contributorRef in contributorsMap[projectRef].contributors){
					if(!percentages[projectRef][contributorRef]){
						percentages[projectRef][contributorRef] = 0;
					}
					const contributorData = contributorsMap[projectRef].contributors[contributorRef];
					const points = contributorData.points;
					const totalPoints = contributorsMap[projectRef].totalPoints;

					percentages[projectRef][contributorRef] = points / totalPoints;
				}
			}
	
			return percentages;
		});

		const percentages = cachedOwershipPercentages();

		return percentages[monthlyOSProject.osProjectRef._id] && percentages[monthlyOSProject.osProjectRef._id][contributor.contributorRef._id] || 0;
	},
	/**
	 * @property getMonthlyPayouts
	 *
	 * Get a map of OS Project payouts per Contributor based on the month passed
	 * and any previous months.
	 *
	 * e.g.
	 * ```
	 * {
	 *	 "5873af58cd85b95c3f6285f5": {
	 *		 "contributorRef": ...,
	 *		 "monthlyOSProjects": [
	 *			 {
	 *				 "osProjectRef": ...,
	 *				 "total": 0
	 *			 },
	 *			 {
	 *				 "osProjectRef": ...,
	 *				 "total": 339.9396969696969
	 *			 },
	 *			 {
	 *				 "osProjectRef": ...,
	 *				 "total": 0
	 *			 }
	 *		 ]
	 *	 }
	 * }
	 * ```
	 *
	 * @param {ContributionMonth} currentMonth
	 * @return {Map}
	 */
	getMonthlyPayouts(currentMonth) {
		let currentMoment = moment(currentMonth.date);
		let contributorProjectPayouts = {};
		let uniqueContributors = {};
		let uniqueProjects = {};

		this.filter(contributionMonth => {
			return currentMoment.isSameOrAfter(contributionMonth.date);
		}).forEach(contributionMonth => {
			Object.assign(uniqueContributors,
				contributionMonth.monthlyContributions.contributorsMap);

			contributionMonth.monthlyOSProjects.forEach(monthlyOSProject => {
				uniqueProjects[monthlyOSProject.osProjectRef._id] = monthlyOSProject;
			});
		});

		Object.keys(uniqueContributors).forEach(contributorId => {
			let contributorPayout =
				Object.assign({ }, uniqueContributors[contributorId]);

			contributorPayout.monthlyOSProjects = {};

			Object.keys(uniqueProjects).forEach(monthlyProjectId => {
				let monthlyOSProject = uniqueProjects[monthlyProjectId];
				let projectId = monthlyOSProject.osProjectRef._id;

				contributorPayout.monthlyOSProjects[projectId] = {
					osProjectRef: monthlyOSProject.osProjectRef,
					total: this.getOSProjectPayoutTotal(
						monthlyOSProject, contributorPayout, currentMonth),
					percent: this.getOwnershipPercentageForContributor(
						monthlyOSProject, contributorPayout, currentMonth)
				};
			});

			contributorProjectPayouts[contributorId] = contributorPayout;
		});

		return contributorProjectPayouts;
	}
});

var dataMassage = function(oType) {
	return function(item) {
		if (typeof item[oType + 'Id'] === 'object') {
			item[oType] = item[oType + 'Id'];
			item[oType + 'Id'] = item[oType]._id;
		}
	};
};

ContributionMonth.connection = superModel({
	Map: ContributionMonth,
	List: ContributionMonth.List,
	feathersService: feathersClient.service("/api/contribution_months"),
	name: "contributionMonth",
	algebra
});

ContributionMonth.algebra = algebra;

export default ContributionMonth;
