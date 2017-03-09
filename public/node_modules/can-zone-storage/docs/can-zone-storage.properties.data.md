@property {Object} can-zone-storage.data data
@parent can-zone-storage.properties
@description Implement Zone-safe memory-based storage

@type {Object}

The `data` property of `can-zone-storage` is a plain old JavaScript object.  It is used as the memory-based storage when window.CanZone is undefined (when the [can-zone] module hasn't been loaded).  If `window.CanZone` is found (when [can-zone] is used), the `CanZone.current.data` object is used, instead, for Zone-safe storage.

```js
var zoneStorage = require("can-zone-storage");

console.log(zoneStorage.data) // --> {}

zoneStorage.setItem('test', 123);

console.log(zoneStorage.data) // --> {test: 123}
```
