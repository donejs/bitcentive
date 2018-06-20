import fixture from 'can-fixture';
import User from '../user';

var store = fixture.store([
  {
    "_id": "5877a57f810a6b19008720ba",
    "githubId": 798836,
	"isAdmin": true,
    "github": {
      "accessToken": "accessToken123456789accessToken123456789",
      "profile": {
        "_json": {
          "updated_at": "2016-12-24T15:58:27Z",
          "created_at": "2011-05-19T18:30:27Z",
          "following": 37,
          "followers": 18,
          "public_gists": 0,
          "public_repos": 9,
          "bio": null,
          "hireable": true,
          "email": "alfred@adelgado.org",
          "location": "Boca Raton, FL",
          "blog": "adelgado.org",
          "company": null,
          "name": "Alfredo Delgado",
          "site_admin": false,
          "type": "User",
          "received_events_url": "https://api.github.com/users/Alfredo-Delgado/received_events",
          "events_url": "https://api.github.com/users/Alfredo-Delgado/events{/privacy}",
          "repos_url": "https://api.github.com/users/Alfredo-Delgado/repos",
          "organizations_url": "https://api.github.com/users/Alfredo-Delgado/orgs",
          "subscriptions_url": "https://api.github.com/users/Alfredo-Delgado/subscriptions",
          "starred_url": "https://api.github.com/users/Alfredo-Delgado/starred{/owner}{/repo}",
          "gists_url": "https://api.github.com/users/Alfredo-Delgado/gists{/gist_id}",
          "following_url": "https://api.github.com/users/Alfredo-Delgado/following{/other_user}",
          "followers_url": "https://api.github.com/users/Alfredo-Delgado/followers",
          "html_url": "https://github.com/Alfredo-Delgado",
          "url": "https://api.github.com/users/Alfredo-Delgado",
          "gravatar_id": "",
          "avatar_url": "https://avatars.githubusercontent.com/u/798836?v=3",
          "id": 798836,
          "login": "Alfredo-Delgado"
        },
        "_raw": "{\"login\":\"Alfredo-Delgado\",\"id\":798836,\"avatar_url\":\"https://avatars.githubusercontent.com/u/798836?v=3\",\"gravatar_id\":\"\",\"url\":\"https://api.github.com/users/Alfredo-Delgado\",\"html_url\":\"https://github.com/Alfredo-Delgado\",\"followers_url\":\"https://api.github.com/users/Alfredo-Delgado/followers\",\"following_url\":\"https://api.github.com/users/Alfredo-Delgado/following{/other_user}\",\"gists_url\":\"https://api.github.com/users/Alfredo-Delgado/gists{/gist_id}\",\"starred_url\":\"https://api.github.com/users/Alfredo-Delgado/starred{/owner}{/repo}\",\"subscriptions_url\":\"https://api.github.com/users/Alfredo-Delgado/subscriptions\",\"organizations_url\":\"https://api.github.com/users/Alfredo-Delgado/orgs\",\"repos_url\":\"https://api.github.com/users/Alfredo-Delgado/repos\",\"events_url\":\"https://api.github.com/users/Alfredo-Delgado/events{/privacy}\",\"received_events_url\":\"https://api.github.com/users/Alfredo-Delgado/received_events\",\"type\":\"User\",\"site_admin\":false,\"name\":\"Alfredo Delgado\",\"company\":null,\"blog\":\"adelgado.org\",\"location\":\"Boca Raton, FL\",\"email\":\"alfred@adelgado.org\",\"hireable\":true,\"bio\":null,\"public_repos\":9,\"public_gists\":0,\"followers\":18,\"following\":37,\"created_at\":\"2011-05-19T18:30:27Z\",\"updated_at\":\"2016-12-24T15:58:27Z\"}",
        "provider": "github",
        "photos": [
          {
            "value": "https://avatars.githubusercontent.com/u/798836?v=3"
          }
        ],
        "emails": [
          {
            "value": "alfred@adelgado.org"
          }
        ],
        "profileUrl": "https://github.com/Alfredo-Delgado",
        "username": "Alfredo-Delgado",
        "displayName": "Alfredo Delgado",
        "id": "798836"
      }
    },
    "__v": 0
  },
  {
    "_id": "2",
    "githubId": 12345,
	"isAdmin": true,
    "github": {
      "accessToken": "accessToken123456789",
      "profile": {
        "provider": "github",
        "profileUrl": "https://github.com/ilyavf",
        "username": "ilyavf",
        "displayName": "Ilya",
        "id": "12345"
      }
    },
    "__v": 1
  }
], User.connection.queryLogic);

export default function(mockServer) {
  mockServer.onFeathersService('api/users', store, { id: '_id' });
}
