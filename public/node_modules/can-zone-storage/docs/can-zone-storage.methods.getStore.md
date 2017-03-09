@function {Object} can-zone-storage.getStore
@parent can-zone-storage.methods

@signature `getStore()`

Retrieves the current store.  

If the [can-zone] library has been imported, `getStore` returns the `CanZone.current.data` object.

```js
var zoneStorage = require("can-zone-storage");
var Zone = require("can-zone");
var store = zoneStorage.getStore();

store === window.CanZone.current.data // true
```

If the [can-zone] library has NOT been imported, `getStore` returns the internal [can-zone-storage.data] object.

```js
var zoneStorage = require("can-zone-storage");
var store = zoneStorage.getStore();

store === zoneStorage.data // true
```
