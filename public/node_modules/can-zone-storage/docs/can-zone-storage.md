@module {Object} can-zone-storage
@parent can-ecosystem
@description Implement Zone-safe memory-based storage
@group can-zone-storage.methods 0 methods
@group can-zone-storage.properties 1 properties
@package ../package.json

@signature `define(prototype, propDefinitions)`

Implement a Zone-safe memory-based storage solution.  This is especially useful for Server Side Rendering (SSR).

```js
var zoneStorage = require("can-zone-storage");

var value = 'Store me';

zoneStorage.setItem('key-name', value);

zoneStorage.getItem('key-name') === 'Store me' // --> true

zoneStorage.removeItem('key-name');
```

@body

## Use

`can-zone-storage` provides a Zone-safe method of storing data for a user.

It implements three of the methods from the WebStorage Interface:
 - [can-zone-storage.setItem setItem] stores keyed data.
 - [can-zone-storage.getItem getItem] retrieves keyed data.
 - [can-zone-storage.removeItem removeItem] deletes keyed data.

One additional method, [can-zone-storage.getStore getStore], allows you to retrieve the current data store and inspect it directly.

## Zone Safe

Done-SSR, the Server Side Rendering solution built into DoneJS, uses Zones to increase performance.  Other web servers will completely rebuild the app for every incoming request.  Done-SSR uses Zones to keep the app running in memory and share it between all incoming connections.  

Sharing modules between connections is often fine, but some data should not be shared.  Private data belonging to one user should not reach another user on the same server.  Can-Zone provides each incoming request with a `CanZone.current` object that is not shared.  The `can-zone-storage` module detects if CanZone is in the global namespace.  If it *is* found, it uses the `CanZone.current.data` object as the data store.  If `CanZone` is not found, an internal memory store is used.