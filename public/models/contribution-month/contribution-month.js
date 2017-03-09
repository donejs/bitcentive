/**
 * @module {can-map} bitcentive/models/contribution-month ContributionMonth
 * @parent bitcentive.clientModels
 *
 * Contribution month model
 *
 * @group bitcentive/models/contribution-month.properties 0 properties
 * @group bitcentive/models/contribution-month.prototype 1 prototype
 * @group bitcentive/models/contribution-month.static 2 static
 */

import ClientProject from "../client-project";
import OSProject from "../os-project";
import Contributor from "../contributor";

import set from "can-set";
import DefineMap from "can-define/map/";
import DefineList from "can-define/list/";
import superModel from '../../lib/super-model';
import feathersClient from '../feathers-client';

import moment from "moment";
import MonthlyOSProject from "./monthly-os-project";
import MonthlyClientProject from "./monthly-client-project";
import MonthlyContribution from "./monthly-contribution";

import algebra from '../algebra';

/*
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
	/**
	 * @property {String} bitcentive/models/contribution-month.properties.id id
	 * @parent bitcentive/models/contribution-month.properties
	 * Id of a contribution month.
	 */
	_id: "string",

	/**
	 * @property {Date} bitcentive/models/contribution-month.properties.date date
	 * @parent bitcentive/models/contribution-month.properties
	 * Date of a contribution month.
	 */
	date: "date",

	/**
	 * @property {bitcentive/models/monthly-os-project} bitcentive/models/contribution-month.properties.monthly-os-projects monthlyOSProjects
	 * @parent bitcentive/models/contribution-month.properties
	 * A list of [bitcentive/models/monthly-os-project] items.
	 */
	monthlyOSProjects: {
		Type: MonthlyOSProject.List,
		set: function(monthlyOSProjects){
			monthlyOSProjects.contributionMonth = this;
			return monthlyOSProjects;
		}
	},

	/**
	 * @property {bitcentive/models/monthly-os-project} bitcentive/models/contribution-month.properties.monthly-client-projects monthlyClientProjects
	 * @parent bitcentive/models/contribution-month.properties
	 * A list of [bitcentive/models/monthly-client-project] items.
	 */
	monthlyClientProjects: MonthlyClientProject.List,

	/**
	 * @property {bitcentive/models/monthly-contribution} bitcentive/models/contribution-month.properties.monthly-contributions monthlyContributions
	 * @parent bitcentive/models/contribution-month.properties
	 * A list of [bitcentive/models/monthly-contributions] items.
	 */
	monthlyContributions: MonthlyContribution.List,

	/**
	 * @property {Number} bitcentive/models/contribution-month.properties.start-rate startRate
	 * @parent bitcentive/models/contribution-month.properties
	 * The starting value for the rate. The hourly tax is based on it.
	 */
	startRate: {
		value: 2,
		set(value) {
			return value == null ? 2 : value;
		}
	},

	/**
	 * @property {Number} bitcentive/models/contribution-month.properties.end-rate endRate
	 * @parent bitcentive/models/contribution-month.properties
	 * The ending value for the rate. The hourly tax is based on it.
	 */
	endRate: {
		value: 4,
		set(value) {
			return value == null ? 4: value;
		}
	},

	/**
	 * @property {bitcentive/models/monthly-os-project} bitcentive/models/contribution-month.properties.sorted-monthly-os-projects sortedMonthlyOSProjects
	 * @parent bitcentive/models/contribution-month.properties
	 * A sorted list of [bitcentive/models/monthly-os-project] items. By OS project name.
	 */
	sortedMonthlyOSProjects: {
		get () {
			var sortedList = new this.monthlyOSProjects.constructor();
			sortedList.contributionMonth = this.monthlyOSProjects.contributionMonth;
			sortedList.push.apply(sortedList, this.monthlyOSProjects);
			sortedList.sort( sortByRefField('osProjectRef', 'name') );

			return sortedList;
		}
	},

	/**
	 * @property {bitcentive/models/monthly-client-project} bitcentive/models/contribution-month.properties.sorted-monthly-client-projects sortedMonthlyClientProjects
	 * @parent bitcentive/models/contribution-month.properties
	 * A sorted list of [bitcentive/models/monthly-client-project] items. By client project name.
	 */
	sortedMonthlyClientProjects: {
		get () {
			// sort a clone so that an infinite loop doesn't happen
			return this.monthlyClientProjects.slice(0).sort(sortByRefField('clientProjectRef', 'name'));
		}
	},

	/**
	 * @property {Object} bitcentive/models/contribution-month.properties.calculations calculations
	 * @parent bitcentive/models/contribution-month.properties
	 * The calculations
	 *
	 * For each client project, calculate out:
	 * - rate (based on how many commissioned projects it uses) = 4 - 2 * (usedCommissionedSignificance / totalCommissionedSignificance)
	 * - total = (rate * hours)
	 * - totalSignificance - the total significance for this project
	 * - osProjectsUsed - a map of the OS projects used
	 */
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

	/**
	 * @function bitcentive/models/contribution-month.prototype.addNewMonthlyOSProject addNewMonthlyOSProject
	 * @parent bitcentive/models/contribution-month.prototype
	 * Adds the given project (osProject or monthlyOSProject) to the month.
	 *
	 * @signature `contributionMonth.addNewMonthlyOSProject( project )`
	 *
	 * @param {bitcentive/models/os-project | bitcentive/models/monthly-os-project} project A project
	 */
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

	/**
	 * @function bitcentive/models/contribution-month.prototype.removeMonthlyOSProject removeMonthlyOSProject
	 * @parent bitcentive/models/contribution-month.prototype
	 * Removes the given OS project from the month.
	 *
	 * @signature `contributionMonth.removeMonthlyOSProject( monthlyOSProject )`
	 *
	 * @param {bitcentive/models/monthly-os-project} project An OS project
	 */
	removeMonthlyOSProject( monthlyOSProject ) {
		this.monthlyOSProjects.splice(this.monthlyOSProjects.indexOf(monthlyOSProject), 1);
		this.monthlyClientProjects.forEach( clientProject => {
			clientProject.monthlyClientProjectsOSProjects.splice(clientProject.monthlyClientProjectsOSProjects.indexOf(monthlyOSProject.osProjectRef), 1);
		});
		this.save().catch(err => {
			console.error("Failed saving the contributionMonth obj: ", err);
		});
	},

	/**
	 * @function bitcentive/models/contribution-month.prototype.countCommissionedProjects countCommissionedProjects
	 * @parent bitcentive/models/contribution-month.prototype
	 * Counts commissioned monthly OS projects for the given client project.
	 *
	 * @signature `contributionMonth.countCommissionedProjects( monthlyClientProject )`
	 *
	 * @param {bitcentive/models/monthly-client-project} monthlyClientProject A client project
	 */
	countCommissionedProjects: function(monthlyClientProject) {
		if(this.calculations.clientProjects.hasOwnProperty(monthlyClientProject.clientProjectRef._id)) {
			return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].commissionedMonthlyOSProjects.length;
		}
		return 0;
	},

	/**
	 * @function bitcentive/models/contribution-month.prototype.countUncommissionedProjects countUncommissionedProjects
	 * @parent bitcentive/models/contribution-month.prototype
	 * Counts commissioned monthly OS projects for the given client project.
	 *
	 * @signature `contributionMonth.countUncommissionedProjects( monthlyClientProject )`
	 *
	 * @param {bitcentive/models/monthly-client-project} monthlyClientProject A client project
	 */
	countUncommissionedProjects: function(monthlyClientProject) {
		if(this.calculations.clientProjects.hasOwnProperty(monthlyClientProject.clientProjectRef._id)) {
			return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].uncommissionedMonthlyOSProjects.length;
		}
		return 0;
	},

	/**
	 * @function bitcentive/models/contribution-month.prototype.removeClientProject removeClientProject
	 * @parent bitcentive/models/contribution-month.prototype
	 * Removes the given client project from the month.
	 *
	 * @signature `contributionMonth.removeClientProject( clientProject )`
	 *
	 * @param {bitcentive/models/monthly-client-project} clientProject A client project
	 */
	removeClientProject: function(clientProject) {
		this.monthlyClientProjects.splice(this.monthlyClientProjects.indexOf(clientProject), 1);
	},

	/**
	 * @function bitcentive/models/contribution-month.prototype.getRate getRate
	 * @parent bitcentive/models/contribution-month.prototype
	 * Returns the rate for the given client project.
	 *
	 * @signature `contributionMonth.getRate( monthlyClientProject )`
	 *
	 * @param {bitcentive/models/monthly-client-project} monthlyClientProject A client project
	 */
	getRate: function(monthlyClientProject) {

		if(this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id]) {
				return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].rate;
		}
		return 0;

	},

	/**
	 * @function bitcentive/models/contribution-month.prototype.getTotal getTotal
	 * @parent bitcentive/models/contribution-month.prototype
	 * Returns the total amount for the given client project.
	 *
	 * @signature `contributionMonth.getTotal( monthlyClientProject )`
	 *
	 * @param {bitcentive/models/monthly-client-project} monthlyClientProject A client project
	 */
	getTotal: function(monthlyClientProject) {
		if(this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id]) {
				return this.calculations.clientProjects[monthlyClientProject.clientProjectRef._id].totalAmount;
		}
		return 0;

	},

	/**
	 * @function bitcentive/models/contribution-month.prototype.addContribution addContribution
	 * @parent bitcentive/models/contribution-month.prototype
	 * Adds a new contribution to the month.
	 *
	 * @signature `contributionMonth.addContribution( contribution )`
	 *
	 * @param {bitcentive/models/contribution} contribution A new contribution
	 */
	addContribution(newContribution) {
		this.monthlyContributions.push(newContribution);
		this.save().then(function() {}, function() {
			console.error("Failed saving the contributionMonth obj: ", arguments);
		});
	},

	/**
	 * @function bitcentive/models/contribution-month.prototype.removeContribution removeContribution
	 * @parent bitcentive/models/contribution-month.prototype
	 * Removes the given contribution from the month.
	 *
	 * @signature `contributionMonth.removeContribution( contribution )`
	 *
	 * @param {bitcentive/models/contribution} contribution A contribution
	 */
	removeContribution(contribution) {
		const index = this.monthlyContributions.indexOf(contribution);
		this.monthlyContributions.splice(index, 1);
		this.save().then(function() {}, function() {
			console.error("Failed saving the contributionMonth obj: ", arguments);
		});
	}
});

