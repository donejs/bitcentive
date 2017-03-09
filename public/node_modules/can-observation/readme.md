# can-observation

[![Build Status](https://travis-ci.org/canjs/can-observation.png?branch=master)](https://travis-ci.org/canjs/can-observation)

Core observable indicators.

- <code>[__can-observation__ ](#can-observation-)</code>
  - <code>[new Observation(func, context, compute)](#new-observationfunc-context-compute)</code>
    - <code>[observed Object](#observed-object)</code>
    - <code>[Observation.add(obj, event)](#observationaddobj-event)</code>
    - <code>[Observation.addAll(observes)](#observationaddallobserves)</code>
    - <code>[Observation.ignore(fn)](#observationignorefn)</code>
    - <code>[Observation.trap()](#observationtrap)</code>
    - <code>[Observation.isRecording()](#observationisrecording)</code>

## API


## <code>__can-observation__ </code>



### <code>new Observation(func, context, compute)</code>


#### observed `{Object}`

 
An object representing an observation.

```js
{ "obj": map, "event": "prop1" }
```




##### <code>Object</code>

- __obj__ <code>{Object}</code>:
  The observable object
- __event__ <code>{String}</code>:
  The event, or more likely property, that is being observed.
  

#### <code>Observation.add(obj, event)</code>


Signals that an event should be observed. Adds the observable being read to
the top of the stack.

```js
Observation.add(obj, "prop1");
```


1. __obj__ <code>{Object}</code>:
  An observable object which is being observed.
1. __event__ <code>{String}</code>:
  The name of the event (or property) that is being observed.

#### <code>Observation.addAll(observes)</code>


The same as `Observation.add` but takes an array of [observed](#observed-object) objects.
This will most often by used in coordination with [trap](#observationtrap):

```js
var untrap = Observation.trap();

Observation.add(obj, "prop3");

var traps = untrap();
Oservation.addAll(traps);
```


1. __observes__ <code>{Array\<[observed](#observed-object)\>}</code>:
  An array of [observed](#observed-object)s.
  

#### <code>Observation.ignore(fn)</code>


Creates a function that, when called, will prevent observations from
being applied.

```js
var fn = Observation.ignore(function(){
  // This will be ignored
  Observation.add(obj, "prop1");
});

fn();
Observation.trapCount(); // -> 0
```


1. __fn__ <code>{function}</code>:
  Any function that contains potential calls to 
  [add](#observationaddobj-event).
  

- __returns__ <code>{function}</code>:
  A function that is free of observation side-effects.
  

#### <code>Observation.trap()</code>


Trap all observations until the `untrap` function is called. The state of 
traps prior to `Observation.trap()` will be restored when `untrap()` is called.

```js
var untrap = Observation.trap();

Observation.add(obj, "prop1");

var traps = untrap();
console.log(traps[0].obj === obj); // -> true
```


- __returns__ <code>{function}</code>:
  A function to untrap the current observations.
  

#### <code>Observation.isRecording()</code>


Returns if some function is in the process of recording observes.


- __returns__ <code>{Boolean}</code>:
  True if a function is in the process of recording observes.
    
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
