# bitcentive

> Royalties

[![Build Status](https://travis-ci.org/donejs/bitcentive.svg?branch=master)](https://travis-ci.org/donejs/bitcentive)

## About

Bitcentive uses [DoneJS](http://donejs.com) and  [Feathers](http://feathersjs.com), two open source web frameworks for building modern real-time applications.

## Getting Started

Getting up and running is as easy as 1, 2, 3.

1. Make sure you have [NodeJS](https://nodejs.org/), [npm](https://www.npmjs.com/) and [MongoDb](https://www.mongodb.com/) installed.

#### Installing MongoDB on OSX

On a Mac, the easiest way to install and configure [MongoDB](https://www.mongodb.com/)
is using the [brew](https://brew.sh/) utility:

```
brew install mongodb
```

Pay special attention to the end of the [brew](https://brew.sh/) command's
output, which includes instructions on how to start `mongodb`:

To have launchd start mongodb now and restart at login:
  ```brew services start mongodb```
Or, if you don't want/need a background service you can just run:
  ``mongod --config /usr/local/etc/mongod.conf```

We recommend the `brew services` option. If desired, `mongodb` can be
stopped and uninstalled by running:

```
brew uninstall mongodb
```


2. Install your dependencies
    
    ```
    cd path/to/bitcentive; npm install
    ```     

3. Start your app
    
    ```
    npm run develop
    ```

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g feathers-cli             # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers generate model                 # Generate a new Model
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Changelog

__0.1.0__

- Initial release

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
