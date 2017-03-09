@function can-view-callbacks.attr attr
@parent can-view-callbacks/methods

Register custom behavior for an attribute.

@signature `callbacks.attr(attributeName, attrHandler(el, attrData))`

Registers the `attrHandler` callback when `attributeName` is found
in a template.

```js
var canViewCallbacks = require("can-view-callbacks");

canViewCallbacks.attr("show-when", function(el, attrData){
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

	compute.on("change", showOrHide);
	showOrHide();

	domEvents.addEventListener.call( el, "removed", function onremove(){
		compute.off("change", showOrHide);
		domEvents.removeEventListener.call("removed", onremove);
	});
});
```



@param {String|RegExp} attributeName A lower-case attribute name or regular expression
that matches attribute names. Examples: `"my-fill"` or `/my-\w/`.  

@param {function(HTMLElement,can-view-callbacks.attrData)} attrHandler(el, attrData)
A function that adds custom behavior to `el`.  

@body

## Use

`canViewCallbacks.attr` is used to add custom behavior to elements that contain a
specified html attribute. Typically it is used to mixin behavior (whereas
[can-view-callbacks.tag] is used to define behavior).

The following example adds a jQueryUI tooltip to any element that has
a `tooltip` attribute like `<div tooltip="Click to edit">Name</div>`.


@demo demos/can-view-callbacks/tooltip.html

## Listening to attribute changes

In the previous example, the content of the tooltip was static. However,
it's likely that the tooltip's value might change. For instance, the template
might want to dynamically update the tooltip like:

    <button tooltip="{{deleteTooltip}}">
      Delete
    </button>

Where `deleteTooltip` changes depending on how many users are selected:

    deleteTooltip: function(){
      var selectedCount = selected.length;
      if(selectedCount) {
        return "Delete "+selectedCount+" users";
      } else {
        return "Select users to delete them.";
      }
    }


The [can-util/dom/events/attributes/attributes attributes] event can be used to listen to when
the toolip attribute changes its value like:

```js
canViewCallbacks.attr("tooltip", function( el, attrData ) {
	// A helper that updates or sets up the tooltip
	var updateTooltip = function(){
		$(el).tooltip({
			content: el.getAttribute("tooltip"),
			items: "[tooltip]"
		})
	}
	// When the tooltip attribute changes, update the tooltip
	domEvents.addEventListener.call(el, "attributes", function(ev){
		if(ev.attributeName === "tooltip") {
			updateTooltip();
		}
	});
	// Setup the tooltip
	updateTooltip();

});
```

To see this behavior in the following demo, hover the mouse over the "Delete" button.  Then
select some users and hover over the "Delete" button again:

@demo demos/can-view-callbacks/dynamic_tooltip.html


## Reading values from the scope.

It's common that attribute mixins need complex, observable data to
perform rich behavior. The attribute mixin is able to read
data from the element's [can.view.Scope scope]. For example,
__toggle__ and __fade-in-when__ will need the value of `showing` in:

    <button toggle="showing">
      {{#showing}}Show{{else}}Hide{{/showing}} more info</button>
    <div fade-in-when="showing">
      Here is more info!
    </div>

These values can be read from [can-view-callbacks.attrData]'s scope like:

    attrData.scope.attr("showing")

But often, you want to update scope value or listen when the scope value
changes. For example, the __toggle__ mixin might want to update `showing`
and the __fade-in-when__ mixin needs to know when
the `showing` changes.  Both of these can be achived by
using [can-view-scope::compute compute] to get a get/set compute that is
tied to the value in the scope:

    var showing = attrData.scope.compute("showing")

This value can be written to by `toggle`:


    canViewCallbacks.attr("toggle", function(el, attrData){

      var attrValue = el.getAttribute("toggle")
          toggleCompute = attrData.scope.compute(attrValue);

      $(el).click(function(){
        toggleCompute(! toggleCompute() )
      })

    })

Or listened to by `fade-in-when`:

    canViewCallbacks.attr("fade-in-when", function( el, attrData ) {
      var attrValue = el.getAttribute("fade-in-when");
          fadeInCompute = attrData.scope.compute(attrValue),
          handler = function(ev, newVal, oldVal){
            if(newVal && !oldVal) {
              $(el).fadeIn("slow")
            } else if(!newVal){
              $(el).hide()
            }
          }

      fadeInCompute.on("change",handler);

      ...
    });

When you listen to something other than the attribute's element, remember to
unbind the event handler when the element is [can-util/dom/events/removed/removed removed] from the page:

```js
domEvents.addEventListener.call(el,"removed", function(){
	fadeInCompute.off(handler);
});
```

@demo demos/can-view-callbacks/fade_in_when.html

## When to call

`canViewCallbacks.attr` must be called before a template is processed. When [using `can.view` to create a renderer function](http://canjs.com/docs/can.view.html#sig_can_view_idOrUrl_), `canViewCallbacks.attr` must be called before the template is loaded, not simply before it is rendered.

		//Call canViewCallbacks.attr first
		canViewCallbacks.attr('tooltip', tooltipFunction);
		//Preload a template for rendering
		var renderer = stache("<div tooltip='Hi There'>...</div>");
		//No calls to canViewCallbacks.attr after this will be used by `renderer`
