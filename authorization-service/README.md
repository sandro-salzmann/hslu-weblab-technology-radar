# authorization-service

## Starten

```bash
npm i
npm run dev
```

## API

### GET /:id

Returns user information or registers user with new team and "LEADER" role if no account with the id is found

**Params**

| Argument | Type | Description  | Example                                |
| -------- | ---- | ------------ | -------------------------------------- |
| id       | uuid | Account uuid | "21ccb877-80ea-47bb-b538-1e57c79ce7da" |

**Query**

| Argument | Type   | Description                                                 | Example              |
| -------- | ------ | ----------------------------------------------------------- | -------------------- |
| email    | string | Account email to register a new user with if id isn't found | "somemail@gmail.com" |

**Response**

JSON `AccountData`

## Credits

Code-Architecture inspired by [dev-mastery/comments-api](https://github.com/dev-mastery/comments-api)
