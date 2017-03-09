# can-event

[![Build Status](https://travis-ci.org/canjs/can-event.png?branch=master)](https://travis-ci.org/canjs/can-event)




- <code>[__can-event__ Object](#can-event-object)</code>
  - <code>[assign(YourClass.prototype, canEvent)](#assignyourclassprototype-canevent)</code>
    - _static_
      - <code>[obj.addEventListener(event, handler)](#objaddeventlistenerevent-handler)</code>
      - <code>[canEvent.addEventListener.call(obj, event, handler)](#caneventaddeventlistenercallobj-event-handler)</code>
      - <code>[obj.removeEventListener(event, handler)](#objremoveeventlistenerevent-handler)</code>
      - <code>[canEvent.removeEventListener.call(obj, event, handler)](#caneventremoveeventlistenercallobj-event-handler)</code>
      - <code>[obj.dispatch(event, args)](#objdispatchevent-args)</code>
      - <code>[canEvent.dispatch.call(obj, event, args)](#caneventdispatchcallobj-event-args)</code>
      - <code>[obj.on(event, handler)](#objonevent-handler)</code>
      - <code>[can-event.on.call(obj, event, handler)](#can-eventoncallobj-event-handler)</code>
      - <code>[obj.off(event, handler)](#objoffevent-handler)</code>
      - <code>[canEvent.off.call(obj, event, handler)](#caneventoffcallobj-event-handler)</code>
      - <code>[obj.one(event, handler)](#objoneevent-handler)</code>
      - <code>[obj.listenTo(other, event, handler)](#objlistentoother-event-handler)</code>
      - <code>[canEvent.listenTo.call(obj, other, event, handler)](#caneventlistentocallobj-other-event-handler)</code>
      - <code>[obj.stopListening(other, event, handler)](#objstoplisteningother-event-handler)</code>
      - <code>[canEvent.stopListening.call(obj, other, event, handler)](#caneventstoplisteningcallobj-other-event-handler)</code>
      - <code>[obj.bind(event, handler)](#objbindevent-handler)</code>
      - <code>[canEvent.bind.call(obj, event, handler)](#caneventbindcallobj-event-handler)</code>
      - <code>[obj.unbind(event, handler)](#objunbindevent-handler)</code>
      - <code>[canEvent.unbind.call(obj, event, handler)](#caneventunbindcallobj-event-handler)</code>
      - <code>[obj.delegate(selector, event, handler)](#objdelegateselector-event-handler)</code>
      - <code>[canEvent.delegate.call(obj, selector, event, handler)](#caneventdelegatecallobj-selector-event-handler)</code>
      - <code>[obj.undelegate(selector, event, handler)](#objundelegateselector-event-handler)</code>
      - <code>[canEvent.undelegate.call(obj, selector, event, handler)](#caneventundelegatecallobj-selector-event-handler)</code>

## API


## <code>__can-event__ Object</code>
 
Add event functionality into your objects.

The `canEvent` object provides a number of methods for handling events in objects. This functionality is best used by mixing the `canEvent` object into an object or prototype. However, event listeners can still be used even on objects that don't include `canEvent`.

All methods provided by `canEvent` assume that they are mixed into an object -- `this` should be the object dispatching the events.



### <code>assign(YourClass.prototype, canEvent)</code>


Adds event functionality to `YourClass` objects. This can also be applied to normal objects: `assign(someObject, canEvent)`.

The `assign` function can be any function that assigns additional properties on an object such as [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) or lodash's [_.assign](https://lodash.com/docs#assign) or [can-util/js/assign/assign].

```js
var assign = require("can-util/js/assign/assign");
var canEvent = require("can-event");

function Thing(){

}

assign(Thing.prototype, canEvent);

// Can not apply event listeners

var thing = new Thing();
thing.addEventListener("prop", function(){ ... });
```


#### <code>obj.addEventListener(event, handler)</code>


Add a basic event listener to an object.

```js
var canEvent = require("can-event");

var obj = {};
Object.assign(obj, canEvent);

obj.addEventListener("foo", function(){ ... });
```


1. __event__ <code>{String}</code>:
  The name of the event to listen for.
1. __handler__ <code>{function}</code>:
  The handler that will be executed to handle the event.

- __returns__ <code>{Object}</code>:
  this
  

#### <code>canEvent.addEventListener.call(obj, event, handler)</code>


This syntax can be used for objects that don't include the `canEvent` mixin.
    

#### <code>obj.removeEventListener(event, handler)</code>


Removes a basic event listener from an object.


1. __event__ <code>{String}</code>:
  The name of the event to listen for.
1. __handler__ <code>{function}</code>:
  The handler that will be executed to handle the event.
1. ____validate__ <code>{function}</code>:
  An extra function that can validate an
  event handler as a match. This is an internal parameter and only used
  for can-event plugins.

- __returns__ <code>{Object}</code>:
  this
  

#### <code>canEvent.removeEventListener.call(obj, event, handler)</code>


This syntax can be used for objects that don't include the [can-event](#assignyourclassprototype-canevent) mixin.
    

#### <code>obj.dispatch(event, args)</code>


Dispatches/triggers a basic event on an object.

```js
var canEvent = require("can-event");

var obj = {};
Object.assign(obj, canEvent);

obj.addEventListener("foo", function(){
  console.log("FOO BAR!");
});

obj.dispatch("foo"); // Causes it to log FOO BAR
```


1. __event__ <code>{String|Object}</code>:
  The event to dispatch
1. __args__ <code>{Array}</code>:
  Additional arguments to pass to event handlers

- __returns__ <code>{Object}</code>:
  event The resulting event object
  

#### <code>canEvent.dispatch.call(obj, event, args)</code>


This syntax can be used for objects that don't include the `can.event` mixin.
    

#### <code>obj.on(event, handler)</code>


Add a basic event listener to an object.

This is an alias of [addEventListener](#objaddeventlistenerevent-handler).


#### <code>can-event.on.call(obj, event, handler)</code>


This syntax can be used for objects that don't include the [can-event](#assignyourclassprototype-canevent) mixin.
    

#### <code>obj.off(event, handler)</code>


Removes a basic event listener from an object.

This is an alias of [removeEventListener](#objremoveeventlistenerevent-handler).


#### <code>canEvent.off.call(obj, event, handler)</code>


This syntax can be used for objects that don't include the [can-event](#assignyourclassprototype-canevent) mixin.
    

#### <code>obj.one(event, handler)</code>


Adds a basic event listener that listens to an event once and only once.


1. __event__ <code>{String}</code>:
  The name of the event to listen for.
1. __handler__ <code>{function}</code>:
  The handler that will be executed to handle the event.

- __returns__ <code>{Object}</code>:
  this
      

#### <code>obj.listenTo(other, event, handler)</code>


Listens for an event on another object.
This is similar to concepts like event namespacing, except that the namespace
is the scope of the calling object.


1. __other__ <code>{Object}</code>:
  The object to listen for events on.
1. __event__ <code>{String}</code>:
  The name of the event to listen for.
1. __handler__ <code>{function}</code>:
  The handler that will be executed to handle the event.

- __returns__ <code>{Object}</code>:
  this
  

#### <code>canEvent.listenTo.call(obj, other, event, handler)</code>


This syntax can be used for objects that don't include the [can-event](#assignyourclassprototype-canevent) mixin.
    

#### <code>obj.stopListening(other, event, handler)</code>


Stops listening for an event on another object.


1. __other__ <code>{Object}</code>:
  The object to listen for events on.
1. __event__ <code>{String}</code>:
  The name of the event to listen for.
1. __handler__ <code>{function}</code>:
  The handler that will be executed to handle the event.

- __returns__ <code>{Object}</code>:
  this
  

#### <code>canEvent.stopListening.call(obj, other, event, handler)</code>


This syntax can be used for objects that don't include the [can-event](#assignyourclassprototype-canevent) mixin.
    

#### <code>obj.bind(event, handler)</code>


Add a basic event listener to an object.

This is an alias of [addEventListener](#objaddeventlistenerevent-handler).


#### <code>canEvent.bind.call(obj, event, handler)</code>


This syntax can be used for objects that don't include the [can-event](#assignyourclassprototype-canevent) mixin.


#### <code>obj.unbind(event, handler)</code>


Removes a basic event listener from an object.

This is an alias of [removeEventListener](#objremoveeventlistenerevent-handler).


#### <code>canEvent.unbind.call(obj, event, handler)</code>


This syntax can be used for objects that don't include the [can-event](#assignyourclassprototype-canevent) mixin.


#### <code>obj.delegate(selector, event, handler)</code>


Provides a compatibility layer for adding delegate event listeners.
This doesn't actually implement delegates, but rather allows
logic that assumes a delegate to still function.

Therefore, this is essentially an alias of [addEventListener](#objaddeventlistenerevent-handler) with the selector ignored.


1. __selector__ <code>{String}</code>:
  The **ignored** selector to use for the delegate.
1. __event__ <code>{String}</code>:
  The name of the event to listen for.
1. __handler__ <code>{function}</code>:
  The handler that will be executed to handle the event.

- __returns__ <code>{Object}</code>:
  this
  

#### <code>canEvent.delegate.call(obj, selector, event, handler)</code>


This syntax can be used for objects that don't include the [can.event] mixin.


#### <code>obj.undelegate(selector, event, handler)</code>


Provides a compatibility layer for removing delegate event listeners.
This doesn't actually implement delegates, but rather allows
logic that assumes a delegate to still function.

Therefore, this is essentially an alias of [removeEventListener](#objremoveeventlistenerevent-handler) with the selector ignored.


1. __selector__ <code>{String}</code>:
  The **ignored** selector to use for the delegate.
1. __event__ <code>{String}</code>:
  The name of the event to listen for.
1. __handler__ <code>{function}</code>:
  The handler that will be executed to handle the event.

- __returns__ <code>{Object}</code>:
  this
  

#### <code>canEvent.undelegate.call(obj, selector, event, handler)</code>


This syntax can be used for objects that don't include the [can-event](#assignyourclassprototype-canevent) mixin.

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
