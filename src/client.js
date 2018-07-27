import regeneratorRuntime from 'regenerator-runtime'
import tiloop from 'tiloop'
import join from 'url-join'
import { blog as blogV2 } from 'tumblrinbrowser'
import { endpoints, joinParams } from './universal.js'

/* util */
const arrToUniques = (arr) => [...new Set(arr).values()]

const throws = (message) => { throw new Error(message) }

const asserts = (condition, message) => !condition && throws(message)

/* fetch */

const isSuccess = status => status === 200 || status === 201

const fetchInterface = (...arg) =>
  fetch(...arg)
  .then(res =>
    isSuccess(res.status)
    ? res.json()
    : throws(res.statusText)
  )
  .then(res =>
    isSuccess(res.meta.status)
    ? res.response
    : throws(res.meta.msg)
  )

const fetchAsGet = (path, params, { mode, credentials, jwt } = {}) =>
  fetchInterface(path + joinParams(params), {
    method: 'GET',
    mode,
    credentials,
    headers: new Headers(Object.assign({},
      jwt && { Authorization: 'Bearer ' + jwt }
    ))
  })

const fetchAsPost = (path, body, { mode, credentials, jwt } = {}) =>
  fetchInterface(path, {
    method: 'POST',
    mode,
    credentials,
    body: JSON.stringify(body),
    headers: new Headers(Object.assign({},
      { 'content-type': 'application/json' },
      jwt && { Authorization: 'Bearer ' + jwt }
    ))
  })


/* fetch as "GET" */
export const user = (prefix, options) =>
  fetchAsGet(join(prefix, endpoints['info']), undefined, options)
  .then(({ user }) => user)

export const followings = (prefix, { limit, offset } = {}, options) =>
  fetchAsGet(join(prefix, endpoints['followings']), { limit, offset }, options)
  .then(({ blogs }) => blogs)

export const explores = (prefix, options) =>
  fetchAsGet(join(prefix, endpoints['explores']), undefined, options)
  .then(({ htmls }) => htmls.map(extractNames))
  .then(names_arr => [].concat(...names_arr))
  .then(names => arrToUniques(names))

export const search = (prefix, { name, word, page = 1 } = {}, options) =>
  fetchAsGet(join(prefix, endpoints['search']), { name, word: encodeURIComponent(word), page }, options)
  .then(({ posts }) => posts)

export const dashboard = (prefix, { limit, offset, type, before_id, since_id, reblog_info, notes_info } = {}, options) =>
  fetchAsGet(join(prefix, endpoints['dashboard']), { limit, offset, type, before_id, since_id, reblog_info, notes_info }, options)
  .then(({ posts }) => posts)

export const likes = (prefix, { limit, offset, before, after, reblog_info, notes_info } = {}, options) =>
  fetchAsGet(join(prefix, endpoints['likes']), { limit, offset, before, after, reblog_info, notes_info }, options)
  .then(({ liked_posts }) => liked_posts)

export const extract = (prefix, options) =>
  fetchAsGet(join(prefix, endpoints['extract']), undefined, options)
  .then(({ jwt }) => jwt)


/* fetch as "POST" */
export const follow = (prefix, name, options) =>
  fetchAsPost(join(prefix, endpoints['follow']), { name }, options)
  .then(({ blog }) => blog)

export const unfollow = (prefix, name, options) =>
  fetchAsPost(join(prefix, endpoints['unfollow']), { name }, options)
  .then(({ blog }) => blog)

export const like = (prefix, id, reblog_key, options) =>
  fetchAsPost(join(prefix, endpoints['like']), { id, reblog_key }, options)
  .then((response) => Array.isArray(response))

export const unlike = (prefix, id, reblog_key, options) =>
  fetchAsPost(join(prefix, endpoints['unlike']), { id, reblog_key }, options)
  .then((response) => Array.isArray(response))

export const reblog = (prefix, name, id, reblog_key, { comment, native_inline_images } = {}, options) =>
  fetchAsPost(join(prefix, endpoints['reblog']), { name, id, reblog_key, comment, native_inline_images }, options)
  .then(({ id }) => id)

export const deletePost = (prefix, name, id, options) =>
  fetchAsPost(join(prefix, endpoints['delete']), { name, id }, options)
  .then(({ id }) => id)


/* used by explores() */
const parseFromString = (string) =>
  new DOMParser()
  .parseFromString(
    string,
    'text/html'
  )

const extractNames = (html) =>
  JSON.parse(
    parseFromString(html)
      .getElementById('bootloader')
      .dataset
      .bootstrap
  )
  .Components
  .DiscoveryPosts
  .posts.map(post =>
    parseFromString(post)
      .querySelector('.post-info-tumblelog')
      .children[0]
      .innerHTML
      .trim()
  )


/* generators */
function* loop(yielded) { while (true) { yield yielded() } }

export const generateDashboard = (prefix, { offset = 0, limit = 20, type, reblog_info, notes_info } = {}, options) => {

  asserts(limit <= 20, 'invalid limit')

  const params = { before_id: undefined, offset, limit, type, reblog_info, notes_info }

  const iterator = loop(() => dashboard(prefix, params, options).then(posts => {
    params.before_id = posts[posts.length - 1].id
    params.offset = undefined
    return posts
  }))

  return () => {
    const { done, value: promise } = iterator.next()
    return Promise.resolve(promise).then(value => ({ value, done }))
  }
}

