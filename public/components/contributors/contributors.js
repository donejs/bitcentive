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
  // Methods
  toggleContributorInput() {
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
    let values = $(ev.target);
    // console.log(values.find("input[name='name']"));
    // console.log(values.find("[name='name']").val(), !!values.find("[name='active']").is('checked'));
    // return new Contributor({
    //   name: values.find('[name="name"]').val(),
    //   active: !!values.find('[name="active"').is('checked')
    // });
  }
});

export default Component.extend({
  tag: 'bit-contributors',
  view,
  ViewModel: ContributorsVM
});
