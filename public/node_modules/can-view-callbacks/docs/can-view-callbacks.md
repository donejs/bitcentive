@module {{}} can-view-callbacks can-view-callbacks
@parent can-infrastructure
@group can-view-callbacks/methods methods
@group can-view-callbacks/types types
@package ../package.json

@description Registered callbacks for behaviors

@body

Allows registering callback functions that will be called when tags and attributes are rendered in [can-view-target].

## Registering tags

[can-view-callbacks.tag callbacks.tag] allows you to register a tag that custom behavior will be attached to.

This will style elements using the *blue-el* tag with a blue background.

```js
var callbacks = require("can-view-callbacks");

callbacks.tag("blue-el", function(el){
	el.style.background = "blue";
});
```

```html
<blue-el><p>Some content with a blue background, gross!</p></blue-el>
```

## Registering attributes

Similarly you can register a callback for an attribute. Here we are using a regular expression to match an attribute that starts with `foo-`:

```js
callbacks.attr(/foo-[\w\.]+/, function(el, attrData){
	// Get the part after foo-
	var attrValue = attrData.attributeName.substr(4);

	// Set it's content
	el.textContent = attrValue;
});
```

So that:

```html
<div foo-bar></div>
```

Renders as:

```html
<div foo-bar>bar</div>
```
