import set from "can-set";
import DefineMap from 'can-define/map/';
import DefineList from 'can-define/list/list';
import feathersClient from './feathers-client';
import superModel from '../lib/super-model';
import algebra from './algebras';

var User = DefineMap.extend("User", {
	_id: "string",
	email: "string",
	password: "string",
	/**
	 * @property {Boolean} isAdmin
	 *
	 * Whether the user has admin rights.
	 */
	isAdmin: {
		type: "boolean",
		value: false
	},
	/**
	 * @property {Any} github
	 *
	 * When a user authenticates against github, we store some public
	 * data that's passed back.
	 */
	github: 'any',
	/**
	 * @property {String} authProvider
	 *
	 * Which service did the user authenticate against.
	 */
	get authProvider() {
		return this.github && 'github';
	},
	/**
	 * @Property {Map} profile
	 *
	 * User profile info provided by the auth provider.
	 */
	get profile() {
		return this.authProvider && this.get(this.authProvider).profile;
	},
	/**
	 * @property {String} profileUrl
	 *
	 * The user's profile page back at the auth provider.
	 */
	get profileUrl() {
		return this.profile && this.profile.profileUrl;
	},
	/**
	 * @property {String} photoUrl
	 *
	 * A URL to a user avatar.
	 */
	get photoUrl() {
		return this.profile && this.profile.photos && this.profile.photos[0] && this.profile.photos[0].value;
	},
	/**
	 * @property {String} email
	 *
	 * An email address for the user.
	 */
	get email() {
		return this.profile && this.profile.emails && this.profile.emails[0] && this.profile.emails[0].value;
	},
	/**
	 * @property {String} name
	 *
	 * The user's name -- appropriate for display.
	 */
	get name() {
		return this.profile && this.profile.displayName;
	}
});

User.List = DefineList.extend({
	"#": User
});

User.connection = superModel({
	Map: User,
	List: User.List,
	feathersService: feathersClient.service("/api/users"),
	name: "users",
	algebra
});

User.algebra = algebra;

export default User;
