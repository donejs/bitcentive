import Component from 'can-component';
import DefineMap from 'can-define/map/';
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
  isSaving: {
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
    if(ev) {
      ev.preventDefault();
    }
    let error = this.hasErrors();
    if (error){
      this.newContributorError = error;
      return;
    }
    this.isSaving = true;
    return new Contributor({
      name: this.newContributorName,
      email: this.newContributorEmail,
      active: this.newContributorActive
    }).save().then(() => {
      this.resetNewContributorFields();
      this.isSaving = false;
    }, (e) => {
      this.newContributorError = e.message;
      this.isSaving = false;
    });
  },
  hasErrors(){
    return this.newContributorName === '' && 'Name cannot be empty'
      || this.newContributorEmail === '' && 'Email cannot be empty';
  }
});

export default Component.extend({
  tag: 'bit-contributors',
  view,
  ViewModel: ContributorsVM
});
