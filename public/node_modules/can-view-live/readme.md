# can-view-live

[![Build Status](https://travis-ci.org/canjs/can-view-live.png?branch=master)](https://travis-ci.org/canjs/can-view-live)




- <code>[__can-view-live__ Object](#can-view-live-object)</code>
  - <code>[live.html(el, compute, [parentNode])](#livehtmlel-compute-parentnode)</code>
  - <code>[live.list(el, list, render, context, [parentNode])](#livelistel-list-render-context-parentnode)</code>
  - <code>[live.text(el, compute, [parentNode], [nodeList])](#livetextel-compute-parentnode-nodelist)</code>
  - <code>[live.attr(el, attributeName, compute)](#liveattrel-attributename-compute)</code>

## API

## can-view-live `{Object}`


Setup live-binding between the DOM and a compute manually.



### <code>Object</code>

- __An__ <code>{Object}</code>:
  object with the live-binding methods:
  [can-view-live.html](#livehtmlel-compute-parentnode), [can-view-live.list](#livelistel-list-render-context-parentnode), [can-view-live.text](#livetextel-compute-parentnode-nodelist),
  [can-view-live.attr](#liveattrel-attributename-compute) and [can-view-live.attrs].
  

### <code>live.html(el, compute, [parentNode])</code>


`live.html` is used to setup incremental live-binding on a block of html.

```js
// a compute that change's it's list
var greeting = compute(function(){
  return "Welcome <i>"+me.attr("name")+"</i>"
});

var placeholder = document.createTextNode(" ");
$("#greeting").append(placeholder);

live.html(placeholder, greeting);
```


1. __el__ <code>{HTMLElement}</code>:
  An html element to replace with the live-section.
  
1. __compute__ <code>{can.compute}</code>:
  A [can.compute] whose value is HTML.
  
1. __parentNode__ <code>{HTMLElement}</code>:
  An overwritable parentNode if `el`'s parent is
  a documentFragment.
  
  
  

### <code>live.list(el, list, render, context, [parentNode])</code>


Live binds a compute's list incrementally.

```js
// a compute that change's it's list
var todos = compute(function(){
  return new Todo.List({page: can.route.attr("page")})
})

var placeholder = document.createTextNode(" ");
$("ul#todos").append(placeholder);

can.view.live.list(
  placeholder,
  todos,
  function(todo, index){
    return "<li>"+todo.attr("name")+"</li>"
  });
```


1. __el__ <code>{HTMLElement}</code>:
  An html element to replace with the live-section.
  
1. __list__ <code>{can-compute|can-list|can-define/list/list}</code>:
  An observable list type.
  
1. __render__ <code>{function(index, index)}</code>:
  A function that when called with
  the incremental item to render and the index of the item in the list.
  
1. __context__ <code>{Object}</code>:
  The `this` the `render` function will be called with.
  
1. __parentNode__ <code>{HTMLElement}</code>:
  An overwritable parentNode if `el`'s parent is
  a documentFragment.
  
  
  

### <code>live.text(el, compute, [parentNode], [nodeList])</code>


Replaces one element with some content while keeping [can-view-live.nodeLists nodeLists] data correct.


### <code>live.attr(el, attributeName, compute)</code>


Keep an attribute live to a [can-compute].

```js
var div = document.createElement('div');
var compute = canCompute("foo bar");
live.attr(div,"class", compute);
```


1. __el__ <code>{HTMLElement}</code>:
  The element whos attribute will be kept live.
1. __attributeName__ <code>{String}</code>:
  The attribute name.
1. __compute__ <code>{can-compute}</code>:
  The compute.
  
  

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
