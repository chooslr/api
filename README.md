# chooslr api

ref: [Tumblr API](https://www.tumblr.com/docs/en/api/v2)

## Usage
server:
```js
const Koa = require('koa')
const bff = require('chooslr-api/server')

const app = new Koa()

app
.use(
  bff(app, {
    prefix: string = '/',
    consumerKey: string,
    consumerSecret: string,
    jwt: { secret: string, cookie: [name, options] },
    grantServer: {},
    grantCallbackRedirect: string = '/'
  })
)
.listen(PORT)
```
front:
```js
import Chooslr from 'chooslr-api/client'

const chooslr = new Chooslr('/api', tumblr, jwt)
```

## Endpoints
### `/info: GET`
- jwt: Yes
- method: `.user()`

### `/explores: GET`
- jwt: No
- method: `.explores()`

### `/followings: GET`
- jwt: Yes
- method: `.followings(params)`
- params:
  - `limit`
  - `offset`

### `/dashboard: GET`
- jwt: Yes
- method: `.dashboard(params)`
- params:
  - `limit`
  - `offset`
  - `type`
  - `since_id`
  - `before_id` 👏
  - `reblog_info`
  - `notes_info`

### `/likes: GET`
- jwt: Yes
- method: `.likes(params)`
- params:
  - `limit`
  - `offset`
  - `before`
  - `after`
  - `reblog_info`
  - `notes_info`

### `/follow: POST`
- jwt: Yes
- method: `.follow(name)`

### `/unfollow: POST`
- jwt: Yes
- method: `.unfollow(name)`

### `/reblog: POST`
- jwt: Yes
- method: `.reblog(name, id, reblog_key, params)`
- params:
  - `comment`
  - `native_inline_images`

### `/delete: POST`
- jwt: Yes
- method: `.delete(name, id)`

### `/attach: GET`
- jwt: No
- method: `.attachURL()`

### `/detach: GET`
- jwt: No
- method: `.detachURL()`

### `/extract: GET`
- jwt: Yes
- method: `.extract()`

### `/proxy/:splat`
- jwt: No

## generators
- `generateDashboard(params)`
- `generateLikes(params)`
- `generateFollowings(params)`
- `generateExplores(params)`