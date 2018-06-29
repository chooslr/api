# chooslr-api

![GitHub release](https://img.shields.io/github/release/chooslr/api.svg?longCache=true&style=flat-square)
[![CircleCI](https://img.shields.io/circleci/project/github/chooslr/api.svg?longCache=true&style=flat-square)](https://circleci.com/gh/chooslr/api) [![Codecov](https://img.shields.io/codecov/c/github/chooslr/api.svg?longCache=true&style=flat-square)](https://codecov.io/gh/chooslr/api)

## Usage
`chooslr-api/middleware`:
```js
const Koa = require('koa')
const chooslr = require('chooslr-api/middleware')

const app = new Koa()

app
.use(
  chooslr(app, {
    prefix: string = '/',
    consumerKey: string,
    consumerSecret: string,
    grantServer: {},
    jwt: { secret: string, options: {}, cookie: [name, options] }
  })
)
.listen(PORT)
```

`chooslr-api/client`:
```js
import Chooslr from 'chooslr-api/client'

const chooslr = new Chooslr('/api', { api_key, proxy }, {
  credentials = 'same-origin',
  mode = 'same-origin',
  jwt,
  authRedirectURL
})
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
  - `before_id`
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
- params:
  - `redirect_url`

### `/detach: GET`
- jwt: No
- method: `.detachURL()`
- params:
  - `redirect_url`

### `/extract: GET`
- jwt: No
- method: `.extract()`

### `/proxy/:splat`
- jwt: No

## Generators
- `generateDashboard(params)`
- `generateLikes(params)`
- `generateFollowings(params)`
- `generateExplores(params)`

## Ref
- [Tumblr API](https://www.tumblr.com/docs/en/api/v2)
- [`simov/grant`](https://github.com/simov/grant)
- [`koajs/jwt`](https://github.com/koajs/jwt)
- [`kthjm/tumblrinbrowser`](https://github.com/kthjm/tumblrinbrowser)

## License
MIT (http://opensource.org/licenses/MIT)