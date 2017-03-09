# can-view-model

[![Build Status](https://travis-ci.org/canjs/can-view-model.png?branch=master)](https://travis-ci.org/canjs/can-view-model)

Gets or sets the view model of an element

- <code>[__can-view-model__ function](#can-view-model-function)</code>
  - <code>[canViewModel(element)](#canviewmodelelement)</code>
  - <code>[canViewModel(element, property)](#canviewmodelelement-property)</code>
  - <code>[canViewModel(element, property, value)](#canviewmodelelement-property-value)</code>

## API


## <code>__can-view-model__ function</code>
Gets the ViewModel of an [element](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement). 


### <code>canViewModel(element)</code>


Gets the map instance associated with **element**, creating one as a [can-util/js/types/types.DefaultMap] if it doesn't already exist, and returns the map.

```js
var vm = canViewModel(element);
```

1. __element__ <code>{HTMLElement}</code>:
  Any element in the DOM.
  

- __returns__ <code>{can-map|can-define/map/map|Object}</code>:
  The ViewModel associated with this elelement.
  

### <code>canViewModel(element, property)</code>


Gets the map instance associated with **element**, creating one as a [can-util/js/types/types.DefaultMap] if it doesn't already exist. Then gets the **property** inside of the ViewModel and returns that.

```
var foo = canViewModel(element, "foo");

console.log(foo); // -> "bar"
```


1. __element__ <code>{HTMLElement}</code>:
  Any element in the DOM.
1. __property__ <code>{String}</code>:
  The property to get from the ViewModel.
  

- __returns__ <code>{*}</code>:
  The value of the property on the ViewModel or undefined if the property doesn't exist.
  

### <code>canViewModel(element, property, value)</code>


Gets the map instance associated with **element**, creating one as a [can-util/js/types/types.DefaultMap] if it doesn't already exist. Sets the **property** on that map to **value**.

```js
canViewModel(element, "foo", "bar");

var foo = canViewModel(element, "foo");

console.log(foo); // -> "bar"
```


1. __element__ <code>{HTMLElement}</code>:
  ANy element in the DOM.
1. __property__ <code>{String}</code>:
  The property that is being set on the ViewModel.
1. __value__ <code>{*}</code>:
  The value being set on the property.
  

- __returns__ <code>{HTMLElement}</code>:
  The element.
   

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
