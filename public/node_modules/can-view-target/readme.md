# can-view-target

[![Build Status](https://travis-ci.org/canjs/can-view-target.png?branch=master)](https://travis-ci.org/canjs/can-view-target)

Fast cloning micro templates


- <code>[__can-view-target__ function](#can-view-target-function)</code>
  - <code>[target(nodes)](#targetnodes)</code>

## API


## <code>__can-view-target__ function</code>



### <code>target(nodes)</code>


Create a document fragment that can be cloned but have callbacks be
called quickly on elements within the cloned fragment.

```js
var viewTarget = require("can-view-target");

var target = viewTarget([
	{
		tag: "h1",
		callbacks: [function(data){
			this.className = data.className
		}],
		children: [
			"Hello ",
			function(){
				this.nodeValue = data.message
			}
		]
	},
]);

// target.clone -> <h1>|Hello||</h1>
// target.paths -> path: [0], callbacks: [], children: {paths: [1], callbacks:[function(){}]}

var frag = target.hydrate({className: "title", message: "World"});

frag //-> <h1 class='title'>Hello World</h1>
```


1. __nodes__ <code>{Array}</code>:
  
  
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
