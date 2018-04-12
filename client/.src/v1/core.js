import jsonp from 'jsonp-simple'
import { identifier, joinParams } from '../util'

const BASE = account => `https://${identifier(account)}`
const API_URL = account => `${BASE(account)}/api/read/json`

const v1API = (account, { start, num, type, tag, id, filter } = {}, timeout = 5000) =>
  jsonp(
    API_URL(account) + joinParams({
      start,
      num,
      type,
      tagged: tag,
      id,
      filter
    }),
    timeout
  )

export const posts = (account, options, timeout) =>
  v1API(account, options, timeout)
  .then(({ posts }) => posts)

export const post = (account, id, timeout) =>
  v1API(account, { id }, timeout)
  .then(({ posts }) => posts[0])

export const total = (account, { type, tag } = {}, timeout) =>
  v1API(account, { num: 0, type, tag }, timeout)
  .then(res => res['posts-total'])

export const blog = (account, timeout) =>
  v1API(account, { num: 0 }, timeout)
  .then(({ tumblelog }) => tumblelog)