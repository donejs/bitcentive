import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './contributions.less';
import template from './contributions.stache';
import MonthlyContribution from '../../models/monthly-contributions';
import ContributionMonth from '../../models/contribution-month';
import Contributors from '../../models/contributor';

export const ViewModel = DefineMap.extend({
  // Passed properties
  contributionMonth: {
    Type: ContributionMonth
  },

  // Stateful properties
  selectedContributorId: 'string',
  selectedOSProjectId: 'string',
  description: 'string',
  points: 'string',

  adding: {
    type: 'boolean',
    value: false
  },

  activeContributors: {
    get() {
      return Contributors.getList({
        active: true
      });
    }
  },

  toggleAddNewContribution() {
    this.adding = !this.adding;
  },

  addContribution(ev) {
    ev.preventDefault();

    let contribution = new MonthlyContribution({
      description: this.description,
      points: this.points,
      osProjectRef: this.selectedOSProjectId,
      //contributorRef: this.selectedContributorId
    });

    this.contributionMonth.addContribution(contribution);
    this.reset();
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
  template
});
