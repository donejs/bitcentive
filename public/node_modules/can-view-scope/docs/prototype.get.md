@function can-view-scope.prototype.get get
@parent can-view-scope.prototype

@signature `scope.get(key [, options])`

Walks up the scope to find a value at `key`.  Stops at the first context where `key` has
a value.

```js
scope.get("first.name");
```

@param {can-stache.key} key A dot seperated path.  Use `"\."` if you have a
property name that includes a dot.

@return {*} The found value or undefined if no value is found.

@body

## Use

`scope.get(key)` looks up a value in the current scope's
context, if a value is not found, parent scope's context
will be explored.

    var list = [{name: "Justin"},{name: "Brian"}],
        justin = list[0];

    var curScope = new Scope(list).add(justin);

    curScope.get("name"); //-> "Justin"
    curScope.get("length"); //-> 2

Prefixing a key with `"./"` prevents any parent scope look ups.
Prefixing a key with one or more `"../"` shifts the lookup path
that many levels up.

    var list = [{name: "Justin"},{name: "Brian"}];
    list.name = "Programmers";
    list.surname = "CanJS";

    var justin = list[0];
    var brian = list[1];
    var curScope = new Scope(list).add(justin).add(brian);

    curScope.get("name"); //-> "Brian"
    curScope.get("surname"); //-> "CanJS"
    curScope.get("./surname"); //-> undefined
    curScope.get("../name"); //-> "Justin"
    curScope.get("../surname"); //-> "CanJS"
    curScope.get(".././surname"); //-> "undefined"
    curScope.get("../../name"); //-> "Programmers"
