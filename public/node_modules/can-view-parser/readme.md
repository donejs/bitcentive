# can-view-parser

[![Build Status](https://travis-ci.org/canjs/can-view-parser.png?branch=master)](https://travis-ci.org/canjs/can-view-parser)

Parses html and magic tags.

- <code>[__can-view-parser__ function](#can-view-parser-function)</code>
  - <code>[parse(html, handler, [returnIntermediate])](#parsehtml-handler-returnintermediate)</code>
- <code>[ParseHandler Object](#parsehandler-object)</code>
  - <code>[start(tagName, unary)](#starttagname-unary)</code>
  - <code>[end(tagName, unary)](#endtagname-unary)</code>
  - <code>[close(tagName)](#closetagname)</code>
  - <code>[attrStart(attrName)](#attrstartattrname)</code>
  - <code>[attrEnd(attrName)](#attrendattrname)</code>
  - <code>[attrValue(value)](#attrvaluevalue)</code>
  - <code>[chars(value)](#charsvalue)</code>
  - <code>[comment(value)](#commentvalue)</code>
  - <code>[done()](#done)</code>

## API


## <code>__can-view-parser__ function</code>
Parse HTML and mustache tokens. 


### <code>parse(html, handler, [returnIntermediate])</code>


Parse an html string:

```js
var parser = require("can-view-parser");

var html = '<h1><span bob="phillips"></span><span bob="meyers"></span>' +
	'</h1>';

var bobs = {};
var curAttr;

parser(html, {
	attrStart: function(attrName){
		curAttr = attrName;
	},
	attrValue: function(value){
		bobs[curAttr] = value;
	}
});

for(var first in bobs) {
	var last = bobs[first];
	console.log("Hello", first, last);
}
```


1. __html__ <code>{String|Object}</code>:
  A mustache and html string to parse or an intermediate object the represents a previous parsing.
1. __handler__ <code>{Object}</code>:
  An object of callbacks.
1. __returnIntermediate__ <code>{Boolean}</code>:
  If true, returns a JS object representation of the parsing.
  
## ParseHandler `{Object}`

An object consisting of callback functions that handle stages in the parsing process. 



### <code>Object</code>


### <code>start(tagName, unary)</code>


Called when parsing a tag begins.


1. __tagName__ <code>{String}</code>:
  The name of the tag.
1. __unary__ <code>{Boolean}</code>:
  If this tag is unary (has no closing tag).
  

### <code>end(tagName, unary)</code>


Called at the end of parsing a tag.


1. __tagName__ <code>{String}</code>:
  The name of the tag.
1. __unary__ <code>{Boolean}</code>:
  If this tag is unary (has no closing tag).
  

### <code>close(tagName)</code>


Called when a closing tag is found. If no closing tag exists for this tag (because it is self-closing) this function will not be called.


1. __tagName__ <code>{String}</code>:
  The name of the tag.
  

### <code>attrStart(attrName)</code>


Called when an attribute is found on an element.


1. __attrName__ <code>{String}</code>:
  The name of the attribute.
  

### <code>attrEnd(attrName)</code>


Called at the end of parsing an attribute; after the [attrStart](#attrstartattrname) and [attrValue](#attrvaluevalue) functions have been called.


1. __attrName__ <code>{String}</code>:
  The name of the attribute.
  

### <code>attrValue(value)</code>


Called when an attribute's **value** has been found.


1. __value__ <code>{String}</code>:
  The value discovered associated with an attribute.
  

### <code>chars(value)</code>


Called when [CharacterData](https://developer.mozilla.org/en-US/docs/Web/API/CharacterData) is found within a tag.


1. __value__ <code>{String}</code>:
  The character data within the tag.
  

### <code>comment(value)</code>


Called when a [Comment](https://developer.mozilla.org/en-US/docs/Web/API/Comment) is found within a tag.


1. __value__ <code>{String}</code>:
  The Comment within the tag.
  

### <code>done()</code>


Called at the end of parsing the template.

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
