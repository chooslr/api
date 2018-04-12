# chooslr-client

### bff
```js
import * as bff from 'chooslr-client/bff'
import { bff } from 'chooslr-client'

const user = await bff.user()
const blogs = await bff.followings({})
const names = await bff.explores()
const posts = await bff.dashboard({})
const posts = await bff.likes({})
const blog = await bff.follow(account)
const blog = await bff.unfollow(account)
const id = await bff.reblog(account, id, reblog_key, {})

const feedPosts = await bff.HoPostsDashboard({})
const feedPosts = await bff.HoPostsLikes({})
const feedBlogs = await bff.HoBlogsFollowings({})
const feedBlogs = await bff.HoBlogsExplores(api_key, {})
```

### v2
```js
import * as v2 from 'chooslr-client/v2'
import { v2 } from 'chooslr-client'

const posts = await v2.posts(account, api_key, {})
const post = await v2.post(account, api_key, id)
const total = await v2.total(account, api_key, {})
const blog = await v2.blog(account, api_key)
const url = v2.avatar(account[, size])

const posts = await v2.samplingPosts(account, api_key, { type, denom, maxNum })
const tags = await v2.samplingTags(account, api_key, { type, denom, maxNum })

const feedPosts = await v2.HoPosts(account, api_key, {})
const feedPosts = await v2.HoPostsRandom(account, api_key, {})
```

### v1
```js
import * as v1 from 'chooslr-client/v1'
import { v1 } from 'chooslr-client'

const posts = await v1.posts(account, {})
const post = await v1.post(account, id)
const total = await v1.total(account, {})
const blog = await v1.blog(account)

const posts = await v1.samplingPosts(account, { type, denom, maxNum })
const tags = await v1.samplingTags(account, { type, denom, maxNum })

const feedPosts = await v1.HoPosts(account, {})
const feedPosts = await v1.HoPostsRandom(account, {})
```

<!-- ### hoc
**Don't use nameless function as children!!!**

**It forces mounting in every rendering.**
```js
import * as hoc from 'chooslr-client/hoc'
import { hoc } from 'chooslr-client'

/* Blog */
const BlogStore = hoc.HocBlog(api_key)

const BlogChildren = ({
  isReady,
  message,
  blog: { title, updated, totals, tags },
  updateTags,
  updateTotals,
  updateTagTotal,
  isUpdating
}) => {}

const BlogHandler = ({ account }) =>
  <BlogStore {...{ account }}>
    <BlogChildren />
  </BlogStore>

/* Blogs */
const BlogsStore = hoc.HocBlogs(api_key, processing, user)

const BlogsChildren = ({ isReady, blogs, updateBlogs, isUpdating }) => {}

const BlogsHandler = ({ type }) =>
  <BlogsStore {...{ type }}>
    <BlogsChildren />
  </BlogsStore>

/* Relations */
const RelationsStore = hoc.HocRelations(api_key, processing, user)

const RelationsChildren = ({ isReady, authed_ratio, blogs }) => {}

const RelationsHandler = ({ type }) =>
  <RelationsStore {...{ type }}>
    <RelationsChildren />
  </RelationsStore>

/* Posts */
const PostsStore = hoc.HocPosts(api_key, params, processing, user)

const PostsChildren = ({ isReady, message, posts, updatePosts, isUpdating }) => {}

const PostsHandler = ({ unique_key }) =>
  <PostsStore {...{ unique_key }}>
    <PostsChildren />
  </PostsStore>
``` -->

## API
### bff
### v2
### v1

[tumblr/tumblr.js](https://github.com/tumblr/tumblr.js/)
> Due to CORS restrictions, you're going to have a really hard time using this library in the browser. Although GET endpoints on the Tumblr API support JSONP, this library is not intended for in-browser use. Sorry!

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
post
} from 'chooslr-client/v2'
import {
tumblelog,
posts,
total,
post
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