[![Build Status](https://travis-ci.org/canjs/can-zone-storage.svg?branch=master)](https://travis-ci.org/canjs/can-zone-storage)

# can-zone-storage

Implement a Zone-safe memory-based storage solution.  This is especially useful for creating modules that are compatible with Done-SSR (Server Side Rendering).

```js
var zoneStorage = require("can-zone-storage");

var value = 'Store me';

zoneStorage.setItem('key-name', value);

zoneStorage.getItem('key-name') === 'Store me' // --> true

zoneStorage.removeItem('key-name');
```

## Zone Safe

Done-SSR, the Server Side Rendering solution built into DoneJS, uses Zones to increase performance.  Other web servers will completely rebuild the app from scratch for every incoming request.  Done-SSR uses Zones to keep the app running in memory and share it between all incoming connections.

Sharing modules between connections is often fine, but some data should not be shared.  Private data belonging to one user should not reach another user on the same server.  Can-Zone provides each incoming request with a `CanZone.current` object that is not shared.  The `can-zone-storage` module detects if CanZone is in the global namespace.  If found, this module uses the `CanZone.current.data` object as the data store.  If `CanZone` is not found, an internal memory store is used.
