import createMock from './mock.js'
import { outputJson } from 'fs-extra'

const output = async () => {

  const port = 7000
  const prefix = '/snap'
  const { CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET } = process.env
  const { app, client: { default: Chooslr } } = createMock(prefix, CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET)
  const server = app.listen(port)
  const chooslr = new Chooslr(`http://localhost:${port}${prefix}`, { api_key: CONSUMER_KEY })

  // user
  const user = await chooslr.user()
  user.blogs = [ extractZero(user.blogs) ]

  // followings
  const followings = [ await chooslr.followings({ limit: 1 }).then(extractZero) ]

  // dashboard & likes
  const feedDashboard = await chooslr.generateDashboard()
  const feedLikes = await chooslr.generateLikes()
  const feedDashboardReblog = await chooslr.generateDashboard({ reblog_info: true })
  const feedDashboardNotes = await chooslr.generateDashboard({ notes_info: true })

  const dashboard = await recursiveResult(HoAfn(feedDashboard))
  const likes = await recursiveResult(HoAfn(feedLikes))

  const extractExclude = HoExtractExclude(Object.keys(dashboard))

  const reblog_afn = HoAfn(feedDashboardReblog, (post) => Object.keys(post).find(key => key.search('reblogged') !== -1))
  const reblog_info = await recursiveResult(reblog_afn).then(extractExclude)

  const notes_afn = HoAfn(feedDashboardNotes, (post) => Object.keys(post).includes('notes'))
  const notes_info = await recursiveResult(notes_afn).then(extractExclude)
  notes_info.notes = notes_info.notes.slice(0, 4)

  const posts = [ dashboard, likes ]
  const common = createCommon(posts)
  Object.keys(common).forEach(key => posts.forEach(post => delete post[key]))

  server.close(() =>
    outputJson(
      `snap.json`,
      { user, followings, post: { common, dashboard, likes, reblog_info, notes_info } },
      { spaces: '  ' }
    )
  )
}

const extractZero = ([zero]) => zero

const HoExtractExclude = (excludes) =>
  (post) => {
    const result = {}
    const excludes_keys = Array.isArray(excludes) ? excludes : excludes(post)

    Object
    .keys(post)
    .filter(key => !excludes_keys.includes(key))
    .forEach(key => result[key] = post[key])

    return result
  }

const createCommon = (posts) => {
  const result = {}
  const properties = new Map()

  posts.forEach(post =>
    Object.keys(post).forEach(key =>
      !properties.has(key) &&
      properties.set(key, post[key])
    )
  )

  ;[...properties.keys()]
  .filter(key => posts.every(post => Object.keys(post).includes(key)))
  .forEach(key => result[key] = properties.get(key))

  return result
}

const HoAfn = (feed, filter) =>
  () =>
    feed()
    .then(({ value: posts }) => posts)
    .then(posts => posts.filter(post => post.type === 'quote'))
    .then(posts =>
      typeof filter === 'function'
      ? posts.filter(filter)
      : posts
    )
    .then(extractZero)

const recursiveResult = (afn) => afn().then(result => result || recursiveResult(afn))

output().catch(err => console.error(err))