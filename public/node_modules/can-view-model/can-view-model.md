@module {function} can-view-model can-view-model
@parent can-infrastructure
@package ./package.json

@description Gets the ViewModel of an [element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

@signature `canViewModel(element)`

Gets the map instance associated with **element**, creating one as a [can-util/js/types/types.DefaultMap] if it doesn't already exist, and returns the map.

```js
var vm = canViewModel(element);
```
@param {HTMLElement} element Any element in the DOM.

@return {can-map|can-define/map/map|Object} The ViewModel associated with this elelement.

@signature `canViewModel(element, property)`

Gets the map instance associated with **element**, creating one as a [can-util/js/types/types.DefaultMap] if it doesn't already exist. Then gets the **property** inside of the ViewModel and returns that.

```
var foo = canViewModel(element, "foo");

console.log(foo); // -> "bar"
```

@param {HTMLElement} element Any element in the DOM.
@param {String} property The property to get from the ViewModel.

@return {*} The value of the property on the ViewModel or undefined if the property doesn't exist.

@signature `canViewModel(element, property, value)`

Gets the map instance associated with **element**, creating one as a [can-util/js/types/types.DefaultMap] if it doesn't already exist. Sets the **property** on that map to **value**.

```js
canViewModel(element, "foo", "bar");

var foo = canViewModel(element, "foo");

console.log(foo); // -> "bar"
```

@param {HTMLElement} element ANy element in the DOM.
@param {String} property The property that is being set on the ViewModel.
@param {*} value The value being set on the property.

@return {HTMLElement} The element.

@body

## Use

**can-view-model** is used to get and set properties on an element's ViewModel. Each element in the DOM can have an associated ViewModel. An example of this is a [can-component] and it's associated [can-component.prototype.ViewModel].

This shows a Component and getting its ViewModel:

```html
<my-tabs>
 ...
</my-tabs>
```

```js
var canViewModel = require("can-view-model");

var element = document.querySelector("my-tabs");
var vm = canViewModel(element);
```

The other signatures provide the ability to get and set properties on the ViewModel. For example, this sets the "foo" property on a component's viewModel:

```js
var canViewModel = require("can-view-model");

var element = document.querySelector("my-tabs");
var vm = canViewModel(element);

canViewModel(element, "foo", "bar");

console.log(vm.foo, "bar");
```

## Setting an element's ViewModel

One thing that can-view-model does ***not*** do is provide a way to set what an element's ViewModel should be. To do that, use [can-util/dom/data/data] instead like so:

```js
var domData = require("can-util/dom/data/data");
var DefineMap = require("can-define/map/map");

var element = document.querySelector("#my-id");

var myVm = new DefineMap();

domData.set.call(element, "viewModel", myVm);
```
