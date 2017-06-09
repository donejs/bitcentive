# bitcentive

> Royalties

[![Build Status](https://travis-ci.org/donejs/bitcentive.svg?branch=staging)](https://travis-ci.org/donejs/bitcentive)

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
  ```mongod --config /usr/local/etc/mongod.conf```

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

## Migrations

Please read the [migration docs](./migrations/README.md).

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

## Logging in with GitHub

The bitcentive demo app allows Authenticated login using [GitHubs OAuth api](https://developer.github.com/v3/oauth/).

When you run your demo locally, there are some steps you are going to need to take, so that you can *log in* to the app using your github account.

#### 1. Register your application on GitHub
Go to the [GitHub application registration form](https://github.com/settings/applications/new) and fill out the form.

You can fill out every piece of information however you like, except the **Authorization callback URL**. This is easily the most important piece to setting up your application. It's the callback URL that GitHub returns the user to after successful authentication. Assuming you are using all the config from the repo unchanged, you should set this to `http://localhost:3030/auth/github/callback`.

#### 2. Configure your Client ID and Client Secret
After registering your application with GitHub, you will be provided a **Client ID** and a **Client Secret** token. **You will need to set these values in your configuration for your app to work properly**.

Open the json file at `/config/default.json` and find the `github.clientID` property and put your **Client ID** as the value there.

The **GitHub Client Secret** you want to be a little more careful with, and it should never be committed to the repo or published anywhere else.

You have two options for setting your **Client Secret**, you can:

1. set an [Environment Variable](https://en.wikipedia.org/wiki/Environment_variable) called `GITHUB_CLIENT_SECRET` on your system with a value equal to your system
2. You can add a `local.json` file to the `config` directory in the project, and put some content like this in there:

```json
{
  "auth": {
    "github": {
      "clientSecret": "REPLACE THIS WITH YOUR GITHUB_CLIENT_SECRET"
    }
  }
}
```
This file is ignored by git (`.gitignore`), and will not be commited to the repo, but will be read by the app when running locally.

With one of these two options in place you should now be able to "Login with Github" in the app.


## Secrets and Environment Variables

We **must not** commit our **secrets** to our repository, so to store our secrets we use either **Environment Variables** or a "git ignored" local config file at `config/local.json`.

For deployments or if you prefer for development you can just set the value of the **Environment Variables** `GITHUB_CLIENT_SECRET` and `FEATHERS_AUTH_SECRET` to the client secret provided by GitHub and your particular feathers secret respectively.

Alternatively create a `local.json` file and stick it in the root `config` directory and any values here will override the corresponding values in the configuration as per [feathers-configuration](https://github.com/feathersjs/feathers-configuration).

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Changelog

__0.1.0__

- Initial release

## License

Copyright (c) 2016

Licensed under the [MIT license](LICENSE).
