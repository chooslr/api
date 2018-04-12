export const identifier = account => `${account}.tumblr.com`

export const fetchInterface = (...arg) =>
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

const isSuccess = status =>
  status === 200 ||
  status === 201

const throws = (message, isType) => {
  throw isType ? new TypeError(message) : new Error(message)
}

export const asserts = (condition, message, isType) => !condition && throws(message, isType)

export const joinParams = (params = {}) => {
  const valids = Object.entries(params).filter(([key,value]) => paramFilter(value))
  return valids.length
    ? '?' + valids.map(([key,value]) => `${key}=${value}`).join('&')
    : ''
}

const paramFilter = (value) =>
  Boolean(value) ||
  typeof value === 'number'

export const arrToUniques = (arr) => [...new Set(arr).values()]

export const SAMPLING_DENOM = 4
export const SAMPLING_MAX_NUM = 3

export const wrapIteratorAsAsync = (iterator) =>
  () => {
    const { done, value } = iterator.next()
    return Promise.resolve(value).then(res => ({ res, done }))
  }

export const feedArrayRecursiveTillDone = async (feed, set = new Set()) => {
  const { done, res: fetched_posts } = await feed()
  fetched_posts.forEach(post => set.add(post))
  return done
    ? [...set.values()]
    : feedArrayRecursiveTillDone(feed, set)
}

export const postsToTags = (posts) =>
  arrToUniques(
    [].concat(...
      posts
      .filter(({ tags }) => tags)
      .map(({ tags }) => tags)
    )
  )