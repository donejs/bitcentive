@function can-view-scope.prototype.set set
@parent can-view-scope.prototype

@signature `scope.set(key, value [, options])`

Tries to set `key` in the scope to `value`.  This looks for the first context in the value where
`key` can be set.  For example, if `key` is `"person.first.name"`, it will find the first
context where `person.first` is some type of Object whose `name` property can be set.

```js
scope.set("person.first.name", "Justin");
```

@param {can-stache.key} key A dot seperated path.  Use `"\."` if you have a
property name that includes a dot.

@param {*} value The value to be set.

@body
