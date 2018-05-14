# chooslr api

ref: [Tumblr API](https://www.tumblr.com/docs/en/api/v2)

### `chooslr-api/server`
```js
const koa = require('koa')
const mount = require('koa-mount')
const api = require('chooslr-api/server')

koa()
.use(mount(
  '/api',
  api({
    jwt: {
      secret,
      cookieName?,
      stateName?
    },
    oauth: {
      consumerKey,
      consumerSecret,
      tokenName?,
      secretName?
    }
  })
))
.listen(PORT)
```
### `chooslr-api/client`
```js
import Chooslr from 'chooslr-api/client'

const chooslr = new Chooslr('/api', { api_key, proxy })
```
<!-- /* GET */
const user = await chooslr.user()
const names = await chooslr.explores()
const blogs = await chooslr.followings(params)
const posts = await chooslr.dashboard(params)
const posts = await chooslr.likes(params)

/* POST */
const blog = await chooslr.follow(account)
const blog = await chooslr.unfollow(account)
const id = await chooslr.reblog(account, id, reblog_key, params)
const id = await chooslr.delete(account, id) -->
## endpoints
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
- method: `.follow(account)`

### `/unfollow: POST`
- jwt: Yes
- method: `.unfollow(account)`

### `/reblog: POST`
- jwt: Yes
- method: `.reblog(account, id, reblog_key, params)`
- params:
  - `comment`
  - `native_inline_images`

### `/delete: POST`
- jwt: Yes
- method: `.delete(account, id)`

## generators
- `generateDashboard(params)`
- `generateLikes(params)`
- `generateFollowings(params)`
- `generateExplores(params)`