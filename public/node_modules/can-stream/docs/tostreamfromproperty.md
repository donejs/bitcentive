@function can-stream.toStreamFromProperty toStreamFromProperty
@parent can-stream.fns


@description Creates a stream on a {Observable} object that gets updated whenever the property value on the observable changes.

@signature `canStream.toStreamFromProperty( obs, propName )`

  Creates a stream based on property value change on observable

  ```js
  var map = {
      foo: "bar"
  };
  var stream = canStream.toStreamFromProperty(map, 'foo');

  stream.onValue(function(value){
    console.log(value); // -> foobar
  });

  map.foo = "foobar";
  ```
  @param {Observable} An observable object
  @param {String} property name

  @return {Stream} A [Kefir](https://rpominov.github.io/kefir/) stream.
