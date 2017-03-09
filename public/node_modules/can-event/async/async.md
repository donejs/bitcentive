@module {Object} can-event/async/async
@parent can-infrastructure

@description Makes the event system asynchronous. __WARNING:__ This is experimental technology.

@signature `Object`

The `can-event/async/async` module makes the event system asynchronous.  It:

 - Provides an [can-event/async/async.async] method which converts event binding and dispatching to happen asynchronously.
 - Provides [can-event/async/async.sync]  method which converts event binding and dispatching to happen synchronously.
 - Provides an asynchronous [can-event/async/async.dispatch], [can-event/async/async.queue],
  [can-event/async/async.addEventListener] and [can-event/async/async.removeEventListener].
 - Provides a [can-event/async/async.flush] which can be used to immediately run all tasks in the
   task queue.

@body

## Use

Use `can-event/async/async`'s `async` method to make event binding and
dispatching happen immediately following the current event loop.

```js
var canEvent = require("can-event");
var canAsync = require("can-event/async/async");
canAsync.async();

var obj = {};
Object.assign(obj, canEvent);

obj.addEventListener("foo", function(){
  console.log("heard foo");
});
obj.dispatch("foo");
console.log("dispatched foo");

// Logs -> "dispatched foo" then "heard foo"
```

This means you never have to call [can-event/batch/batch.start] and [can-event/batch/batch.stop]. Notice
that in the following example `"change"` is only fired once:

```js
var canAsync = require("can-event/async/async");
canAsync.async();

var compute = require("can-compute");

var first = compute("Justin");
var last = compute("Meyer");

var fullName = compute(function(){
	return first() + " " + last();
});

fullName.on("change", function(ev, newVal, oldVal){
	newVal //-> "Payal Shah"
	oldVal //-> "Justin Meyer"
});

first("Payal");
last("Shah");
```
