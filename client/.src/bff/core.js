import { fetchInterface, joinParams, arrToUniques } from '../util'

const BASE = '/api'
const credentials = 'same-origin'

const fetchAsGet = (path, params) =>
  fetchInterface(
    path + joinParams(params),
    {
      method: 'GET',
      credentials
    }
  )

const fetchAsPost = (path, body) =>
  fetchInterface(
    path,
    {
      method: 'POST',
      credentials,
      headers: new Headers({ 'content-type': 'application/json' }),
      body: JSON.stringify(body)
    }
  )

export const user = () =>
  fetchAsGet(`${BASE}/info`)
  .then(({ user }) => user)

export const followings = ({ limit, offset } = {}) =>
  fetchAsGet(`${BASE}/followings`, { limit, offset })
  .then(({ blogs }) => blogs)

export const explores = () =>
  fetchAsGet(`${BASE}/explores`)
  .then(({ htmls }) => htmls.map(html => extractNames(html)))
  .then(names_arr => [].concat(...names_arr))
  .then(names => arrToUniques(names))

export const dashboard = ({ limit, offset, type, before_id, since_id, reblog_info, notes_info } = {}) =>
  fetchAsGet(`${BASE}/dashboard`, {
    limit,
    offset,
    type,
    before_id,
    since_id,
    reblog_info,
    notes_info
  })
  .then(({ posts }) => posts)

export const likes = ({ limit, offset, before, after, reblog_info, notes_info } = {}) =>
  fetchAsGet(`${BASE}/likes`, {
    limit,
    offset,
    before,
    after,
    reblog_info,
    notes_info
  })
  .then(({ liked_posts }) => liked_posts)

export const follow = (account) =>
  fetchAsPost(`${BASE}/follow`, { account })
  .then(({ blog }) => blog)

export const unfollow = (account) =>
  fetchAsPost(`${BASE}/unfollow`, { account })
  .then(({ blog }) => blog)

export const reblog = (account, id, reblog_key, { comment, native_inline_images } = {}) =>
  fetchAsPost(`${BASE}/reblog`, {
    account,
    id,
    reblog_key,
    comment,
    native_inline_images
  })
  .then(({ id }) => id)

/* used by explores */
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