/**
 * @constructor {List} bitcentive/models/contribution-month.static.List List
 * @parent bitcentive/models/contribution-month.static
 * A list of [bitcentive/models/contribution-month].
 */
ContributionMonth.List = DefineList.extend("ContributionMonthList",
/** @prototype */
{
	"#": ContributionMonth,

	/**
	 * @function OSProjectContributionsMap
	 *
	 * Returns a map of contributors and total points by OS project id.
	 *
	 * @signature `ContributionMonthList.OSProjectContributionsMap( contributionMonth )`
	 *
	 * @param {bitcentive/models/contribution-month} currentContributionMonth
	 *
	 * @return {Object} A map of contributors and total points by OS project id
	 */
	OSProjectContributionsMap(currentContributionMonth) {
		var OSProjectContributionsMap = {};
		this.forEach(contributionMonth => {
			if(moment(contributionMonth.date).isBefore(moment(currentContributionMonth.date).add(1, 'day'))) {
				var monthlyContributions = contributionMonth.monthlyContributions;
				monthlyContributions && monthlyContributions.length && monthlyContributions.forEach( monthlyContribution => {
					if( ! OSProjectContributionsMap[monthlyContribution.osProjectRef._id] ) {
						OSProjectContributionsMap[monthlyContribution.osProjectRef._id] = {
							contributors: {},
							totalPoints: 0
						};
					}

					if(! OSProjectContributionsMap[monthlyContribution.osProjectRef._id].contributors[monthlyContribution.contributorRef._id] ) {
						OSProjectContributionsMap[monthlyContribution.osProjectRef._id].contributors[monthlyContribution.contributorRef._id] = {
							points: monthlyContribution.points
						};
					}
					else {
						OSProjectContributionsMap[monthlyContribution.osProjectRef._id].contributors[monthlyContribution.contributorRef._id].points = OSProjectContributionsMap[monthlyContribution.osProjectRef._id].contributors[monthlyContribution.contributorRef._id].points + monthlyContribution.points;
					}

					OSProjectContributionsMap[monthlyContribution.osProjectRef._id].totalPoints = OSProjectContributionsMap[monthlyContribution.osProjectRef._id].totalPoints + monthlyContribution.points;

				});
			}
		});

		return OSProjectContributionsMap;
	},

	/**
	 * @function getOSProjectPayoutTotal
	 *
	 * Returns a total amount for the payout.
	 *
	 * @signature `ContributionMonthList.getOSProjectPayoutTotal( monthlyOSProject, contributor, contributionMonth )`
	 *
	 * @param {bitcentive/models/monthly-os-project} monthlyOSProject
	 * @param {bitcentive/models/contributor} contributor
	 * @param {bitcentive/models/contribution-month} contributionMonth
	 *
	 * @return {Number} A total amount for the payout
	 */
	getOSProjectPayoutTotal(monthlyOSProject, contributor, contributionMonth) {
		let total = 0;

		const contributorsMap = this.OSProjectContributionsMap(contributionMonth);

		if(contributorsMap[monthlyOSProject.osProjectRef._id] && contributorsMap[monthlyOSProject.osProjectRef._id].contributors[contributor.contributorRef._id] ) {
			const contributorData = contributorsMap[monthlyOSProject.osProjectRef._id].contributors[contributor.contributorRef._id];
			const points = contributorData.points;
			const totalPoints = contributorsMap[monthlyOSProject.osProjectRef._id].totalPoints;
			const totalAmountForOSProject = contributionMonth.calculations.osProjects[monthlyOSProject.osProjectRef._id];

			total = (points / totalPoints) * totalAmountForOSProject;
		}

		return total;
	},

	/**
	 * @function getTotalForAllPayoutsForContributor
	 *
	 * Returns a total amount for the payout.
	 *
	 * @signature `ContributionMonthList.getOSProjectPayoutTotal( contributorRef, contributionMonth )`
	 *
	 * @param {bitcentive/models/contributor .Ref} contributorRef A reference to a contributor
	 * @param {bitcentive/models/contribution-month} contributionMonth
	 *
	 * @return {Number} A total amount for the payout
	 */
	getTotalForAllPayoutsForContributor(contributorRef, contributionMonth) {
		let total = 0;

		const contributorsMap = this.OSProjectContributionsMap(contributionMonth);
		for (const osProjectID in contributorsMap) {
			const projectContributors = contributorsMap[osProjectID].contributors;

			if(projectContributors[contributorRef._id]) {
				const contributorData = contributorsMap[osProjectID].contributors[contributorRef._id];
				const points = contributorData.points;
				const totalPoints = contributorsMap[osProjectID].totalPoints;
				const totalAmountForOSProject = contributionMonth.calculations.osProjects[osProjectID];

				// TODO: figure out what to do with `OSProjectContributionsMap` if an `OSProject` gets removed from a month:
				// since `OSProjectContributionsMap` will still have the removed project whereas `contributionMonth.calculations.osProjects` won't
				// which will cause NaN for total. For now just ignore undefined for calculation:
				if (totalAmountForOSProject !== undefined){
					total = total + ( (points / totalPoints) * totalAmountForOSProject );
				}
			}
		}

		return total;
	},

	/**
	 * @function getMonthlyPayouts
	 *
	 * Get a map of OS Project payouts per Contributor based on the month passed
	 * and any previous months.
	 *
	 * @param {bitcentive/models/contribution-month} currentMonth
	 * @return {Object} A map of payouts by [bitcentive/models/contributor] id.
	 *
	 * @body
	 *
	 * ## Example
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
				uniqueProjects[monthlyOSProject._id] = monthlyOSProject;
			});
		});

		Object.keys(uniqueContributors).forEach(contributorId => {
			let contributorPayout =
				Object.assign({ }, uniqueContributors[contributorId]);

			contributorPayout.monthlyOSProjects = [];

			Object.keys(uniqueProjects).forEach(projectId => {
				let monthlyOSProject = uniqueProjects[projectId];

				contributorPayout.monthlyOSProjects.push({
					osProjectRef: monthlyOSProject.osProjectRef,
					total: this.getOSProjectPayoutTotal(monthlyOSProject,
						contributorPayout, currentMonth)
				});
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

/**
 * @constructor {can-connection} bitcentive/models/contribution-month.static.connection connection
 * @parent bitcentive/models/contribution-month.static
 * A `can-connect` connection linked to FeathersJS service `/api/contribution_months`.
 */
ContributionMonth.connection = superModel({
	Map: ContributionMonth,
	List: ContributionMonth.List,
	feathersService: feathersClient.service("/api/contribution_months"),
	name: "contributionMonth",
	algebra
});

/**
 * @property {can-set/Algebra} bitcentive/models/contribution-month.static.algebra algebra
 * @parent bitcentive/models/contribution-month.static
 * An algebra for the connection. References common [bitcentive/models/algebra]
 */
ContributionMonth.algebra = algebra;

export default ContributionMonth;
