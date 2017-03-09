var QUnit = require('steal-qunit');
var DefineMap = require('can-define/map/map');
var DefineList = require('can-define/list/list');
require('can-define-stream');

QUnit.module('can-define-stream');

test('Stream behavior on multiple properties with merge', function() {

	var expectedNewVal,
		expectedOldVal,
		caseName;

	var MyMap = DefineMap.extend({
		foo: 'string',
		bar: { type: 'string', value: 'bar' },
		baz: {
			type: 'string',
		    stream( stream ) {
				var fooStream = this.stream('.foo');
				var barStream = this.stream('.bar');
				return stream.merge(fooStream).merge(barStream);
		    }
		}
	});

	var map = new MyMap();

	map.foo = 'foo-1';

	QUnit.equal( map.baz, undefined, "read value before binding");

	map.on("baz", function(ev, newVal, oldVal){
		QUnit.equal(newVal, expectedNewVal, caseName+ " newVal");
		QUnit.equal(oldVal, expectedOldVal, caseName+ " oldVal");
	});

	QUnit.equal( map.baz, 'bar', "read value immediately after binding");

	caseName = "setting foo";
	expectedOldVal = 'bar';
	expectedNewVal = 'foo-2';
	map.foo = 'foo-2';

	caseName = "setting bar";
	expectedOldVal = expectedNewVal;
	expectedNewVal = 'new bar';
	map.bar = 'new bar';

	caseName = "setting baz setter";
	expectedOldVal = expectedNewVal;
	expectedNewVal = 'new baz';
	map.baz = 'new baz';
});

test('Test if streams are memory safe', function() {

	var MyMap = DefineMap.extend({
		foo: 'string',
		bar: { type: 'string', value: 'bar' },
		baz: {
			type: 'string',
		    stream( stream ) {
				var fooStream = this.stream('.foo');
				var barStream = this.stream('.bar');
				return stream.merge(fooStream).merge(barStream);
		    }
		}
	});

	var map = new MyMap();

	QUnit.equal(0, map._bindings, 'Should have no bindings');


	map.on("baz", function(ev, newVal, oldVal){});

	QUnit.equal(3, map._bindings, 'Should have 3 bindings');

	map.off('baz');

	QUnit.equal(0, map._bindings, 'Should reset the bindings');
});

test('Keep track of change counts on stream', function(){

	var count;

	var Person = DefineMap.extend({
      first: "string",
      last: "string",
      fullName: {
		  get: function() {
			  return this.first + " " + this.last;
		  }
	  },
      fullNameChangeCount: {
          stream: function(setStream) {
              return this.stream(".fullName").scan(function(last){ return last + 1;}, 0);
          }
      }
    });

    var me = new Person({first: 'Justin', last: 'Meyer'});

	//this increases the count.. should it?
    me.on("fullNameChangeCount", function(ev, newVal){
		QUnit.equal(newVal, count, "Count should be " + count);
    });

	count = 2;
    me.first = "Obaid"; //outputs: 2 instead of 1

	count = 3;
    me.last = "Ahmed"; //outputs: 3 instead of 2

});


test('Update map property based on stream value', function() {
	var expected;
	var Person = DefineMap.extend({
		name: "string",
	  	lastValidName: {
	    	stream: function(){
	      		return this.stream(".name").filter(function(name){
	        		return name.indexOf(" ") >= 0;
		  		});
	    	}
	  	}
	});

	var me = new Person({name: "James"});

	me.on("lastValidName", function(lastValid){
		QUnit.equal(lastValid.target.name, expected, "Updated name to " + expected);
	});

	me.name = "JamesAtherton";

	expected = "James Atherton";
	me.name = "James Atherton";

	me.name = "JustinMeyer";

	expected = "Justin Meyer";
	me.name = "Justin Meyer";

});

test('Stream on DefineList', function() {
	var expectedLength;

	var people = new DefineList([
	  { first: "Justin", last: "Meyer" },
	  { first: "Paula", last: "Strozak" }
	]);

	var stream = people.stream('length');

	stream.onValue(function(event) {
		QUnit.equal(event.args[0], expectedLength, 'List size changed');
	});

	expectedLength = 3;
	people.push({
		first: 'Obaid',
		last: 'Ahmed'
	});

	expectedLength = 2;
	people.pop();
});
