var stealTools = require('steal-tools');
var path = require('path');

stealTools.export({
  steal: {
    main: 'can-zone-storage',
    config: path.join(__dirname, '/package.json!npm')
  },
  outputs: {
    '+amd': {},
    '+standalone': {
      modules: ['can-zone-storage'],
      exports: {
        'can-namespace': 'can'
      }
    }
  }
}).catch(function (e) {
  setTimeout(function () {
    throw e;
  }, 1);
});
