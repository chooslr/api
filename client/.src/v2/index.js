import {
  posts,
  post,
  total,
  blog,
  avatar
} from './core.js'
import {
  samplingPosts,
  samplingTags
} from './sampling.js'
import {
  HoPosts,
  HoPostsRandom
} from './hoi.js'

export {
  posts,
  post,
  total,
  blog,
  avatar,
  samplingPosts,
  samplingTags,
  HoPosts,
  HoPostsRandom
}

export const POST_TYPES = [
  'quote',
  'text',
  'chat',
  'photo',
  'link',
  'video',
  'audio',
  'answer'
]

export default class TumblrCors {
  constructor(api_key) {
    this.api_key = api_key
  }

  posts(account, params) {
    return posts(account, this.api_key, params)
  }

  post(account, id, params) {
    return post(account, this.api_key, id, params)
  }

  total(account, params) {
    return total(account, this.api_key, params)
  }

  blog(account) {
    return blog(account, this.api_key)
  }

  avatar(account, size = 64) {
    return avatar(account, size)
  }

  samplingPosts(account, params) {
    return samplingPosts(account, this.api_key, params)
  }

  samplingTags(account, params) {
    return samplingTags(account, this.api_key, params)
  }

  HoPosts() {
    return HoPosts(account, this.api_key, params)
  }

  HoPostsRandom() {
    return HoPostsRandom(account, this.api_key, params)
  }
}