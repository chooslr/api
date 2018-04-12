import tiloop, { IndexesZero, IndexesRandom } from 'tiloop'
import { total as fetchTotal, posts as fetchPosts } from './core.js'
import { asserts, wrapIteratorAsAsync } from '../util'

const MAX_INCREMENT = 20

export const HoPosts = async (account, api_key, params) => {

  const {
    offset = 0,
    limit = MAX_INCREMENT,
    type,
    tag,
    reblog_info,
    notes_info,
    filter
  } = params || {}

  asserts(limit <= MAX_INCREMENT, 'HoPosts > invalid limit')

  const total = await fetchTotal(account, api_key, { type, tag })

  asserts(offset < total, 'HoPosts > invalid offset')

  const iterator = tiloop(
    new IndexesZero({
      length: total - offset,
      maxIncrement: limit
    }),
    (indexedArr) =>
      fetchPosts(account, api_key, {
        offset: indexedArr[0] + offset,
        limit: indexedArr.length,
        type,
        tag,
        reblog_info,
        notes_info,
        filter
      })
  )

  return wrapIteratorAsAsync(iterator)
}

export const HoPostsRandom = async (account, api_key, params) => {

  const {
    offset = 0,
    limit = MAX_INCREMENT,
    type,
    tag,
    reblog_info,
    notes_info,
    filter
  } = params || {}

  asserts(limit <= MAX_INCREMENT, 'HoPostsRandom > invalid limit')
  
  const total = await fetchTotal(account, api_key, { type, tag })

  asserts(offset < total, 'HoPostsRandom > invalid offset')

  const iterator = tiloop(
    new IndexesRandom({
      length: total - offset,
      maxIncrement: limit
    }),
    (indexedArr) =>
      fetchPosts(account, api_key, {
        offset: indexedArr[0] + offset,
        limit: indexedArr.length,
        type,
        tag,
        reblog_info,
        notes_info,
        filter
      })
  )

  return wrapIteratorAsAsync(iterator)
}