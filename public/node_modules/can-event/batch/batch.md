@module {Object} can-event/batch/batch
@parent can-infrastructure

@description Adds task batching abilities to event dispatching.

@signature `Object`

The `can-event/batch/batch` module adds task batching abilities to
the [can-event] module.  It:

 - Provides a [can-event/batch/batch.queue] method to add batched work.
 - Provides [can-event/batch/batch.dispatch] and overwrites [can-event.dispatch can-event.dispatch] to use the task queue when dispatching events.
 - Provides a [can-event/batch/batch.start] and [can-event/batch/batch.stop] method that can create a new task queue.
 - Provides [can-event/batch/batch.collecting] which returns the queue collecting tasks.
 - Provides [can-event/batch/batch.dispatching] which returns the queue dispatching tasks.
 - Dispatches `batchEnd` when a queue's tasks have been completed.

@body

## Use

To batch events, call  [can-event/batch/batch.start], then make changes that
[can-event/batch/batch.dispatch] batched events, then call [can-event/batch/batch.stop].

For example, a map might have a `first` and `last` property:

```js
var Person = DefineMap.extend({
	first: "string",
	last: "string"
});

var baby = new Person({first: "Roland", last: "Shah"});
```

Normally, when `baby`'s `first` and `last` are fired, those events are dispatched immediately:

```js
baby.on("first", function(ev, newFirst){
	console.log("first is "+newFirst);
}).on("last", function(ev, newLast){
	console.log("last is "+newLast);
});

baby.first = "Ramiya";
// console.logs -> "first is Ramiya"
baby.last = "Meyer";
// console.logs -> "first is Meyer"
```

However, if a batch is used, events will not be dispatched until [can-event/batch/batch.stop] is called:

```js
var canBatch = require("can-event/batch/batch");

canBatch.start();
baby.first = "Lincoln";
baby.last = "Sullivan";
canBatch.stop();
// console.logs -> "first is Lincoln"
// console.logs -> "first is Sullivan"
```



## Performance

CanJS synchronously dispatches events when a property changes.
This makes certain patterns easier. For example, if you
are utilizing live-binding and change a property, the DOM is
immediately updated.

Occasionally, you may find yourself changing many properties at once. To
prevent live-binding from performing unnecessary updates,
update the properties within a pair of calls to `canBatch.start` and
`canBatch.stop`.

Consider a todo list with a `completeAll` method that marks every todo in the list as
complete and `completeCount` that counts the number of complete todos:

```js
var Todo = DefineMap.extend({
	name: "string",
	complete: "boolean"
});

var TodoList = DefineList.extend({
	"#": Todo,
	completeAll: function(){
		this.forEach(function(todo){
			todo.complete = true;
		})
	},
	completeCount: function(){
		return this.filter({complete: true}).length;
	}
})
```

And a template that uses the `completeCount` and calls `completeAll`:

```
<ul>
{{#each todos}}
	<li><input type='checklist' {($checked)}="complete"/> {{name}}</li>
{{/each}}
</ul>
<button ($click)="todos.completeAll()">
  Complete {{todos.completeCount}} todos
</button>
```

When `completeAll` is called, the `{{todos.completeCount}}` magic tag will update
once for every completed count.  We can prevent this by wrapping `completeAll` with calls to
`start` and `stop`:

```js
	completeAll: function(){
		canBatch.start();
		this.forEach(function(todo){
			todo.complete = true;
		});
		canBatch.end();
	},
```


## batchNum

All events created within a set of `start` / `stop` calls share the same
batchNum value. This can be used to respond only once for a given batchNum.

    var batchNum;
    person.on("name", function(ev, newVal, oldVal) {
      if(!ev.batchNum || ev.batchNum !== batchNum) {
        batchNum = ev.batchNum;
        // your code here!
      }
    });
