# account-service

## Starten

```bash
npm i
npm run dev
```

## API

All requests require the "AUTHORIZATION" header to bet set with a stringified `Authorization` JSON value.

### GET /:id

Returns user information

**Params**

| Argument | Type | Description | Example                                  |
| -------- | ---- | ----------- | ---------------------------------------- |
| id       | uuid | Account id  | `"f8138bdd-d2c2-41a1-bdb0-84979c8f4a51"` |

**Response**

JSON `AccountData`

## Credits

Code-Architecture inspired by [dev-mastery/comments-api](https://github.com/dev-mastery/comments-api)
