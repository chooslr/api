import tiloop from 'tiloop'
import regeneratorRuntime from 'regenerator-runtime'
import { blog as blogV2 } from 'tumblrinbrowser'
import { endpoints, joinParams } from './universal.js'

/* util */
const throws = (message) => { throw new Error(message) }

const asserts = (condition, message) => !condition && throws(message)

const arrToUniques = (arr) => [...new Set(arr).values()]

const formatPath = (base) => base[base.length - 1] === '/' ? base.slice(0, base.length - 1) : base

/* fetch */
const credentials = 'same-origin'

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

const fetchAsGet = (path, params) =>
  fetchInterface(path + joinParams(params), {
    method: 'GET',
    credentials
  })

const fetchAsPost = (path, body) =>
  fetchInterface(path, {
    method: 'POST',
    credentials,
    headers: new Headers({ 'content-type': 'application/json' }),
    body: JSON.stringify(body)
  })


/* fetch as "GET" */
export const user = (base) =>
  fetchAsGet(formatPath(base) + endpoints['info'])
  .then(({ user }) => user)

export const followings = (base, { limit, offset } = {}) =>
  fetchAsGet(formatPath(base) + endpoints['followings'], { limit, offset })
  .then(({ blogs }) => blogs)

export const explores = (base) =>
  fetchAsGet(formatPath(base) + endpoints['explores'])
  .then(({ htmls }) => htmls.map(extractNames))
  .then(names_arr => [].concat(...names_arr))
  .then(names => arrToUniques(names))

export const dashboard = (base, { limit, offset, type, before_id, since_id, reblog_info, notes_info } = {}) =>
  fetchAsGet(formatPath(base) + endpoints['dashboard'], { limit, offset, type, before_id, since_id, reblog_info, notes_info })
  .then(({ posts }) => posts)

export const likes = (base, { limit, offset, before, after, reblog_info, notes_info } = {}) =>
  fetchAsGet(formatPath(base) + endpoints['likes'], { limit, offset, before, after, reblog_info, notes_info })
  .then(({ liked_posts }) => liked_posts)


/* fetch as "POST" */
export const follow = (base, account) =>
  fetchAsPost(formatPath(base) + endpoints['follow'], { account })
  .then(({ blog }) => blog)

export const unfollow = (base, account) =>
  fetchAsPost(formatPath(base) + endpoints['unfollow'], { account })
  .then(({ blog }) => blog)

export const reblog = (base, account, id, reblog_key, { comment, native_inline_images } = {}) =>
  fetchAsPost(formatPath(base) + endpoints['reblog'], { account, id, reblog_key, comment, native_inline_images })
  .then(({ id }) => id)

export const deletePost = (base, account, id) =>
  fetchAsPost(formatPath(base) + endpoints['delete'], { account, id })
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

export const generateDashboard = (base, { offset = 0, limit = 20, type, reblog_info, notes_info } = {}) => {

  asserts(limit <= 20, 'invalid limit')

  const params = { before_id: undefined, offset, limit, type, reblog_info, notes_info }

  const iterator = loop(() => dashboard(base, params).then(posts => {
    params.before_id = posts[posts.length - 1].id
    params.offset = undefined
    return posts
  }))

  return () => {
    const { done, value: promise } = iterator.next()
    return Promise.resolve(promise).then(value => ({ value, done }))
  }
}

export const generateLikes = async (base, { total, limit = 20, offset = 0, reblog_info, notes_info } = {}) => {

  asserts(limit <= 20, 'invalid limit')

  total = total || await user(base).then(({ likes }) => likes)

  asserts(typeof total === 'number' && total !== -1, 'invalid total')

  const params = { before: undefined, offset, limit, reblog_info, notes_info }

  return tiloop({
    length: total - offset,
    maxIncrement: limit,
    promisify: true,
    yielded: (indexedArr) => likes(base, params).then(posts => {
      posts = posts.slice(0, indexedArr.length)
      params.before = posts[posts.length - 1].liked_timestamp
      params.offset = undefined
      return posts
    })
  })
}

export const generateFollowings = async (base, { total, limit = 20, offset = 0 } = {}) => {

  asserts(limit <= 20, 'invalid limit')

  total = total || await user(base).then(({ following }) => following)

  asserts(typeof total === 'number' && total !== -1, 'invalid total')

  return tiloop({
    length: total - offset,
    maxIncrement: limit,
    promisify: true,
    yielded: (indexedArr) => followings(base, { offset: indexedArr[0], limit: indexedArr.length })
  })
}

export const generateExplores = async (base, { api_key, proxy, names, limit = 20 } = {}) => {

  asserts(api_key || proxy, 'required api_key || proxy')

  names = Array.isArray(names) ? names : await explores(base)

  return tiloop({
    length: names.length,
    maxIncrement: limit,
    promisify: true,
    yielded: (indexedArr) =>
      Promise.all(
        indexedArr.map(index =>
          blogV2({ api_key, proxy, account: names[index] })
          .catch(err => undefined)
        )
      )
      .then(blogs => blogs.filter(blog => blog))
  })
}


/* client class */
export default class Chooslr {

  constructor(base, { api_key, proxy } = {}) {
    asserts(base && typeof base === 'string')
    asserts(typeof api_key === 'string' || typeof proxy === 'string')
    this.base = base
    this.api_key = api_key
    this.proxy = proxy
  }

  user() {
    return user(this.base)
  }

  followings(params) {
    return followings(this.base, params)
  }

  explores() {
    return explores(this.base)
  }

  dashboard(params) {
    return dashboard(this.base, params)
  }

  likes(params) {
    return likes(this.base, params)
  }

  follow(account) {
    return follow(this.base, account)
  }

  unfollow(account) {
    return unfollow(this.base, account)
  }

  reblog(...arg) {
    return reblog(this.base, ...arg)
  }

  delete(...arg) {
    return deletePost(this.base, ...arg)
  }

  generateDashboard(params) {
    return generateDashboard(this.base, params)
  }

  generateLikes(params) {
    return generateLikes(this.base, params)
  }

  generateFollowings(params) {
    return generateFollowings(this.base, params)
  }

  generateExplores({ names, limit } = {}) {
    return generateExplores(this.base, { api_key: this.api_key, proxy: this.proxy, names, limit })
  }

}