import tiloop, { IndexesZero, IndexesRandom } from 'tiloop'
import { total as fetchTotal, posts as fetchPosts } from './core.js'
import { asserts, wrapIteratorAsAsync } from '../util'

const MAX_INCREMENT = 50

export const HoPosts = async (account, params) => {

  const {
    start = 0,
    num = MAX_INCREMENT,
    type,
    tag,
    filter
  } = params || {}

  asserts(num <= MAX_INCREMENT, 'HoPosts > invalid num')

  const total = await fetchTotal(account, { type, tag })

  asserts(start < total, 'HoPosts > invalid start')

  const iterator = tiloop(
    new IndexesZero({
      length: total - start,
      maxIncrement: num
    }),
    (indexedArr) =>
      fetchPosts(account, {
        start: indexedArr[0] + start,
        num: indexedArr.length,
        type,
        tag,
        filter
      })
  )

  return wrapIteratorAsAsync(iterator)
}

export const HoPostsRandom = async (account, params) => {

  const {
    start = 0,
    num = MAX_INCREMENT,
    type,
    tag,
    filter
  } = params || {}

  asserts(num <= MAX_INCREMENT, 'HoPostsRandom > invalid num')

  const total = await fetchTotal(account, { type, tag })

  asserts(start < total, 'HoPostsRandom > invalid start')

  const iterator = tiloop(
    new IndexesRandom({
      length: total - start,
      maxIncrement: num
    }),
    (indexedArr) =>
      fetchPosts(account, {
        start: indexedArr[0] + start,
        num: indexedArr.length,
        type,
        tag,
        filter
      })
  )

  return wrapIteratorAsAsync(iterator)
}