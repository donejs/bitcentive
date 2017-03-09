# can-types

[![Build Status](https://travis-ci.org/canjs/can-types.png?branch=master)](https://travis-ci.org/canjs/can-types)

A stateful container for CanJS type information

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'can-types';
```

### CommonJS use

Use `require` to load `can-types` and everything else
needed to create a template that uses `can-types`:

```js
var plugin = require("can-types");
```

## AMD use

Configure the `can` and `jquery` paths and the `can-types` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-types',
		    	location: 'node_modules/can-types/dist/amd',
		    	main: 'lib/can-types'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-types/dist/global/can-types.js'></script>
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
