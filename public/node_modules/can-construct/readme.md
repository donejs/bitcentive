# can-construct

[![Build Status](https://travis-ci.org/canjs/can-construct.png?branch=master)](https://travis-ci.org/canjs/can-construct)

Easily build constructor functions.


- <code>[Construct.extend([name,] [staticProperties,] instanceProperties)](#constructextendname-staticproperties-instanceproperties)</code>
- <code>[constructorExtends Boolean](#constructorextends-boolean)</code>
- <code>[Construct.newInstance([...args])](#constructnewinstanceargs)</code>
- <code>[Construct.setup(base, fullName, staticProps, protoProps)](#constructsetupbase-fullname-staticprops-protoprops)</code>
- _can-construct.namespace_
- <code>[shortName String](#shortname-string)</code>
- <code>[constructor Object](#constructor-object)</code>
- <code>[construct.setup(...args)](#constructsetupargs)</code>
- <code>[construct.init(...args)](#constructinitargs)</code>

## API


## <code>Construct.extend([name,] [staticProperties,] instanceProperties)</code>


Extends `Construct`, or constructor functions derived from `Construct`,
to create a new constructor function. Example:

```js
var Animal = Construct.extend({
  sayHi: function(){
    console.log("hi")
  }
});

var animal = new Animal()
animal.sayHi();
```


1. __name__ <code>{String}</code>:
  Adds a name to the constructor function so
  it is nicely labeled in the developer tools. The following:

      Construct.extend("ConstructorName",{})

  returns a constructor function that will show up as `ConstructorName`
  in the developer tools.
  It also sets "ConstructorName" as [shortName](#shortname-string).

1. __staticProperties__ <code>{Object}</code>:
  Properties that are added the constructor
  function directly. For example:

  ```js
  var Animal = Construct.extend({
    findAll: function(){
      return can.ajax({url: "/animals"})
    }
  },{}); // need to pass an empty instanceProperties object

  Animal.findAll().then(function(json){ ... })
  ```

  The [static setup](#constructsetupbase-fullname-staticprops-protoprops) method can be used to
  specify inheritable behavior when a Constructor function is created.

1. __instanceProperties__ <code>{Object}</code>:
  Properties that belong to
  instances made with the constructor. These properties are added to the
  constructor's `prototype` object. Example:

      var Animal = Construct.extend({
  	  findAll: function() {
  		return can.ajax({url: "/animals"});
  	  }
      },{
        init: function(name) {
          this.name = name;
        },
        sayHi: function() {
          console.log(this.name," says hai!");
        }
      })
      var pony = new Animal("Gertrude");
      pony.sayHi(); // "Gertrude says hai!"

  The [init](#constructinitargs) and [setup](#constructsetupargs) properties
  are used for initialization.


- __returns__ <code>{function}</code>:
  The constructor function.

  ```js
  var Animal = Construct.extend(...);
  var pony = new Animal(); // Animal is a constructor function
  ```
## constructorExtends `{Boolean}`

  Toggles the behavior of a constructor function called
 without the `new` keyword to extend the constructor function or
 create a new instance.

 ```js
 var animal = Animal();
 // vs
 var animal = new Animal();
 ```




### <code>Boolean</code>


## <code>Construct.newInstance([...args])</code>



1. __args__ <code>{*}</code>:
  arguments that get passed to [setup](#constructsetupargs) and [init](#constructinitargs). Note
  that if [setup](#constructsetupargs) returns an array, those arguments will be passed to [init](#constructinitargs)
  instead.

- __returns__ <code>{class}</code>:
  instance of the class


## <code>Construct.setup(base, fullName, staticProps, protoProps)</code>


A static `setup` method provides inheritable setup functionality
for a Constructor function. The following example
creates a Group constructor function.  Any constructor
functions that inherit from Group will be added to
`Group.childGroups`.


    Group = Construct.extend({
      setup: function(Construct, fullName, staticProps, protoProps){
        this.childGroups = [];
        if(Construct !== Construct){
          this.childGroups.push(Construct)
        }
        Construct.setup.apply(this, arguments)
      }
    },{})
    var Flock = Group.extend(...)
    Group.childGroups[0] //-> Flock


1. __base__ <code>{}</code>:
  The base constructor that is being inherited from.
1. __fullName__ <code>{String}</code>:
  The name of the new constructor.
1. __staticProps__ <code>{Object}</code>:
  The static properties of the new constructor.
1. __protoProps__ <code>{Object}</code>:
  The prototype properties of the new constructor.

## shortName `{String}`


If you pass a name when creating a Construct, the `shortName` property will be set to the
name.



### <code>String</code>

## constructor `{Object}`


A reference to the constructor function that created the instance. This allows you to access
the constructor's static properties from an instance.



### <code>Object</code>


## <code>construct.setup(...args)</code>


A setup function for the instantiation of a constructor function.


1. __args__ <code>{*}</code>:
  The arguments passed to the constructor.


- __returns__ <code>{Array|undefined}</code>:
  If an array is returned, the array's items are passed as
  arguments to [init](#constructinitargs). The following example always makes
  sure that init is called with a jQuery wrapped element:

      WidgetFactory = Construct.extend({
          setup: function(element){
              return [$(element)]
          }
      })

      MyWidget = WidgetFactory.extend({
          init: function($el){
              $el.html("My Widget!!")
          }
      })

  Otherwise, the arguments to the
  constructor are passed to [init](#constructinitargs) and the return value of `setup` is discarded.


## <code>construct.init(...args)</code>


1. __args__ <code>{*}</code>:
  the arguments passed to the constructor (or the items of the array returned from [setup](#constructsetupargs))


## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
