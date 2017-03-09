# can-view-scope

[![Build Status](https://travis-ci.org/canjs/can-view-scope.png?branch=master)](https://travis-ci.org/canjs/can-view-scope)

Observable scopes.

- <code>[__can-view-scope__ function](#can-view-scope-function)</code>
  - <code>[new Scope(context, [parent])](#new-scopecontext-parent)</code>
    - _prototype_
      - <code>[scope.add(context)](#scopeaddcontext)</code>
      - <code>[scope.attr(key)](#scopeattrkey)</code>
      - <code>[scope.compute(key, [options])](#scopecomputekey-options)</code>
      - <code>[scope.computeData(key)](#scopecomputedatakey)</code>

## API


## <code>__can-view-scope__ function</code>
Create a lookup node for [can-mustache.key keys]. 




### <code>new Scope(context, [parent])</code>



1. __context__ <code>{*}</code>:
  A value that represents the 
  current context. This is often an object or observable and is the first
  place a `key` is looked up.
  
1. __parent__ <code>{[Scope](#new-scopecontext-parent)}</code>:
  The parent scope. If a `key` value
  is not found in the current scope, it will then look in the parent
  scope.
  

- __returns__ <code>{[Scope](#new-scopecontext-parent)}</code>:
  Returns a scope instance.
  

#### <code>scope.add(context)</code>


Add an object (which could be another Scope, a Map, or a plain object) to the scope.

```js
var scope = new Scope({ foo: "bar" }).add({ baz: "qux" });

scope.attr("baz"); // -> "qux"
```


1. __context__ <code>{*}</code>:
  The context of the new scope object.
  

- __returns__ <code>{[Scope](#new-scopecontext-parent)}</code>:
  A scope object.
  

#### <code>scope.attr(key)</code>



1. __key__ <code>{can-mustache.key}</code>:
  A dot seperated path.  Use `"."` if you have a
  property name that includes a dot.
  

- __returns__ <code>{*}</code>:
  The found value or undefined if no value is found.
  

#### <code>scope.compute(key, [options])</code>


1. __key__ <code>{can-mustache.key}</code>:
  A dot seperated path.  Use `"."` if you have a
  property name that includes a dot.
  
1. __options__ <code>{can-view-scope.readOptions}</code>:
  Options that configure how the `key` gets read.
  

- __returns__ <code>{can-compute.computed}</code>:
  A compute that can get or set `key`.
  

#### <code>scope.computeData(key)</code>



1. __key__ <code>{can-mustache.key}</code>:
  A dot seperated path.  Use `"."` if you have a
  property name that includes a dot.
  
1. __options__ <code>{can-view-scope.readOptions}</code>:
  Options that configure how the `key` gets read.
  

- __returns__ <code>{Object}</code>:
  An object with the following values:
      
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
