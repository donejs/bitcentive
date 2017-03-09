@module {function} can-view-scope
@parent can-infrastructure
@inherits can-construct
@test can/view/scope/test.html
@group can-view-scope.static static
@group can-view-scope.prototype prototype
@group can-view-scope.types types
@package ../package.json

@description Create a lookup node for [can-mustache.key keys].

@signature `new Scope(context, [parent], [meta] )`

@release 2.0.1


@param {*} context A value that represents the
current context. This is often an object or observable and is the first
place a `key` is looked up.

@param {can-view-scope} [parent] The parent scope. If a `key` value
is not found in the current scope, it will then look in the parent
scope.

@param {can-view-scope/Meta} [meta] A configuration object that
can specify special behavior of the context.

@return {can-view-scope} Returns a scope instance.

@body

## Use

A [can-view-scope] represents a lookup context and parent contexts
that can be used to lookup a [can-stache.key key] value.

If no parent scope is provided, only the scope's context will be
explored for values.  For example:

    var data = {name: {first: "Justin"}},
    	scope = new Scope(data);

    scope.get("name.first") //-> "Justin"
    scope.get("length")     //-> undefined

However, if a `parent` scope is provided, key values will be
searched in the parent's context after the initial context is explored.  For example:

    var list = [{name: "Justin"},{name: "Brian"}],
    	justin = list[0];

    var listScope = new Scope(list),
    	curScope = new Scope(justin, listScope)

    curScope.get("name") //-> "Justin"
    curScope.get("length") //-> 2

Use [can-view-scope::add add] to easily create a new scope from a parent scope like:


    var list = [{name: "Justin"},{name: "Brian"}],
    	justin = list[0];

    var curScope = new Scope(list).add(justin);

    curScope.get("name") //-> "Justin"
    curScope.get("length") //-> 2
