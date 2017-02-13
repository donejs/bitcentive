'use strict';

// Add isAdmin field to User model

const app = require('../src/app');

exports.up = function(db) {
	let service = app.service('/api/users');
  let User = service.Model;
  let paths = User.schema.paths;

  return new Promise((resolve, reject) => {
    User.updateMany({ isAdmin: { '$exists': false } },
      { isAdmin: true }, // model default is false
      (error, result) => error ? reject(error) : resolve(result));
  });
};

exports.down = function(db) {
	let service = app.service('/api/users');
  let User = service.Model;
  let paths = User.schema.paths;

  return new Promise((resolve, reject) => {
    User.update({ }, { '$unset': { isAdmin: 1 } },
      (error, result) => error ? reject(error) : resolve(result));
  });
};
