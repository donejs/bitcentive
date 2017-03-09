@module {undefined} can-define-stream
@parent can-ecosystem
@group can-define-stream/behaviors 0 behaviors
@group can-define-stream/DefineMap.prototype 1 DefineMap.prototype
@group can-define-stream/DefineList.prototype 2 DefineList.prototype
@package ./package.json

Define property values using streams.  [can-stream](https://github.com/canjs/can-stream) is used internally
to provide the stream functionality.

@signature `undefined`

  The `can-define-stream` module doesn't export anything.  Instead it changes
  [can-define] to support the [can-define-stream.stream] behavior and
  [can-define/map/map] and [can-define/list/list] to have a `stream` method that's
  a shorthand for [can-stream.toStream] with 'this' (the map or list instance) passed as the first argument.

  ```js
  require("can-define-stream");
  var DefineMap = require("can-define/map/map");

  var Person = DefineMap.extend({
	  first: "string",
	  last: "string"
	  get fullName() {
		  return this.first + " " + this.last;
	  },
	  fullNameChangeCount: {
		  stream: function(setStream) {
			  return this.stream(".fullName").scan(function(last){
				  return last + 1;
			  },0)
		  }
	  }
  });

  var me = new Person({first: "Justin", last: "Meyer"});

  me.on("fullNameChangeCount", function(ev, newVal){
	  console.log(newVal);
  });

  me.fullNameChangeCount //-> 0

  me.first = "Obaid"
  //-> console.logs 1

  me.last = "Ahmed"
  //-> console.logs 2
  ```
