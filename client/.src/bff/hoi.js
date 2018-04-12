import tiloop, { IndexesZero } from 'tiloop'
import { user, dashboard, likes, followings, explores } from './core.js'
import { blog } from '../v2/core.js'
import { asserts, wrapIteratorAsAsync } from '../util'

function* loopYieldGenerator(yielded) {
  while (true) {
    yield yielded()
  }
}

export const HoPostsDashboard = ({ offset = 0, limit = 20, type, reblog_info, notes_info } = {}) => {

  asserts(limit <= 20, 'invalid limit')

  const params = {
    before_id: undefined,
    offset,
    limit,
    type,
    reblog_info,
    notes_info
  }

  const iterator = loopYieldGenerator(() =>
    dashboard(params)
    .then(posts => {
      params.before_id = posts[posts.length - 1].id
      params.offset = undefined
      return posts
    })
  )

  return wrapIteratorAsAsync(iterator)
}

export const HoPostsLikes = async ({ total, limit = 20, offset = 0, reblog_info, notes_info } = {}) => {

  asserts(limit <= 20, 'invalid limit')

  total = total || await user().then(({ likes }) => likes)

  asserts(typeof total === 'number' && total !== -1, 'invalid total')

  const params = {
    before: undefined,
    offset,
    limit,
    reblog_info,
    notes_info
  }

  const iterator = tiloop(
    new IndexesZero({
      length: total - offset,
      maxIncrement: limit
    }),
    (indexedArr) =>
      likes(params)
      .then(posts => {
        posts = posts.slice(0, indexedArr.length)
        params.before = posts[posts.length - 1].liked_timestamp
        params.offset = undefined
        return posts
      })
  )

  return wrapIteratorAsAsync(iterator)
}

export const HoBlogsFollowings = async ({ total, limit = 20, offset = 0 } = {}) => {

  asserts(limit <= 20, 'invalid limit')

  total = total || await user().then(({ following }) => following)

  asserts(typeof total === 'number' && total !== -1, 'invalid total')

  const iterator = tiloop(
    new IndexesZero({
      length: total - offset,
      maxIncrement: limit
    }),
    (indexedArr) =>
      followings({
        offset: indexedArr[0],
        limit: indexedArr.length
      })
  )

  return wrapIteratorAsAsync(iterator)
}

export const HoBlogsExplores = async (api_key, { names, limit = 20 } = {}) => {

  asserts(api_key, 'invalid api_key')

  names = names || await explores()

  const iterator = tiloop(
    new IndexesZero({
      length: names.length,
      maxIncrement: limit
    }),
    (indexedArr) =>
      Promise.all(
        indexedArr.map(index =>
          blog(names[index], api_key)
          .catch(err => undefined)
        )
      )
      .then(blogs => blogs.filter(blog => blog))
  )

  return wrapIteratorAsAsync(iterator)
}
