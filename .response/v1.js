import * as api from '../.rewire/v1.js'
import { outputJson } from 'fs-extra'
import {
  outpath,
  account,
  spaces,
  extractZero,
  createCommon
} from './.util.js'

const output = async () => {

  const postByType = (type) => api.posts(account, { num: 1, type }).then(extractZero)

  const quote = await postByType('quote')
  const text = await postByType('text')
  const chat = await postByType('chat')
  const photo = await postByType('photo')
  const link = await postByType('link')
  const video = await postByType('video')
  const audio = await postByType('audio')

  const posts = [ quote, text, chat, photo, link, video, audio ]
  const common = createCommon(posts)
  Object.keys(common).forEach(key => posts.forEach(post => delete post[key]))

  const blog = await api.blog(account)

  return outputJson(
    outpath('v1'),
    { blog, post: { common, quote, 'text/regular': text, 'chat/conversation': chat, photo, link, video, audio } },
    { spaces }
  )
}

output().catch(err => console.error(err))