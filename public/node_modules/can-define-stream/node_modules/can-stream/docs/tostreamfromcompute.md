@function can-stream.toStreamFromCompute toStreamFromCompute
@parent can-stream.fns


@description Creates a stream from [can-compute] instance which gets updated whenever the compute changes.

@signature `canStream.toStreamFromCompute( compute )`

  Convert a compute into a stream:

  ```js
  var canStream = require('can-stream');
  var compute = require('can-compute');
  var foo = 'bar';
  var compute1 = compute(foo);

  var stream = canStream.toStreamFromCompute(compute1);

  stream.onValue(function(value) {
    console.log(value); // -> baz
  });

  compute1('baz');
  ```

  @param {can-compute} compute instance of [can-compute].

  @return {Stream} A [Kefir](https://rpominov.github.io/kefir/) stream.
