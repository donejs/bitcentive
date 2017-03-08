/**
 * @function bitcentive/helpers/is-admin isAdmin
 * @parent bitcentive.helpers
 *
 * Template helper to show sections restricted to admins.
 *
 * @signature `isAdmin()`
 *
 *   Indicates if the user has admin permissions.
 *
 *   ```
 *   <can-import from="bitcentive/lib/stache-helpers/" />
 *
 *   {{#if isAdmin()}} You are the admin {{/if}}
 *   ```
 *   @return {boolean} True if user is admin.
 */

import stache from 'can-stache';
import Session from '~/models/session';

function isAdmin() {
	let session = Session.current;

	return session && session.user && session.user.isAdmin;
}

stache.registerHelper('isAdmin', isAdmin);

/**
 * @function bitcentive/helpers/non-admin nonAdmin
 * @parent bitcentive.helpers
 *
 * @return {boolean} Indicates if the user does not have admin permissions.
 */
stache.registerHelper('notAdmin', function() {
	return !isAdmin();
});
