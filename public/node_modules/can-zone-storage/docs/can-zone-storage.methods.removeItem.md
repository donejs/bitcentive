@function {Object} can-zone-storage.removeItem
@parent can-zone-storage.methods

@signature `removeItem(key, value)`

Removes keyed data from the current data store.

```js
var zoneStorage = require("can-zone-storage");

zoneStorage.removeItem('key-name');
```

@param {String} key The key name that will be deleted from the data store.
