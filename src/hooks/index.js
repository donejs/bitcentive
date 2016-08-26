'use strict';

// Add any common hooks you want to share across services in here.
//
// Below is an example of how a hook is written and exported. Please
// see http://docs.feathersjs.com/hooks/readme.html for more details
// on hooks.

exports.myHook = function(options) {
  return function(hook) {
    console.log('My custom global hook ran. Feathers is awesome!');
  };
};

exports.roleAuth = {
  accessList:{
    find: function(accessLists) {
      return function(hook) {
        var userRole = hook.params.user.role;
        //if no role match, all permissions granted
        var accessList = accessLists[userRole];
        var data = hook.result.data;

        //TODO: more thought here (should we be restrictive instead of lenient?)
        if(!accessList || accessList === "*"){
          accessList = ["create", "read", "update", "delete"];
        }

        //add access to the list
        hook.result.accessList = accessList;

        //add access to each item
        if(data){
          data.forEach(function(item){
            item.accessList = accessList;
          });
        }
      };
    },
    get: function(accessLists) {
      return function(hook) {
        var userRole = hook.params.user.role;
        //if no role match, all permissions granted
        //TODO: more thought here (should we be restrictive instead of lenient?)
        var accessList = accessLists[userRole];
        var data = hook.result.data;

        if(!accessList || accessList === "*"){
          accessList = ["create", "read", "update", "delete"];
        }

        //add access to the item
        hook.result.accessList = accessList;
      };
    }
  },


  before:{
    all: function(options) {
      console.log('globalHooks.roleAuth.before.all', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.before.all fn', arguments);
      };
    },
    find: function(options) {
      console.log('globalHooks.roleAuth.before.find', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.before.find fn', arguments);
      };
    },
    get: function(options) {
      console.log('globalHooks.roleAuth.before.get', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.before.get fn', arguments);
      };
    },
    create: function(options) {
      console.log('globalHooks.roleAuth.before.create', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.before.create fn', arguments);
      };
    },
    update: function(options) {
      console.log('globalHooks.roleAuth.before.update', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.before.update fn', arguments);
      };
    },
    patch: function(options) {
      console.log('globalHooks.roleAuth.before.patch', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.before.patch fn', arguments);
      };
    },
    remove: function(options) {
      console.log('globalHooks.roleAuth.before.remove', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.before.remove fn', arguments);
      };
    }
  },
  after:{
    all: function(options) {
      console.log('globalHooks.roleAuth.after.all', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.after.all fn', arguments);
      };
    },
    find: function(options) {
      console.log('globalHooks.roleAuth.after.find', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.after.find fn', arguments);
      };
    },
    get: function(options) {
      console.log('globalHooks.roleAuth.after.get', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.after.get fn', arguments);
      };
    },
    create: function(options) {
      console.log('globalHooks.roleAuth.after.create', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.after.create fn', arguments);
      };
    },
    update: function(options) {
      console.log('globalHooks.roleAuth.after.update', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.after.update fn', arguments);
      };
    },
    patch: function(options) {
      console.log('globalHooks.roleAuth.after.patch', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.after.patch fn', arguments);
      };
    },
    remove: function(options) {
      console.log('globalHooks.roleAuth.after.remove', arguments);
      return function(hook) {
        console.log('globalHooks.roleAuth.after.remove fn', arguments);
      };
    }
  }
};
