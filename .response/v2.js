import * as api from '../.rewire/v2.js'
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

  const arg = [account, process.env.CONSUMER_KEY]

  const fetchPostByType = (type) => api.posts(...arg, { limit: 1, type }).then(extractZero)

  const fetchPostWithExcludes = (type, extractExclude) => api.posts(...arg, { limit: 1, [type]: true }).then(extractZero).then(extractExclude)

  const quote = await fetchPostByType('quote')
  const text = await fetchPostByType('text')
  const chat = await fetchPostByType('chat')
  const photo = await fetchPostByType('photo')
  const link = await fetchPostByType('link')
  const video = await fetchPostByType('video')
  const audio = await fetchPostByType('audio')
  const answer = await fetchPostByType('answer')

  const map = { quote, text, chat, photo, link, video, audio, answer }

  const extractExclude = HoExtractExclude(({ type }) => Object.keys(map[type]))
  const reblog_info = await fetchPostWithExcludes('reblog_info', extractExclude)
  const notes_info = await fetchPostWithExcludes('notes_info', extractExclude)
  notes_info.notes = notes_info.notes.slice(0, 4)

  const posts = Object.values(map)
  const common = createCommon(posts)
  Object.keys(common).forEach(key => posts.forEach(post => delete post[key]))

  const blog = await api.blog(...arg)

  return outputJson(
    outpath('v2'),
    { blog, post: { common, quote, text, chat, photo, link, video, audio, answer, reblog_info, notes_info } },
    { spaces }
  )
}

output().catch(err => console.error(err))