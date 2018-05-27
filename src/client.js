import regeneratorRuntime from 'regenerator-runtime'
import tiloop from 'tiloop'
import join from 'url-join'
import { blog as blogV2 } from 'tumblrinbrowser'
import { endpoints, joinParams } from './universal.js'

/* util */
const arrToUniques = (arr) => [...new Set(arr).values()]

const throws = (message) => { throw new Error(message) }

const asserts = (condition, message) => !condition && throws(message)

export { endpoints, joinParams, asserts }

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
export const user = (base, options) =>
  fetchAsGet(join(base, endpoints['info']), undefined, options)
  .then(({ user }) => user)

export const followings = (base, { limit, offset } = {}, options) =>
  fetchAsGet(join(base, endpoints['followings']), { limit, offset }, options)
  .then(({ blogs }) => blogs)

export const explores = (base, options) =>
  fetchAsGet(join(base, endpoints['explores']), undefined, options)
  .then(({ htmls }) => htmls.map(extractNames))
  .then(names_arr => [].concat(...names_arr))
  .then(names => arrToUniques(names))

export const dashboard = (base, { limit, offset, type, before_id, since_id, reblog_info, notes_info } = {}, options) =>
  fetchAsGet(join(base, endpoints['dashboard']), { limit, offset, type, before_id, since_id, reblog_info, notes_info }, options)
  .then(({ posts }) => posts)

export const likes = (base, { limit, offset, before, after, reblog_info, notes_info } = {}, options) =>
  fetchAsGet(join(base, endpoints['likes']), { limit, offset, before, after, reblog_info, notes_info }, options)
  .then(({ liked_posts }) => liked_posts)

export const extract = (base, options) =>
  fetchAsGet(join(base, endpoints['extract']), undefined, options)
  .then(({ jwt }) => jwt)


/* fetch as "POST" */
export const follow = (base, name, options) =>
  fetchAsPost(join(base, endpoints['follow']), { name }, options)
  .then(({ blog }) => blog)

export const unfollow = (base, name, options) =>
  fetchAsPost(join(base, endpoints['unfollow']), { name }, options)
  .then(({ blog }) => blog)

export const reblog = (base, name, id, reblog_key, { comment, native_inline_images } = {}, options) =>
  fetchAsPost(join(base, endpoints['reblog']), { name, id, reblog_key, comment, native_inline_images }, options)
  .then(({ id }) => id)

export const deletePost = (base, name, id, options) =>
  fetchAsPost(join(base, endpoints['delete']), { name, id }, options)
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

export const generateDashboard = (base, { offset = 0, limit = 20, type, reblog_info, notes_info } = {}, options) => {

  asserts(limit <= 20, 'invalid limit')

  const params = { before_id: undefined, offset, limit, type, reblog_info, notes_info }

  const iterator = loop(() => dashboard(base, params, options).then(posts => {
    params.before_id = posts[posts.length - 1].id
    params.offset = undefined
    return posts
  }))

  return () => {
    const { done, value: promise } = iterator.next()
    return Promise.resolve(promise).then(value => ({ value, done }))
  }
}

export const generateLikes = async (base, { total, limit = 20, offset = 0, reblog_info, notes_info } = {}, options) => {

  asserts(limit <= 20, 'invalid limit')

  total = total || await user(base, options).then(({ likes }) => likes)

  asserts(typeof total === 'number' && total !== -1, 'invalid total')

  const params = { before: undefined, offset, limit, reblog_info, notes_info }

  return tiloop({
    length: total - offset,
    maxIncrement: limit,
    promisify: true,
    yielded: (indexedArr) => likes(base, params, options).then(posts => {
      posts = posts.slice(0, indexedArr.length)
      params.before = posts[posts.length - 1].liked_timestamp
      params.offset = undefined
      return posts
    })
  })
}

export const generateFollowings = async (base, { total, limit = 20, offset = 0 } = {}, options) => {

  asserts(limit <= 20, 'invalid limit')

  total = total || await user(base, options).then(({ following }) => following)

  asserts(typeof total === 'number' && total !== -1, 'invalid total')

  return tiloop({
    length: total - offset,
    maxIncrement: limit,
    promisify: true,
    yielded: (indexedArr) => followings(base, { offset: indexedArr[0], limit: indexedArr.length }, options)
  })
}

export const generateExplores = async (base, { names, limit = 20 } = {}, { api_key, proxy } = {}) => {

  asserts(api_key || proxy, 'required api_key || proxy')

  names = Array.isArray(names) ? names : await explores(base)

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


/* client class */
export default class Chooslr {

  constructor(base, tumblr, options) {
    asserts(base && typeof base === 'string')
    this.base = base

    const { api_key, proxy } = tumblr || {}
    asserts(typeof api_key === 'string' || typeof proxy === 'string')
    this.tumblrOpts = { api_key, proxy }

    const { credentials = 'same-origin', mode = 'same-origin', jwt, authRedirectURL } = options || {}
    this.fetchOpts = { credentials, mode, jwt }
    this.authRedirectURL = authRedirectURL
  }

  user() {
    return user(this.base, this.fetchOpts)
  }

  followings(params) {
    return followings(this.base, params, this.fetchOpts)
  }

  explores() {
    return explores(this.base, this.fetchOpts)
  }

  dashboard(params) {
    return dashboard(this.base, params, this.fetchOpts)
  }

  likes(params) {
    return likes(this.base, params, this.fetchOpts)
  }

  follow(name) {
    return follow(this.base, name, this.fetchOpts)
  }

  unfollow(name) {
    return unfollow(this.base, name, this.fetchOpts)
  }

  reblog(name, id, reblog_key, params) {
    return reblog(this.base, name, id, reblog_key, params, this.fetchOpts)
  }

  delete(name, id) {
    return deletePost(this.base, name, id, this.fetchOpts)
  }

  generateDashboard(params) {
    return generateDashboard(this.base, params, this.fetchOpts)
  }

  generateLikes(params) {
    return generateLikes(this.base, params, this.fetchOpts)
  }

  generateFollowings(params) {
    return generateFollowings(this.base, params, this.fetchOpts)
  }

  generateExplores({ names, limit } = {}) {
    return generateExplores(this.base, { names, limit }, this.tumblrOpts)
  }

  attachURL() {
    return join(this.base, '/attach') + joinParams({ redirect_url: this.authRedirectURL })
  }

  detachURL() {
    return join(this.base, '/detach') + joinParams({ redirect_url: this.authRedirectURL })
  }

  extract() {
    return extract(this.base, this.fetchOpts)
  }

}