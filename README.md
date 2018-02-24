# chooslr-client

```js
import * as bff from 'chooslr-client/bff'
import * as v2 from 'chooslr-client/v2'
import * as v1 from 'chooslr-client/v1'
import { bff, v2, v1 } from 'chooslr-client'

const user = await bff.user()
const blogs = await bff.followings({})
const names = await bff.explores()
const posts = await bff.dashboard({})
const posts = await bff.likes({})
const blog = await bff.follow(account)
const blog = await bff.unfollow(account)
const id = await bff.reblog(account, id, reblog_key, {})

const posts = v2.posts(account, api_key, {})
const post = v2.single(account, api_key, id)
const total = v2.total(account, api_key, {})
const blog = v2.blog(account, api_key)
const url = v2.avatar(account[, size])

const posts = v1.posts(account, {})
const post = v1.single(account, id)
const total = v1.total(account, {})
const blog = v1.blog(account)
```

## API
### bff
### v2
### v1

<!-- import {
user,
followings,
explores,
dashboard,
likes,
follow,
unfollow,
reblog
} from 'chooslr-client/bff'
import {
avatar,
blog,
posts,
total,
single
} from 'chooslr-client/v2'
import {
tumblelog,
posts,
total,
single
} from 'chooslr-client/v1' -->
<!-- ```js
likes({ offset: 700 })
.then(async posts => {
  const { liked_timestamp, timestamp } = posts[0]
  const expect_post = posts[1]

  const liked_timestamp_posts = await likes({ before: liked_timestamp, limit: 8 })
  const timestamp_posts = await likes({ before: timestamp, limit: 8 })

  console.log(["posts", posts.map(({ id, date }) => ({ id, date }))])
  console.log(["expect_post", expect_post])
  console.log(["liked_timestamp_post", liked_timestamp_posts.length, liked_timestamp_posts[0]])
  console.log(["timestamp_post", timestamp_posts.length, timestamp_posts[0]])
})
```
liked_timestampを使うべきだな。
で、たぶんだけど、liked_timestampを使った場合は「likeした時系列で」の並びになる。
だからpost.dateで見れば逆行しているように見えるけれど、それが正しい。
timestampではなくliked_timestampを使うのが正しい。 -->