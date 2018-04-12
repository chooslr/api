import rewire from 'rewire'
import fetch from 'node-fetch'

const coreModules = rewire('../client/.src/v1/core.js')

const jsonp = (src, timeout) =>
  fetch(src)
  .then(res => res.text())
  .then(text =>
    JSON.parse(
      text.slice(
        text.indexOf('{'),
        text.length - 2
      )
    )
  )

coreModules.__set__({ _jsonpSimple2: { default: jsonp } })

const { posts, post, total, blog } = coreModules

const hoiModules = rewire('../client/.src/v1/hoi.js')
const samplingModules = rewire('../client/.src/v1/sampling.js')
const _core = { posts, post, total, blog }

hoiModules.__set__({ _core })
samplingModules.__set__({ _core })

const { HoPosts, HoPostsRandom } = hoiModules
const { samplingPosts, samplingTags } = samplingModules

export {
  posts,
  post,
  total,
  blog,
  samplingPosts,
  samplingTags,
  HoPosts,
  HoPostsRandom
}