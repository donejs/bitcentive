# can-simple-map

[![Build Status](https://travis-ci.org/canjs/can-simple-map.png?branch=master)](https://travis-ci.org/canjs/can-simple-map)

A performant live-bound map

## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'can-simple-map';
```

### CommonJS use

Use `require` to load `can-simple-map` and everything else
needed to create a template that uses `can-simple-map`:

```js
var plugin = require("can-simple-map");
```

## AMD use

Configure the `can` and `jquery` paths and the `can-simple-map` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-simple-map',
		    	location: 'node_modules/can-simple-map/dist/amd',
		    	main: 'lib/can-simple-map'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-simple-map/dist/global/can-simple-map.js'></script>
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
