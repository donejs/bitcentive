# can-map

[![Build Status](https://travis-ci.org/canjs/can-map.png?branch=master)](https://travis-ci.org/canjs/can-map)

Observable Objects


- <code>[__can-map__ ](#can-map-)</code>
  - <code>[new Map([props])](#new-mapprops)</code>
  - <code>[Map.extend([name,] [staticProperties,] instanceProperties)](#mapextendname-staticproperties-instanceproperties)</code>
    - <code>[map.attr()](#mapattr)</code>
    - <code>[map.attr(key)](#mapattrkey)</code>
    - <code>[map.attr(key, value)](#mapattrkey-value)</code>
    - <code>[map.attr(obj[, removeOthers])](#mapattrobj-removeothers)</code>
    - <code>[map.bind(eventType, handler)](#mapbindeventtype-handler)</code>
    - <code>[map.compute(attrName)](#mapcomputeattrname)</code>
    - <code>[DEFAULT-ATTR *](#default-attr-)</code>
    - <code>[map.each( callback(item, propName ) )](#mapeach-callbackitem-propname--)</code>
    - <code>[map.removeAttr(attrName)](#mapremoveattrattrname)</code>
    - <code>[map.serialize()](#mapserialize)</code>
    - <code>[map.unbind(eventType[, handler])](#mapunbindeventtype-handler)</code>
    - <code>[Map.keys(map)](#mapkeysmap)</code>

## API


## <code>__can-map__ </code>
Create observable objects. 


### <code>new Map([props])</code>


Creates a new instance of can.Map.


1. __props__ <code>{Object}</code>:
  Properties and values to seed the Observe with.

- __returns__ <code>{can.Map}</code>:
  An instance of `can.Map` with the properties from _props_.
  

### <code>Map.extend([name,] [staticProperties,] instanceProperties)</code>


Creates a new extended constructor function.



#### <code>map.attr()</code>


Gets a collection of all the properties in this `Map`.


- __returns__ <code>{Object}</code>:
  an object with all the properties in this `Map`.
  

#### <code>map.attr(key)</code>


Reads a property from this `Map`.


1. __key__ <code>{String}</code>:
  the property to read

- __returns__ <code>{*}</code>:
  the value assigned to _key_.
  

#### <code>map.attr(key, value)</code>


Assigns _value_ to a property on this `Map` called _key_.


1. __key__ <code>{String}</code>:
  the property to set
1. __the__ <code>{*}</code>:
  value to assign to _key_.

- __returns__ <code>{can.Map}</code>:
  this Map, for chaining
  

#### <code>map.attr(obj[, removeOthers])</code>


Assigns each value in _obj_ to a property on this `Map` named after the
corresponding key in _obj_, effectively merging _obj_ into the Map.


1. __obj__ <code>{Object}</code>:
  a collection of key-value pairs to set.
  If any properties already exist on the `Map`, they will be overwritten.
  
1. __removeOthers__ <code>{bool}</code>:
  whether to remove keys not present in _obj_.
  To remove keys without setting other keys, use `[can.Map::removeAttr removeAttr]`.
  

- __returns__ <code>{can.Map}</code>:
  this Map, for chaining
  

#### <code>map.bind(eventType, handler)</code>



1. __eventType__ <code>{String}</code>:
  the type of event to bind this handler to
1. __handler__ <code>{function}</code>:
  the handler to be called when this type of event fires
  The signature of the handler depends on the type of event being bound. See below
  for details.

- __returns__ <code>{can.Map}</code>:
  this Map, for chaining
  

#### <code>map.compute(attrName)</code>


1. __attrName__ <code>{String}</code>:
  the property to bind to

- __returns__ <code>{can-compute}</code>:
  a [can-compute] bound to _attrName_
  
#### DEFAULT-ATTR `{*}`

Specify a default property and value. 



##### <code>*</code>
A value of any type other than a function that will
be set as the `DEFAULT-ATTR` attribute's value.


#### <code>map.each( callback(item, propName ) )</code>


`each` iterates through the Map, calling a function
for each property value and key.


1. __callback__ <code>{function(item, propName)}</code>:
  the function to call for each property
  The value and key of each property will be passed as the first and second
  arguments, respectively, to the callback. If the callback returns false,
  the loop will stop.
  

- __returns__ <code>{[can-map](#new-mapprops)}</code>:
  this Map, for chaining
  

#### <code>map.removeAttr(attrName)</code>


1. __attrName__ <code>{String}</code>:
  the name of the property to remove

- __returns__ <code>{*}</code>:
  the value of the property that was removed
  

#### <code>map.serialize()</code>


Get the serialized Object form of the map.  Serialized
data is typically used to send back to a server.


    o.serialize() //-> { name: 'Justin' }


Serialize currently returns the same data
as [can.Map.prototype.attrs].  However, in future
versions, serialize will be able to return serialized
data similar to [can.Model].  The following will work:


    new Map({time: new Date()})
        .serialize() //-> { time: 1319666613663 }



- __returns__ <code>{Object}</code>:
  a JavaScript Object that can be
  serialized with `JSON.stringify` or other methods.
  

#### <code>map.unbind(eventType[, handler])</code>


1. __eventType__ <code>{String}</code>:
  the type of event to unbind, exactly as passed to `bind`
1. __handler__ <code>{function}</code>:
  the handler to unbind
  
  ```js
  var map = new Map({ a: 1 });
  
  function log(){
  	console.log("val", map.attr("a");
  }
  
  map.bind("change", log);
  
  map.attr("a", 2);
  
  // Bind callback called.
  map.unbind("change", log);
  ```
  

#### <code>Map.keys(map)</code>


```js
var people = new Map({
		a: 'Alice',
		b: 'Bob',
		e: 'Eve'
});

Map.keys(people); // ['a', 'b', 'e']
```


1. __map__ <code>{[can-map](#new-mapprops)}</code>:
  the `Map` to get the keys from

- __returns__ <code>{Array}</code>:
  array An array containing the keys from _map_.
  
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
