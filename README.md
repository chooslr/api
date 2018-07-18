# chooslr-api

![GitHub release](https://img.shields.io/github/release/chooslr/chooslr-api.svg?longCache=true&style=flat-square)
[![CircleCI](https://img.shields.io/circleci/project/github/chooslr/chooslr-api.svg?longCache=true&style=flat-square)](https://circleci.com/gh/chooslr/chooslr-api) [![Codecov](https://img.shields.io/codecov/c/github/chooslr/chooslr-api.svg?longCache=true&style=flat-square)](https://codecov.io/gh/chooslr/chooslr-api)

[koa](https://koajs.com/)'s middleware and its client.

## Usage

### chooslr(app, config)
```js
const Koa = require('koa')
const chooslr = require('chooslr-api/middleware')

const app = new Koa()

app
.use(chooslr(app, config))
.listen(PORT)
```
#### config
- `prefix` (= `'/'`)
- `timeout` (= `10000`)
- `consumerKey`
- `consumerSecret`
- [`grantServer`](https://github.com/simov/grant#configuration)
- `jwt`
  - `secret`
  - [`options`](https://github.com/auth0/node-jsonwebtoken#jwtsignpayload-secretorprivatekey-options-callback)
  - [`cookie`](https://github.com/pillarjs/cookies#cookiesset-name--value---options--): `name` | `[name, options]`

### new Chooslr(prefix, tumblrOpts[, options])
```js
import Chooslr from 'chooslr-api/client'
import Tumblr from 'tumblrinbrowser'

const tumblrOpts = { api_key, proxy }
const tumblr = new Tumblr(tumblrOpts)
const chooslr = new Chooslr('/api', tumblrOpts, options)
```
#### options
- `credentials` (= `'same-origin'`)
- `mode` (= `'same-origin'`)
- `jwt`
- `authRedirectURL`

## Endpoints
#### `/info: GET`
- jwt: Yes
- method: `.user()`

#### `/explores: GET`
- jwt: No
- method: `.explores()`

#### `/followings: GET`
- jwt: Yes
- method: `.followings(params)`
- params:
  - `limit`
  - `offset`

#### `/dashboard: GET`
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

#### `/likes: GET`
- jwt: Yes
- method: `.likes(params)`
- params:
  - `limit`
  - `offset`
  - `before`
  - `after`
  - `reblog_info`
  - `notes_info`

#### `/follow: POST`
- jwt: Yes
- method: `.follow(name)`

#### `/unfollow: POST`
- jwt: Yes
- method: `.unfollow(name)`

#### `/reblog: POST`
- jwt: Yes
- method: `.reblog(name, id, reblog_key, params)`
- params:
  - `comment`
  - `native_inline_images`

#### `/delete: POST`
- jwt: Yes
- method: `.delete(name, id)`

#### `/attach: GET`
- jwt: No
- method: `.attachURL()`
- params:
  - `redirect_url`

#### `/detach: GET`
- jwt: No
- method: `.detachURL()`
- params:
  - `redirect_url`

#### `/extract: GET`
- jwt: No
- method: `.extract()`

#### `/proxy/:splat`
- jwt: No

## Generators
- `generateDashboard(params)`
- `generateLikes(params)`
- `generateFollowings(params)`
- `generateExplores(params)`

## Refs
- [Tumblr API](https://www.tumblr.com/docs/en/api/v2)
- [`simov/grant`](https://github.com/simov/grant)
- [`koajs/jwt`](https://github.com/koajs/jwt)
- [`chooslr/tumblrinbrowser`](https://github.com/chooslr/tumblrinbrowser)

## License
MIT (http://opensource.org/licenses/MIT)
