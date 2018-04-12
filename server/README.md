# chooslr api server

#### set:
```js
const Koa = require('koa')
const Mount = require('koa-mount')
const API = require('chooslr-api-server')

const api = API({
  encrypt: {
    algorithm,
    password
  },
  jwt: {
    cookieName,
    stateName,
    secret
  },
  oauth: {
    consumerKey,
    consumerSecret,
    tokenName,
    secretName
  }
})

const app = new Koa()

app
.use(mount('/api', api))
.listen(PORT)
```

#### use:
```js
// GET
const fetched = fetch(`path?key=value`, {
  credentials: 'same-origin' // If depending cookie
})

// POST
const fetched = fetch(`path`, {
  credentials: 'same-origin', // If depending cookie
  method: 'POST',
  headers: new Headers({ "content-type":"application/json" }),
  body: JSON.stringify({ key: value })
})

const response = await fetched.then(res => res.json())
```
- [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- [Request.credentials](https://developer.mozilla.org/ja/docs/Web/API/Request/credentials)
- [Headers](https://developer.mozilla.org/ja/docs/Web/API/Headers)

## API [(tumblr api v2)](https://www.tumblr.com/docs/en/api/v2)

### `/info`
##### method: `GET`
##### jwt: Yes
##### query: No

### `/followings`
##### method: `GET`
##### jwt: Yes
##### query:
- `limit`
- `offset`

### `/explores`
##### method: `GET`
##### jwt: No
##### query: No

### `/dashboard`
##### method: `GET`
##### jwt: Yes
##### query:
- `limit`
- `offset`
- `type`
- `since_id`
- `before_id` 👏
- `reblog_info`
- `notes_info`

### `/likes`
##### method: `GET`
##### jwt: Yes
##### query:
- `limit`
- `offset`
- `before`
- `after`
- `reblog_info`
- `notes_info`

### `/follow`
##### method: `POST`
##### jwt: Yes
##### body:
- `account` 🚩

### `/unfollow`
##### method: `POST`
##### jwt: Yes
##### body:
- `account` 🚩

### `/reblog`
##### method: `POST`
##### jwt: Yes
##### body:
- `account` 🚩
- `id` 🚩
- `reblog_key` 🚩
- `comment`
- `native_inline_images`

## Other module
```js
const { joinParams } = require('chooslr-api-server')
const jwtRestore = require('chooslr-api-server/custom-jwt')

const url = URL + joinParams({...})
const middleware = jwtRestore({ key, algorithm, password })
```
