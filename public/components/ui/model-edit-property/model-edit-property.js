import Component from 'can-component';
import DefineMap from 'can-define/map/';
import view from './model-edit-property.stache';

export const ViewModel = DefineMap.extend({
  /**
   * @property {DefineMap} model
   *
   * The model whose property we're making editable.
   */
  model: DefineMap,
  /**
   * @property {DefineMap} saveModel
   *
   * The model that has a connection for saving (e.g. for nested data).
   */
  saveModel: DefineMap,
  /**
   * @property {String} property
   *
   * The name of the model property that we're making editable.
   */
  property: 'string',
  /**
   * @property {String} type
   *
   * The type of the input field. Default `text`.
   */
  type: {
	  type: 'string',
	  value: 'text'
  },
  /**
   * @property {Boolean} viewOnly
   *
   * Whether to switch to a view-only mode.
   */
  viewOnly: {
	  type: 'boolean',
	  value: false
  },
  /**
   * @property {String} propertyValue
   *
   * The value in the model property that we're making editable.
   */
  get propertyValue() {
    return this.model && this.model.get(this.property);
  },
  /**
   * @property {Boolean} isEditing
   *
   * Whether we're currently editing the property.
   */
  isEditing: {
    value: false
  },
	/**
	 * @property {Boolean} isDisabled
	 *
	 * Whether input field is disabled (e.g. during saving).
	 */
	get isDisabled() {
		return (this.saveModel || this.model).isSaving();
	},
  /**
   * @function makeEditable
   *
   * Set isEditing to true so that the property can be updated.
   */
  makeEditable() {
    this.isEditing = true;
  },
  /**
   * @function cancelEdit
   *
   * Throw away any uncommitted user changes and set isEditing back to false.
   *
   * @param {Event} event A keyboard event.
   */
  cancelEdit(event) {
    if (event.keyCode === 27) { // escape key
      this.isEditing = false;
    }
  },
  /**
   * @function commitValue
   *
   * Save the new value and exit edit mode.
   *
   * TODO - Validate the field
   *
   * @param {String} newValue The value entered in the text field.
   * @return {Promise} A save promise.
   */
  commitValue(newValue) {
    let model = this.model;
	  let connectedModel = this.saveModel || model;
    let property = this.property;

    this.isEditing = false;
    model[property] = newValue;

    return connectedModel.save().catch(err => {
      console.error(err)

      return err;
    });
  }
});

export default Component.extend({
  tag: 'model-edit-property',
  ViewModel,
  view
});
