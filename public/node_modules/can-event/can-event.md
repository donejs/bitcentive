@module {{}} can-event
@parent can-infrastructure
@test can/event/test.html
@link ../docco/event.html docco
@group can-event.static static
@release 2.1
@package ./package.json

@description

Add event functionality into your objects.

The `canEvent` object provides a number of methods for handling events in objects. This functionality is best used by mixing the `canEvent` object into an object or prototype. However, event listeners can still be used even on objects that don't include `canEvent`.

All methods provided by `canEvent` assume that they are mixed into an object -- `this` should be the object dispatching the events.

@signature `assign(YourClass.prototype, canEvent)`

Adds event functionality to `YourClass` objects. This can also be applied to normal objects: `assign(someObject, canEvent)`.

The `assign` function can be any function that assigns additional properties on an object such as [Object.assign](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign) or lodash's [_.assign](https://lodash.com/docs#assign) or [can-util/js/assign/assign].

```js
var assign = require("can-util/js/assign/assign");
var canEvent = require("can-event");

function Thing(){

}

assign(Thing.prototype, canEvent);

var thing = new Thing();
thing.addEventListener("prop", function(){ ... });
```

@body

## Using as a mixin

The easiest way to add events to your classes and objects is by mixing [can-event] into your object or prototype.

```
var SomeClass = Construct("SomeClass", {
	init: function() {
		this.value = 0;
	},
	increment: function() {
		this.value++;
		this.dispatch("change", [this.value]);
	}
});
Object.assign(SomeClass.prototype, canEvent);
```

Now that `canEvent` is included in the prototype, we can add/remove/dispatch events on the object instances.

```
var instance = new SomeClass();
instance.on("change", function(ev, value) {
	alert("The instance changed to " + value);
});

// This will dispatch the "change" event and show the alert
instance.increment();
```

## Using without mixing in

The same event functionality from `canEvent` can be used, even if the given object doesn't include `canEvent`. Every method within `canEvent` supports being called with an alternate scope.

```
var obj = {};

canEvent.addEventListener.call(obj, "change", function() {
	alert("object change!");
});

// This will dispatch the "change" event and show the alert
canEvent.dispatch.call(obj, "change");
```
