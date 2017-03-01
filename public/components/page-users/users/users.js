import Component from 'can-component';
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/';
import view from './users.stache';

export const ViewModel = DefineMap.extend({
	/**
	 * @property {DefineList} users
	 *
	 * A list of application users.
	 */
	users: DefineList,
	/**
	 * @function setAdmin
	 *
	 * @param {DefineMap} user An application user.
	 * @param {Boolean} state Whether the user is an admin or not.
	 * @return {Promise} A save promise.
	 */
	setAdmin(user, state) {
		user.isAdmin = state;

		return user.save();
	}
});

export default Component.extend({
	tag: 'bit-users',
	ViewModel,
	view
});
