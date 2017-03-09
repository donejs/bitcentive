@function can-view-scope.prototype.add add
@parent can-view-scope.prototype

@signature `scope.add(context [,meta])`

Creates a new scope and sets the current scope to be the parent.

```js
var scope = new Scope([
   {name:"Chris"},
   {name: "Justin"}
]).add({name: "Brian"});
scope.get("name") //-> "Brian"
```

@param {*} context The context to add on top of the current scope.
@param {can-view-scope/Meta} meta A meta option that can be used to configure special behaviors of this context.

@body

## Use

`scope.add(context)` creates a new scope object that
first looks up values in context and then in the
parent `scope` object.

    var list = [{name: "Justin"},{name: "Brian"}],
        justin = list[0];

    var curScope = new Scope(list).add(justin);

    curScope.get("name") //-> "Justin"
    curScope.get("length") //-> 2