export const generateLikes = async (prefix, { total, limit = 20, offset = 0, reblog_info, notes_info } = {}, options) => {

  asserts(limit <= 20, 'invalid limit')

  total = total || await user(prefix, options).then(({ likes }) => likes)

  asserts(typeof total === 'number' && total !== -1, 'invalid total')

  const params = { before: undefined, offset, limit, reblog_info, notes_info }

  return tiloop({
    length: total - offset,
    maxIncrement: limit,
    promisify: true,
    yielded: (indexedArr) => likes(prefix, params, options).then(posts => {
      posts = posts.slice(0, indexedArr.length)
      params.before = posts[posts.length - 1].liked_timestamp
      params.offset = undefined
      return posts
    })
  })
}

export const generateFollowings = async (prefix, { total, limit = 20, offset = 0 } = {}, options) => {

  asserts(limit <= 20, 'invalid limit')

  total = total || await user(prefix, options).then(({ following }) => following)

  asserts(typeof total === 'number' && total !== -1, 'invalid total')

  return tiloop({
    length: total - offset,
    maxIncrement: limit,
    promisify: true,
    yielded: (indexedArr) => followings(prefix, { offset: indexedArr[0], limit: indexedArr.length }, options)
  })
}

export const generateExplores = async (prefix, { names, limit = 20 } = {}, { api_key, proxy } = {}, options) => {

  asserts(api_key || proxy, 'required api_key || proxy')

  names = Array.isArray(names) ? names : await explores(prefix, options)

  return tiloop({
    length: names.length,
    maxIncrement: limit,
    promisify: true,
    yielded: (indexedArr) =>
      Promise.all(
        indexedArr.map(index =>
          blogV2({ api_key, proxy, name: names[index] }).catch(err => undefined)
        )
      )
      .then(blogs => blogs.filter(blog => blog))
  })
}

export const generateSearch = async (prefix, { name, word } = {}, options) => {

  let tempPosts = await search(prefix, { name, word, page: 1 }, options)
  asserts(tempPosts.length > 0, 'not found')

  const pageIterator = pageGenerator()

  return () => {
    const { value: page, done } = pageIterator.next()

    if (done) {
      const value = tempPosts
      if (tempPosts.length) tempPosts = []
      return Promise.resolve({ value, done })
    }

    return search(prefix, { name, word, page: page + 1 }, options).then(posts => {
      pageIterator.next(!posts.length || posts.length !== tempPosts.length)
      const value = tempPosts
      tempPosts = posts
      return { value, done }
    })
  }
}

function* pageGenerator () {
  let page = 1
  let isReturn
  while (true) {
    if (!isReturn) {
      isReturn = yield page
      yield
    } else {
      return page
    }
    page++
  }
}

/* client class */
class Chooslr {

  constructor(prefix, tumblrOpts, options) {
    asserts(prefix && typeof prefix === 'string')
    this.prefix = prefix

    const { api_key, proxy } = tumblrOpts || {}
    asserts(typeof api_key === 'string' || typeof proxy === 'string')
    this.tumblrOpts = { api_key, proxy }

    const { credentials = 'same-origin', mode = 'same-origin', jwt } = options || {}
    this.fetchOpts = { credentials, mode, jwt }
  }

  user() {
    return user(this.prefix, this.fetchOpts)
  }

  followings(params) {
    return followings(this.prefix, params, this.fetchOpts)
  }

  explores() {
    return explores(this.prefix, this.fetchOpts)
  }

  search(name, word, page) {
    return search(this.prefix, { name, word, page }, this.fetchOpts)
  }

  dashboard(params) {
    return dashboard(this.prefix, params, this.fetchOpts)
  }

  likes(params) {
    return likes(this.prefix, params, this.fetchOpts)
  }

  follow(name) {
    return follow(this.prefix, name, this.fetchOpts)
  }

  unfollow(name) {
    return unfollow(this.prefix, name, this.fetchOpts)
  }

  like(id, reblog_key) {
    return like(this.prefix, id, reblog_key, this.fetchOpts)
  }

  unlike(id, reblog_key) {
    return unlike(this.prefix, id, reblog_key, this.fetchOpts)
  }

  reblog(name, id, reblog_key, params) {
    return reblog(this.prefix, name, id, reblog_key, params, this.fetchOpts)
  }

  delete(name, id) {
    return deletePost(this.prefix, name, id, this.fetchOpts)
  }

  generateDashboard(params) {
    return generateDashboard(this.prefix, params, this.fetchOpts)
  }

  generateLikes(params) {
    return generateLikes(this.prefix, params, this.fetchOpts)
  }

  generateFollowings(params) {
    return generateFollowings(this.prefix, params, this.fetchOpts)
  }

  generateExplores(params) {
    return generateExplores(this.prefix, params, this.tumblrOpts, this.fetchOpts)
  }

  generateSearch(params) {
    return generateSearch(this.prefix, params, this.fetchOpts)
  }

  attachURL(redirect_url) {
    return join(this.prefix, '/attach') + joinParams({ redirect_url })
  }

  detachURL(redirect_url) {
    return join(this.prefix, '/detach') + joinParams({ redirect_url })
  }

  extract() {
    return extract(this.prefix, this.fetchOpts)
  }

}

export {
  Chooslr as default,
  endpoints,
  joinParams,
  asserts
}