@function {Object} can-zone-storage.getItem
@parent can-zone-storage.methods

@signature `getItem(key)`

Stores keyed data in the current data store.

```js
var zoneStorage = require("can-zone-storage");

var test = zoneStorage.getItem('key-name') // test === undefined

var value = 'Store me';

zoneStorage.setItem('key-name', value);
zoneStorage.getItem('key-name') // test === 'Store me'

```

@param {String} key The key name from which the data will be retrieved.