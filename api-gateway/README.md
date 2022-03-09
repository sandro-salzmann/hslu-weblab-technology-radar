# api-gateway

## Start

```bash
npm i
npm run dev
```

## API

All requests require the "AUTHORIZATION" header to bet set with the Auth0 API Access token.

Example usage with auth0-react

```js
const accessToken = await getAccessTokenSilently({
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  scope: "openid profile email",
});
const result = await fetch(process.env.REACT_APP_AUTH0_AUDIENCE, {
  // ...
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

### GET /permissions

Returns user permissions

**Response**

_If AUTHORIZATION is set correctly and token can be verified_

Status 200

Body is JSON of type `Authorization`

_If there occurs an error_

Status 500

Body is JSON `{ error: "User claims not found." }`
