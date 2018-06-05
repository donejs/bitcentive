import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './contributions.stache';
import MonthlyContribution from '~/models/contribution-month/monthly-contribution';
import ContributionMonth from '~/models/contribution-month/';
import Contributor from '~/models/contributor';
import OSProject from '~/models/os-project';

export const ViewModel = DefineMap.extend({
  // Passed properties
  contributionMonth: ContributionMonth,

  // Stateful properties
  selectedContributorId: 'string',
  selectedOSProjectId: 'string',
  description: 'string',
  points: 'string',

  adding: {
    type: 'boolean',
    default: false
  },

  osProjects: {
    get() {
      return OSProject.getList({});
    }
  },

  toggleAddNewContribution(ev) {
    ev.preventDefault();
    this.adding = !this.adding;
  },

  addContribution(ev) {
    ev && ev.preventDefault();

    let contribution = new MonthlyContribution({
      description: this.description,
      points: this.points,
      osProjectRef: this.selectedOSProjectId,
      contributorRef: this.selectedContributorId
    });

    this.contributionMonth.addContribution(contribution);
    this.reset();
  },

  removeContribution(ev, contribution) {
    this.contributionMonth.removeContribution(contribution);
  },

  reset() {
    this.adding = false;
    this.description = null;
    this.points = null;
  }
});

export default Component.extend({
  tag: 'bit-contributions',
  ViewModel,
  view
});
