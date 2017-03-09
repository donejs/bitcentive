# can-view-callbacks

[![Build Status](https://travis-ci.org/canjs/can-view-callbacks.png?branch=master)](https://travis-ci.org/canjs/can-view-callbacks)

Registered callbacks for behaviors


- <code>[__can-view-callbacks__ Object](#can-view-callbacks-object)</code>
  - <code>[callbacks.tag(tagName, tagHandler(el, tagData))](#callbackstagtagname-taghandlerel-tagdata)</code>
    - <code>[tagData Object](#tagdata-object)</code>
  - <code>[callbacks.attr(attributeName, attrHandler(el, attrData))](#callbacksattrattributename-attrhandlerel-attrdata)</code>
    - <code>[attrData Object](#attrdata-object)</code>

## API

## can-view-callbacks `{Object}`

Registered callbacks for behaviors 



### <code>Object</code>


### <code>callbacks.tag(tagName, tagHandler(el, tagData))</code>


Registers the `tagHandler` callback when `tagName` is found 
in a template. 

```js
var $ = require("jquery");
require("jquery-datepicker");
var callbacks = require("can-view-callbacks");

callbacks.tag("date-picker", function(el){
	$(el).datePicker();
});
```


1. __tagName__ <code>{String}</code>:
  A lower-case, hypenated or colon-seperated html 
  tag. Example: `"my-widget"` or `"my:widget"`.  It is considered a best-practice to 
  have a hypen or colon in all custom-tag names.
  
1. __tagHandler__ <code>{function(el, tagData)}</code>:
  
  
  Adds custom behavior to `el`.  If `tagHandler` returns data, it is used to 
  render `tagData.subtemplate` and the result is inserted as the childNodes of `el`.
  
#### tagData `{Object}`


The data passed to [tag](#callbackstagtagname-taghandlerel-tagdata).



##### <code>Object</code>

- __subtemplate__ <code>{can.view.renderer}</code>:
  If the special tag has content,
  the content can be rendered with subtemplate.  For example:
  
      callbacks.tag("foo-bar", function(el, tagData){
        var frag = tagData.subtemplate(tagData.scope, tagData.options);
        $(el).html(frag);
      })
      
- __scope__ <code>{can-view-scope}</code>:
  The scope of the element.  
  
- __options__ <code>{can.view.Options}</code>:
  The mustache helpers and other non-data values passed to the template.
  

### <code>callbacks.attr(attributeName, attrHandler(el, attrData))</code>


```js
var callbacks = require("can-view-callbacks");

callbacks.attr("show-when", function(el, attrData){
	var prop = el.getAttribute("show-when");
	var compute = attrData.compute(prop);

	var showOrHide = function(){
		var val = compute();
		if(val) {
			el.style.display = 'block';
		} else {
			el.style.display = 'hidden';
		}
	};

	compute.bind("change", showOrHide);
	showOrHide();

	el.addEventListener("removed", function onremove(){
		compute.unbind("change", showOrHide);
		el.removeEventListener("removed", onremove);
	});
});
```


1. __attributeName__ <code>{String|RegExp}</code>:
  A lower-case attribute name or regular expression
  that matches attribute names. Examples: `"my-fill"` or `/my-\w/`.  
  
1. __attrHandler__ <code>{function(el, attrData)}</code>:
  
  
  A function that adds custom behavior to `el`.  
  
#### attrData `{Object}`


The data provided to [can.view-callbacks.attr].



##### <code>Object</code>

- __scope__ <code>{can-view-scope}</code>:
  The scope of the element.
  
- __options__ <code>{can.view.Options}</code>:
  The mustache helpers and other non-data values passed to the template.
  
- __attributeName__ <code>{String}</code>:
  The attribute name that was matched.
  
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
