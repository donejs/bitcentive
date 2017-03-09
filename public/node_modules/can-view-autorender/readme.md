[![Build Status](https://travis-ci.org/canjs/can-view-autorender.png?branch=master)](https://travis-ci.org/canjs/can-view-autorender)

Automatically render templates found in the document.

```
<script type="text/stache" can-autorender>
	<div>Hello world!</div>
</script>
<script src="./node_modules/steal/steal.js" main="can-view-autorender"></script>
```

- <code>[__can-view-autorender__ function](#can-view-autorender-function)</code>
  - <code>[autorender(success, error)](#autorendersuccess-error)</code>

## API


## <code>__can-view-autorender__ function</code>

A module that automatically renders script and other elements with
the [can/view/autorender.can-autorender] attribute. This function is useful to know when the templates have finished rendering.


### <code>autorender(success, error)</code>


  Registers functions to callback when all templates successfully render or an error in rendering happens.


1. __success__ <code>{function}</code>:
  A function to callback when all autorendered templates have been rendered
  successfully.

1. __error__ <code>{function}</code>:
  A function to callback if a template was not rendered successfully.

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
