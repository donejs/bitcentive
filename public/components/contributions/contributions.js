import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './contributions.less';
import template from './contributions.stache';
import Contribution from '../../models/contribution';
import ContributionMonth from '../../models/contribution-month';

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
    }
  },

  osProjects: {
    get() {
    }
  },

  toggleAddNewContribution() {
    this.adding = !this.adding;
  },

  addContribution(ev) {
    ev.preventDefault();

    let contribution = new Contribution({
      description: this.description,
      points: this.points,
      osProject: this.selectedOSProjectId,
      contributor: this.selectedContributorId
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