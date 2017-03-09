@module {Object} can-event/lifecycle/lifecycle
@parent can-infrastructure

@description Mixin lifecycle events onto a prototype.

@signature `lifecycle(prototype)`

The `can-event/lifecycle/lifecycle` module adds lifecycle events to a prototype that already has `addEventListener` and `removeEventListener`. It allows you to define:

 - `_eventSetup`: A method that is called the first time a binding is added to the object.
 - `_eventTeardown`: A method that is called when there are no longer any more bindings on an object.

@body

## Use

To use lifecycle events, provide an object with add/removeEventListener methods.

```js
var Todo = function(){

};

lifecycle(assign(Todo.prototype, canEvent));

Todo.prototype._eventSetup = function(){
	// Called the first time bindings are added.
};
```
