import jsonp from 'jsonp-simple'
import { identifier, joinParams } from './_util.js'

const BASE = account => `https://${identifier(account)}`
const API_URL = account => `${BASE(account)}/api/read/json`

const v1API = (account, { start, num, type, id, filter, tagged } = {}) =>
  jsonp(
    API_URL(account) + joinParams({
      start,
      num,
      type,
      id,
      filter,
      tagged
    })
  )

export const posts = (account, options) =>
  v1API(account, options)
  .then(({ posts }) => posts)

export const single = (account, id) =>
  v1API(account, { id })
  .then(({ posts }) => posts[0])

export const total = (account, { type, tag } = {}) =>
  v1API(account, { num: 0, type, tagged: tag })
  .then(res => res['posts-total'])

export const blog = (account) =>
  v1API(account, { num: 0 })
  .then(({ tumblelog }) => tumblelog)