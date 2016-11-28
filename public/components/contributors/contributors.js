import Component from 'can-component';
import DefineMap from 'can-define/map/';
import './contributors.less';
import view from './contributors.stache';
import Contributor from 'bitcentive/models/contributor';
import $ from 'jquery';

export const ContributorsVM = DefineMap.extend({
  // Passed properties
  contributors: {
    Type: Contributor.List
  },
  isAddingContributor: {
    type: "boolean",
    value: false
  },
  newContributorName: {
    type: "string",
    value: "",
  },
  newContributorEmail: {
    type: "string",
    value: "",
  },
  newContributorActive: {
    type: "boolean",
    value: true,
  },
  newContributorError: {
    type: "string",
    value: "",
  },
  // Methods
  resetNewContributorFields() {
    this.newContributorError = '';
    this.newContributorName = '';
    this.newContributorEmail = '';
    this.newContributorActive = true;
  },
  toggleContributorInput() {
    this.resetNewContributorFields();
    this.isAddingContributor = !this.isAddingContributor;
  },
  setActive(contributor, state) {
    contributor.active = state;
    contributor.save();
  },
  addContributor(ev) {
    if(event) {
      event.preventDefault();
    }
    const inputs = $(ev.target).find(":input");
    inputs.prop("disabled", true);
    return new Contributor({
      name: this.newContributorName,
      email: this.newContributorEmail,
      active: this.newContributorActive,
    }).save().then(() => {
      this.resetNewContributorFields();
      inputs.prop("disabled", false);
    }, (e) => {
      console.log('error:', e);
      this.newContributorError = e.message;
      inputs.prop("disabled", false);
    });
  }
});

export default Component.extend({
  tag: 'bit-contributors',
  view,
  ViewModel: ContributorsVM
});
