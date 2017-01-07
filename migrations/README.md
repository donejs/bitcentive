# DB Migrations

We are using the [db-migrate](https://www.npmjs.com/package/db-migrate) package. Please refer to the docs for advanced usage.

**Create a new migration:**

```
db-migrate create name-of-migration
```

Please use a meaningfull `name-of-migration`. This will create a file within the [migrations](./) directory prefixed with a sortable timestamp. Open the file and add your `up` and `down` scripts. Most of the time you will want to import the app and call services directly to ensure data is processed correctly (hooks and all):

```js
const app = require('../src/app');

exports.up = function() {
  // return a Promise
  return app.service('/api/os_projects').create({name: "CanJS"});
}
```

**Exectute all new migration scripts:**

```
npm run db-migrate
```

Migrations will only be executed once. The migration tool keeps track of which migrations have run in the "migrations" collection in the database.

## Important information

**Do not assume a migration must run!**

It is important to make sure that a migration actually needs to run. For example, if a migration script creates a new record in the database, it should first check to make sure that the record does not already exist:

```js
const app = require('../src/app');

exports.up = function() {
	// return a Promise
	const svc = app.service('/api/os_projects');
	return svc.find({name: "CanJS"}).then(results => {
		if (!results.length) {
			return svc.create({name: "CanJS"});
		}
	});
}
```

While this strategy results in more verbose migration scripts, it protects the app from getting into a bad state. Consider a situation where someone adds new indexing rules to a particular Schema. Mongoose may or may not create this index for you during app startup based on the `autoIndex` setting. Therefore, the migration script should first check whether or not the index exists before creating it. The same rules should apply to all types of migrations. It is worth the time to write the extra code.