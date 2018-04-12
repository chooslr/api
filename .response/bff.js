import Bff from '../.rewire/bff.js'
import { outputJson } from 'fs-extra'
import {
  outpath,
  account,
  spaces,
  extractZero,
  HoExtractExclude,
  createCommon
} from './.util.js'

const output = async () => {
  const port = 7000
  const { server: app, modules: api } = Bff(port)
  const server = app.listen(port)

  const destructRes = ({ res: posts }) => posts
  const typeFilter = (posts) => posts.filter(post => post.type === 'quote')

  const HoAfn = (feed, filter) =>
    () =>
      feed()
      .then(destructRes)
      .then(typeFilter)
      .then(posts =>
        typeof filter === 'function'
        ? posts.filter(filter)
        : posts
      )
      .then(extractZero)

  const recursiveResult = (afn) => afn().then(result => result || recursiveResult(afn))

  const feedDashboard = await api.HoPostsDashboard()
  const feedLikes = await api.HoPostsLikes()
  const feedDashboardReblog = await api.HoPostsDashboard({ reblog_info: true })
  const feedDashboardNotes = await api.HoPostsDashboard({ notes_info: true })

  const dashboard = await recursiveResult(HoAfn(feedDashboard))
  const likes = await recursiveResult(HoAfn(feedLikes))

  const extractExclude = HoExtractExclude(Object.keys(dashboard))
  const reblog_callback = HoAfn(feedDashboardReblog, (post) => Object.keys(post).find(key => key.search('reblogged') !== -1))
  const notes_callback = HoAfn(feedDashboardNotes, (post) => Object.keys(post).includes('notes'))
  const reblog_info = await recursiveResult(reblog_callback).then(extractExclude)
  const notes_info = await recursiveResult(notes_callback).then(extractExclude)
  notes_info.notes = notes_info.notes.slice(0, 4)

  const posts = [ dashboard, likes ]
  const common = createCommon(posts)
  Object.keys(common).forEach(key => posts.forEach(post => delete post[key]))

  const user = await api.user()
  user.blogs = [ extractZero(user.blogs) ]

  const followings = [ await api.followings({ limit: 1 }).then(extractZero) ]

  server.close(() =>
    outputJson(
      outpath('bff'),
      { user, followings, post: { common, dashboard, likes, reblog_info, notes_info } },
      { spaces }
    )
  )
}

output().catch(err => console.error(err))