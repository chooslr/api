import rewire from 'rewire'
import fetch from 'node-fetch'
import {
  posts,
  post,
  total,
  blog,
  avatar,
  samplingPosts,
  samplingTags,
  HoPosts,
  HoPostsRandom
} from '../client/.src/v2'

global.fetch = fetch

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