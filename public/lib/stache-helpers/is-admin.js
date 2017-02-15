import stache from 'can-stache';
import Session from '~/models/session';

function isAdmin() {
	let session = Session.current;
	let isAdmin = session && session.user;// && session.user.isAdmin;
	return isAdmin;
}

stache.registerHelper('isAdmin', isAdmin);

stache.registerHelper('notAdmin', function() {
	return !isAdmin();
});
