# can-list

[![Build Status](https://travis-ci.org//can-list.png?branch=master)](https://travis-ci.org//can-list)




- <code>[__can-list__ ](#can-list-)</code>
  - <code>[new List([array])](#new-listarray)</code>
  - <code>[new List(deferred)](#new-listdeferred)</code>
    - <code>[List.extend([name,] [staticProperties,] instanceProperties)](#listextendname-staticproperties-instanceproperties)</code>
    - <code>[Map can-map](#map-can-map)</code>
    - <code>[list.attr()](#listattr)</code>
    - <code>[list.attr(index)](#listattrindex)</code>
    - <code>[list.attr(index, value)](#listattrindex-value)</code>
    - <code>[list.attr(elements[, replaceCompletely])](#listattrelements-replacecompletely)</code>
    - <code>[list.filter(filterFunc, context)](#listfilterfilterfunc-context)</code>
    - <code>[list.splice(index[, howMany[, ...newElements]])](#listspliceindex-howmany-newelements)</code>
    - <code>[list.each( callback(item, index) )](#listeach-callbackitem-index-)</code>
    - <code>[list.reverse()](#listreverse)</code>
    - <code>[list.map( callback(item, index, listReference), context )](#listmap-callbackitem-index-listreference-context-)</code>

## API


## <code>__can-list__ </code>



### <code>new List([array])</code>


Create an observable array-like object.


1. __array__ <code>{Array}</code>:
  Items to seed the List with.
  

- __returns__ <code>{[can-list](#new-listarray)}</code>:
  An instance of `List` with the elements from _array_.
  

### <code>new List(deferred)</code>



1. __deferred__ <code>{can.Deferred}</code>:
  A deferred that resolves to an 
  array.  When the deferred resolves, its values will be added to the list.
  

- __returns__ <code>{[can-list](#new-listarray)}</code>:
  An initially empty `List`.  
  
  

#### <code>List.extend([name,] [staticProperties,] instanceProperties)</code>


Creates a new extended constructor function. Learn more at [can.Construct.extend].

```js
var MyList = List.extend({}, {
	// silly unnecessary method
	count: function(){
		return this.attr('length');
	}
});

var list = new MyList([{}, {}]);
console.log(list.count()); // -> 2
```


1. __name__ <code>{String}</code>:
  If provided, adds the extened List constructor function to the window at the given name.
  
1. __staticProperties__ <code>{Object}</code>:
  Properties and methods directly on the constructor function. The most common property to set is [Map](#map-can-map).
  
1. __instanceProperties__ <code>{Object}</code>:
  Properties and methods on instances of this list type.
  
#### Map `{can-map}`

Specify the Map type used to make objects added to this list observable. 



##### <code>can-map</code>
When objects are added to a `List`, those objects are converted into can.Map instances. For example:

     var list = new List();
     list.push({name: "Justin"});

     var map = list.attr(0);
     map.attr("name") //-> "Justin"

By changing [Map](#map-can-map), you can specify a different type of Map instance to create. For example:

     var User = Map.extend({
       fullName: function(){
         return this.attr("first")+" "+this.attr("last")
       }
     });

     User.List = List.extend({
       Map: User
     }, {});

     var list = new User.List();
     list.push({first: "Justin", last: "Meyer"});

     var user = list.attr(0);
     user.fullName() //-> "Justin Meyer"


#### <code>list.attr()</code>


Gets an array of all the elements in this `List`.


- __returns__ <code>{Array}</code>:
  An array with all the elements in this List.
  

#### <code>list.attr(index)</code>


Reads an element from this `List`.


1. __index__ <code>{Number}</code>:
  The element to read.

- __returns__ <code>{*}</code>:
  The value at _index_.
  

#### <code>list.attr(index, value)</code>


Assigns _value_ to the index _index_ on this `List`, expanding the list if necessary.


1. __index__ <code>{Number}</code>:
  The element to set.
1. __value__ <code>{*}</code>:
  The value to assign at _index_.

- __returns__ <code>{}</code>:
  This list, for chaining.
  

#### <code>list.attr(elements[, replaceCompletely])</code>


Merges the members of _elements_ into this List, replacing each from the beginning in order. If _elements_ is longer than the current List, the current List will be expanded. If _elements_ is shorter than the current List, the extra existing members are not affected (unless _replaceCompletely_ is `true`). To remove elements without replacing them, use `[can-map::removeAttr removeAttr]`.


1. __elements__ <code>{Array}</code>:
  An array of elements to merge in.
  
1. __replaceCompletely__ <code>{bool}</code>:
  whether to completely replace the elements of List
  
  If _replaceCompletely_ is `true` and _elements_ is shorter than the List, the existing extra members of the List will be removed.
  

- __returns__ <code>{}</code>:
  This list, for chaining.
  

#### <code>list.filter(filterFunc, context)</code>



1. __filterFunc__ <code>{function(item, index, undefined)}</code>:
  A function to call with each element of the list. Returning `false` will remove the index.
1. __context__ <code>{Object}</code>:
  The object to use as `this` inside the callback.
  

#### <code>list.splice(index[, howMany[, ...newElements]])</code>


1. __index__ <code>{Number}</code>:
  where to start removing or inserting elements
  
1. __howMany__ <code>{Number}</code>:
  the number of elements to remove
   If _howMany_ is not provided, `splice` will remove all elements from `index` to the end of the List.
  
1. __newElements__ <code>{*}</code>:
  elements to insert into the List
  

- __returns__ <code>{Array}</code>:
  the elements removed by `splice`
  

#### <code>list.each( callback(item, index) )</code>


`each` iterates through the List, calling a function
for each element.

```js
var list = new List([1, 2, 3]);

list.each(function(elem){
	console.log(elem);
});
```


1. __callback__ <code>{function(*, Number)}</code>:
  the function to call for each element
  The value and index of each element will be passed as the first and second
  arguments, respectively, to the callback. If the callback returns false,
  the loop will stop. The callback is not invoked for List elements that were 
  never initialized.
  

- __returns__ <code>{}</code>:
  this List, for chaining
  

#### <code>list.reverse()</code>


`reverse` reverses the elements of the List in place.


- __returns__ <code>{[can-list](#new-listarray)}</code>:
  the List, for chaining
  

#### <code>list.map( callback(item, index, listReference), context )</code>



1. __callback__ <code>{function(*, Number, undefined)}</code>:
  A function to call with each
  element of the list.
1. __context__ <code>{Object}</code>:
  An optional object to use as `this` inside the callback.
  

- __returns__ <code>{}</code>:
  A new can.List instance.
  
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
