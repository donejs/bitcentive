import stache from 'can-stache';
import Session from '~/models/session';

function isAdmin() {
	let session = Session.current;

	return session && session.user && session.user.isAdmin;
}

stache.registerHelper('isAdmin', isAdmin);

stache.registerHelper('notAdmin', function() {
	return !isAdmin();
});
