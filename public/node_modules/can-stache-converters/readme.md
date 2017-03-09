# can-stache-converters

[![Build Status](https://travis-ci.org/canjs/can-stache-converters.png?branch=master)](https://travis-ci.org/canjs/can-stache-converters)

A set of common [stache converters](http://canjs.github.io/canjs/doc/can-stache.registerConverter.html) to use with forms in your application.

  - <code>[boolean-to-inList(item, list)](#boolean-to-inlistitem-list)</code>
  - <code>[string-to-any(~item)](#string-to-anyitem)</code>
  - <code>[not(~value)](#notvalue)</code>
  - <code>[index-to-selected(~item, list)](#index-to-selecteditem-list)</code>
  - <code>[either-or(~chosen, a, b)](#either-orchosen-a-b)</code>

## API


### <code>boolean-to-inList(item, list)</code>


When the getter is called, returns true if **item** is within the **list**, determined using `.indexOf`.

When the setter is called, if the new value is truthy then the item will be added to the list using `.push`; if it is falsey the item will removed from the list using `.splice`.

```handlebars
<input type="checkbox" {($value)}="boolean-to-inList(item, list)" />
```


1. __item__ <code>{*}</code>:
  The item to which to check
1. __list__ <code>{can-define/list/list|can-list|Array}</code>:
  The list

- __returns__ <code>{can-compute}</code>:
  A compute that will be used by [can-stache-bindings] as a getter/setter when the element's value changes.
  

### <code>string-to-any(~item)</code>


When the getter is called, gets the value of the compute and calls `.toString()` on that value.

When the setter is called, takes the new value and converts it to the primitive value using [can-util/js/string-to-any/string-to-any] and sets the compute using that converted value.

```handlebars
<select {($value)}="string-to-any(~favePlayer)">
  <option value="23">Michael Jordan</option>
	<option value="32">Magic Johnson</option>
</select>
```


1. __item__ <code>{can-compute}</code>:
  A compute holding a primitive value.

- __returns__ <code>{can-compute}</code>:
  A compute that will be used by [can-stache-bindings] as a getter/setter when the element's value changes.
  

### <code>not(~value)</code>


When the getter is called, gets the value of the compute and returns the negation.

When the setter is called, sets the compute's value to the negation of the new value derived from the element.

*Note* that `not` needs a compute so that it can update the scope's value when the setter is called.

```handlebars
<input type="checkbox" {($checked)}="not(~val)" />
```


1. __value__ <code>{can-compute}</code>:
  A value stored in a [can-compute].

- __returns__ <code>{can-compute}</code>:
  A compute that will be two-way bound by [can-stache-bindings] as a getter/setter on the element.
  

### <code>index-to-selected(~item, list)</code>


When the getter is called, returns the index of the passed in item (which should be a [can-compute] from the provided list.

When the setter is called, takes the selected index value and finds the item from the list with that index and passes that to set the compute's value.

```handlebars
<select {($value)}="index-to-selected(~person, people)">

	{{#each people}}

		<option value="{{%index}}">{{name}}</option>

	{{/each}}

</select>
```


1. __item__ <code>{can-compute}</code>:
  A compute whose item is in the list.
1. __list__ <code>{can-define/list/list|can-list|Array}</code>:
  A list used to find the `item`.

- __returns__ <code>{can-compute}</code>:
  A compute that will be two-way bound to the select's value.
  

### <code>either-or(~chosen, a, b)</code>


When the getter is called, gets the value of the **chosen** compute and if it is equal to **a** returns true, otherwise it returns false.

When the setter is called, if the new value is truthy, sets the **chosen** [can-compute] to **a**'s value, otherwise sets it to **b**'s value.

```handlebars
<span>Favorite superhero:</span>
<input type="checkbox" {($checked)}="either-or(~chosen, 'Batman', 'Superman')"> Batman?
```


1. __chosen__ <code>{can-compute}</code>:
  A compute where the chosen value (between `a` and `b` is stored). When the setter is called, this compute's value will be updated.
  
1. __a__ <code>{*}</code>:
  The `true` value. If the checkbox is checked, then **a**'s value will be stored in the **chosen** compute.
  
1. __b__ <code>{*}</code>:
  The `false` value. If the checkbox is unchecked, then **b**'s value will be stored in the **chosen** compute.
  

- __returns__ <code>{can-compute}</code>:
  A compute that will be used by [can-stache-bindings] as a getter/setter bound to the element.

  
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
