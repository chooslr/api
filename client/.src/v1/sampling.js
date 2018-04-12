import tiloop, { IndexesRandom } from 'tiloop'
import { total as fetchTotal, posts as fetchPosts } from './core.js'
import {
  SAMPLING_DENOM,
  SAMPLING_MAX_NUM,
  wrapIteratorAsAsync,
  feedArrayRecursiveTillDone,
  postsToTags,
  asserts
} from '../util'

export const samplingPosts = async (account, params) => {

  const {
    type,
    denom = SAMPLING_DENOM,
    maxNum = SAMPLING_MAX_NUM
  } = params || {}

  const length = await fetchTotal(account)
  asserts(length > 0, 'sampling account has no posts')

  const maxIncrement = Math.floor(length / denom)
  asserts(maxIncrement > 0, 'sampling account has no posts')

  const iterator = tiloop(
    new IndexesRandom({ length, maxIncrement }),
    (indexedArr) =>
      fetchPosts(account, {
        type,
        start: indexedArr[0],
        num: indexedArr.length < maxNum
          ? indexedArr.length
          : maxNum
      })
  )

  const feed = wrapIteratorAsAsync(iterator)
  const posts = await feedArrayRecursiveTillDone(feed)

  return posts
}

export const samplingTags = (...arg) => samplingPosts(...arg).then(postsToTags)