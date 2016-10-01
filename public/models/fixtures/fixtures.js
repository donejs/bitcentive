// Main file that loads all model fixtures
import fixture from 'can-fixture';

// Fixtures for token login when the idProp is `_id`.
fixture("OPTIONS /auth/token", function(request, response, headers, ajaxSettings){
  return response(200, "", `HTTP/1.1 204 No Content
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
    Access-Control-Allow-Headers: content-type
    Connection: keep-alive`
  );
});
fixture("POST /auth/token", function(request, response, headers, ajaxSettings){
  return {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI1MzcwNzEyMDAsIl9pZCI6MX0.6SbVcUHJjbbzJ0Kt6x3iOSnTUms7EqO0MGkMp8m6OTg',
    data: {
      _id: 1,
      email: 'user@example.com'
    }
  };
});

// Fixtures for username/password login when the idProp is `_id`.
fixture("OPTIONS /auth/local", function(request, response, headers, ajaxSettings){
  return response(200, "", `HTTP/1.1 204 No Content
    Access-Control-Allow-Origin: *
    Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
    Access-Control-Allow-Headers: content-type
    Connection: keep-alive`
  );
});
fixture("POST /auth/local", function(request, response, headers, ajaxSettings){
  return {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjI1MzcwNzEyMDAsIl9pZCI6MX0.6SbVcUHJjbbzJ0Kt6x3iOSnTUms7EqO0MGkMp8m6OTg',
    data: {
      _id: 1,
      email: 'user@example.com'
    }
  };
});