# technology-service

## Starten

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

The response will always be a json document. If there occur any errors body.error will include the error message.

### GET /preview

Returns a preview of technologies

**Query**

| Argument              | Type               | Description                                          | Example |
| --------------------- | ------------------ | ---------------------------------------------------- | ------- |
| category _(optional)_ | TechnologyCategory | Category from where technologies should be previewed | "tools" |

**Response body on success**

`TechnologyPreviewData[]`

### GET /:id

Returns a technology by id

**Params**

| Argument | Type | Description     | Example                                |
| -------- | ---- | --------------- | -------------------------------------- |
| id       | uuid | Technology uuid | "21ccb877-80ea-47bb-b538-1e57c79ce7da" |

**Response body on success**

`TechnologyData`

### GET /history/:technologyId

Returns history of a technology

**Params**

| Argument     | Type | Description     | Example                                |
| ------------ | ---- | --------------- | -------------------------------------- |
| technologyId | uuid | Technology uuid | "21ccb877-80ea-47bb-b538-1e57c79ce7da" |

**Response body on success**

`TechnologyHistoryData`

### POST /

Creates a new technology and returns the created technology's id

**Params**

| Argument                         | Type               | Description                     | Example           |
| -------------------------------- | ------------------ | ------------------------------- | ----------------- |
| name                             | string             | Technology name                 | "React"           |
| category                         | TechnologyCategory | Technology category             | "tools"           |
| description                      | string             | Technology description          | "React is a ..."  |
| maturity _(optional)_            | TechnologyMaturity | Technology maturity             | "hold"            |
| maturityDescription _(optional)_ | string             | Technology maturity description | "We strongly ..." |

**Response body on success**

`{id: createdId}`

### PATCH /

Returns user information or registers user with new team and "LEADER" role if no account with the id is found

**Params**

| Argument                         | Type               | Description                                                                                                                                                               | Example                                |
| -------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| id                               | uuid               | Technology uuid                                                                                                                                                           | "21ccb877-80ea-47bb-b538-1e57c79ce7da" |
| name _(optional)_                | string             | Technology name                                                                                                                                                           | "React"                                |
| category _(optional)_            | TechnologyCategory | Technology category                                                                                                                                                       | "tools"                                |
| description _(optional)_         | string             | Technology description                                                                                                                                                    | "React is a ..."                       |
| maturity _(optional)_            | TechnologyMaturity | Technology maturity                                                                                                                                                       | "hold"                                 |
| maturityDescription _(optional)_ | string             | Technology maturity description                                                                                                                                           | "We strongly ..."                      |
| published _(optional)_           | boolean            | Set to true if you want to publish the technology. Once a technology is published, you can't unpublish it and settings published to false or true will resort in an error | "We strongly ..."                      |

**Response body on success**

`TechnologyData`

# Credits

Code-Architecture inspired by [dev-mastery/comments-api](https://github.com/dev-mastery/comments-api)
