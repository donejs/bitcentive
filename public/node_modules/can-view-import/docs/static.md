@page can-view-import.pages.static Static Imports
@parent can-view-import.pages

Static imports reflect direct dependencies of the template. Most uses of [can-view-import] will be for static imports.

To make your import be static, it *must* be self closing like `/>`.

## Example

These `can-import` and ES6 import examples are equivalent:

```
<can-import from="mymodule" />
```

```
import from "mymodule";
```
