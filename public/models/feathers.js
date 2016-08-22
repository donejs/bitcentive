import Feathers from 'can-connect-feathers';
import cookieStorage from 'cookie-storage';

const feathers = new Feathers({
  // The current server is assumed to be the API server.
  url: '',
  // Determines if the token is persisted to the `storage` provider.
  storeToken: true,
  // The storage engine used to persist the token on the client.
  storage: window.localStorage,
  // The key name of the location where the token will be stored.
  tokenLocation: 'ssr-cookie',
  // The default `idProp` for all services.
  idProp: '_id',
  // The endpoint for token authentication.
  tokenEndpoint: '/auth/token',
  // The endpoint for username/password authentication.
  localEndpoint: '/auth/local',
  // Store the token in a cookie for SSR by default.
  ssr: true
});

// $.ajaxPrefilter(function( options, originalOptions, jqXHR ) {
//   //options.contentType = "application/json; charset=utf-8";
//   options.dataType = "json";
// });

export default feathers;
