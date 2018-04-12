import { fetchInterface, identifier, joinParams } from '../util'

const BASE = 'https://api.tumblr.com/v2/blog'
const API_URL = account => `${BASE}/${identifier(account)}`
const method = 'GET'
const mode = 'cors'

const postsAPI = (account, api_key, { type, tag, id, limit, offset, reblog_info, notes_info, filter } = {}) =>
  fetchInterface(
    `${API_URL(account)}/posts` + joinParams({
      api_key,
      type,
      tag,
      id,
      limit,
      offset,
      reblog_info,
      notes_info,
      filter
    }),
    { method, mode }
  )

const infoAPI = (account, api_key) =>
  fetchInterface(
    `${API_URL(account)}/info` + joinParams({ api_key }),
    { method, mode }
  )

export const posts = (account, api_key, params) =>
  postsAPI(account, api_key, params)
  .then(({ posts }) => posts)

export const post = (account, api_key, id, { reblog_info, notes_info } = {}) =>
  postsAPI(account, api_key, { id, reblog_info, notes_info })
  .then(({ posts }) => posts[0])

export const total = (account, api_key, { type, tag } = {}) =>
  postsAPI(account, api_key, { limit: 1, type, tag })
  .then(({ total_posts }) => total_posts)

export const blog = (account, api_key) =>
  infoAPI(account, api_key)
  .then(({ blog }) => blog)

export const avatar = (account, size = 64) =>
  `${API_URL(account)}/avatar/${size}`