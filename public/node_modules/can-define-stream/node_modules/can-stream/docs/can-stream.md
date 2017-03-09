@module {Object} can-stream can-stream
@parent can-ecosystem
@group can-stream.fns 1 Methods
@package ../package.json

@description Convert observable values into streams. [Kefir](https://rpominov.github.io/kefir/) is used internally to provide the stream functionality.

@type {Object}

  The `can-stream` module exports methods useful for converting observable values like [can-compute]s
  or [can-define/map/map] properties into streams.

  ```js
  var canStream = require("can-stream");
  var DefineMap = require("can-define/map/map");

  var me = new DefineMap({name: "Justin"});

  var nameStream = canStream.toStream(me,".name");


  nameStream.onValue(function(name){
	  // name -> "Obaid";
  });

  me.name = "Obaid";
  ```

@body

## Usage

The [can-stream.toStream] method has shorthands for all of the other methods:

```
var canStream = require("can-stream");

canStream.toStream(compute)                    //-> stream
canStream.toStream(map, "eventName")           //-> stream
canStream.toStream(map, ".propName")           //-> stream
canStream.toStream(map, ".propName eventName") //-> stream
```

For example:

__Converting a compute to a stream__

```js
var canCompute = require("can-compute");
var canStream = require("can-stream");

var compute = canCompute(0);
var stream = canStream.toStream(compute);

stream.onValue(function(newVal){
	console.log(newVal);
});

compute(1);
//-> console.logs 1
```

__Converting an event to a stream__

```js
var DefineList = require('can-define/list/list');
var canStream = require('can-stream');

var hobbies = new DefineList(["js","kayaking"]);

var changeCount = canStream.toStream(obs, "length").scan(function(prev){
	return prev + 1;
}, 0);
changeCount.onValue(function(event) {
	console.log(event);
});

hobbies.push("bball")
//-> console.logs {type: "add", args: [2,["bball"]]}
hobbies.shift()
//-> console.logs {type: "remove", args: [0,["js"]]}
```

__Converting a property value to a stream__

```js
var canStream = require('can-stream');
var DefineMap = require("can-define/map/map");

var person = new DefineMap({
	first: "Justin",
	last: "Meyer"
});

var first = canStream.toStream(person, '.first'),
	last = canStream.toStream(person, '.last');

var fullName = Kefir.combine(first, last, function(first, last){
	return first + last;
});

fullName.onValue(function(newVal){
	console.log(newVal);
});

map.first = "Payal"
//-> console.logs "Payal Meyer"
```

__Converting an event on a nested object into a stream__

```js
var canStream = require('can-stream');
var DefineMap = require("can-define/map/map");
var DefineList = require("can-define/list/list");

var me = new DefineMap({
	todos: ["mow lawn"]
});

var addStream = canStream.toStream(me, ".todos add");

addStream.onValue(function(event){
	console.log(event);
});

map.todos.push("do dishes");
//-> console.logs {type: "add", args: [1,["do dishes"]]}
```
