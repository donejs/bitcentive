# can-view-import

[![Build Status](https://travis-ci.org/canjs/can-view-import.png?branch=master)](https://travis-ci.org/canjs/can-view-import)

Import dependencies in Stache views.

- <code>[__can-view-import__ function](#can-view-import-function)</code>
  - <code>[&lt;can-import from="MODULE_NAME" /&gt;](#ltcan-import-frommodule_name-gt)</code>
  - <code>[&lt;can-import from="MODULE_NAME"&gt;content&lt;/can-import&gt;](#ltcan-import-frommodule_namegtcontentltcan-importgt)</code>
    - <code>[from="MODULE_NAME"](#frommodule_name)</code>
    - <code>[can-tag="TAG_NAME"](#can-tagtag_name)</code>
    - <code>[{^value}="*NAME"](#valuename)</code>

## API


## <code>__can-view-import__ function</code>



### <code>&lt;can-import from="MODULE_NAME" /&gt;</code>


Statically import a module from with a [can-stache] template. *MODULE_NAME* will be imported before the template renders.

```
<can-import from="components/tabs" />
<tabs-widget />
```


1. __MODULE_NAME__ <code>{moduleName}</code>:
  A module that this template depends on.
  

### <code>&lt;can-import from="MODULE_NAME"&gt;content&lt;/can-import&gt;</code>


Dynamically import a module. *MODULE_NAME* will be imported dynamically; the scope within the template is a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

```
<can-import from="components/tabs">
	{{#if isResolved}}
		<tabs-widget />
	{{/if}}
</can-import>
```


1. __MODULE_NAME__ <code>{moduleName}</code>:
  A module that this template depends on.
  

#### <code>from="MODULE_NAME"</code>


Passes MODULE_NAME to [can-util/js/import/import] and sets the [<can-import>](#ltcan-import-frommodule_name-gt)'s viewModel to be the returned Promise.

```js
<can-import from="bootstrap/bootstrap.css" />
```


1. __MODULE_NAME__ <code>{String}</code>:
  The name of the module to import.
  

#### <code>can-tag="TAG_NAME"</code>


Instantiates the provided [can-view-callbacks.tag] and sets its [can-component::viewModel viewModel] to be the Promise for the import.


1. __TAG_NAME__ <code>{String}</code>:
  The tag name (usually a [can-component]) to use.
  

#### <code>{^value}="*NAME"</code>


Sets up a [can-stache-bindings.toParent] binding to \*NAME in the references scope.


1. __NAME__ <code>{String}</code>:
  The variable name to assign to the references scope. This can be any string name you want to use, but must be preceded by `*` or it will be placed on the template's View Model.
  
  ```html
  <can-import from="app/person" {^value}="*person" />
  	
  <section>
  	hello {{*person.name}}
  </section>
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
