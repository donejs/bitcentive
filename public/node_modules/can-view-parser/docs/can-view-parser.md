@module {function} can-view-parser
@parent can-infrastructure
@description Parse HTML and mustache tokens.
@package ../package.json

@signature `parse(html, handler, [returnIntermediate])`

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

@param {String|Object} html A mustache and html string to parse or an intermediate object the represents a previous parsing.
@param {can-view-parser.ParseHandler}  handler An object of callbacks.
@param {Boolean} [returnIntermediate=false] If true, returns a JS object representation of the parsing.
