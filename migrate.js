/**
 * When using db-migrate, the CLI should work most of the time:
 *
 * ```
 * $ db-migrate up
 * ```
 *
 * However, if the migration code calls Service and Model
 * methods directly, then we need to manually close the
 * connection. This file will take care of this for us. Instead
 * of running the `db-migrate` command, run this file instead.
 * Note: This works with multiple migrations.
 *
 * ```
 * $ node migrate.js
 * ```
 */

const DBMigrate = require('db-migrate');
const mongoose = require('mongoose');

const options = {
	// To avoid having an additional config file (database.json):
	config: {
		"dev": require('./config/default.json').mongodb,
		"production": { "ENV": require('./config/custom-environment-variables.json').mongodb }
	}
};

console.log("\nDB MIGRATE CONFIG\n", options.config);

// Travis runs db-migrate without passing NODE_ENV
options.env = process.env.NODE_ENV
	? (process.env.NODE_ENV === 'prod' ? 'production' : process.env.NODE_ENV)
	: 'dev';

const instance = DBMigrate.getInstance(true, options);

// same as running `db-migrate up`
instance.up(() => {
	mongoose.connections.forEach(conn => conn.close());
});
