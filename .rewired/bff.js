import rewire from 'rewire'
import fetch from 'node-fetch'
import { JSDOM } from 'jsdom'
import situation from '../situation.js'
import { fetchInterface, joinParams } from '../client/.src/util'
import { blog } from './v2.js'

global.fetch = fetch
global.Headers = fetch.Headers

export default (port) => {

  const { CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET } = process.env
  const { app, jwt } = situation(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET)

  const Authorization = 'Bearer ' + jwt
  // const Authorization = 'Bearer'

  const fetchAsGet = (path, params) =>
    fetchInterface(
      path + joinParams(params),
      {
        method: 'GET',
        headers: new Headers({ Authorization })
      }
    )

  const fetchAsPost = (path, body) =>
    fetchInterface(
      path,
      {
        method: 'POST',
        headers: new Headers({ Authorization, 'content-type': 'application/json' }),
        body: JSON.stringify(body)
      }
    )

  const parseFromString = (string) => new JSDOM(string).window.document

  const coreModules = rewire('../client/.src/bff/core.js')
  coreModules.__set__({ BASE: `http://localhost:${port}/api`, fetchAsGet, fetchAsPost, parseFromString })
  const { user, followings, explores, dashboard, likes, follow, unfollow, reblog } = coreModules

  const hoiModules = rewire('../client/.src/bff/hoi.js')
  hoiModules.__set__({ _core: { user, followings, explores, dashboard, likes, follow, unfollow, reblog } })
  hoiModules.__set__({ _core2: { blog } })
  const { HoPostsDashboard, HoPostsLikes, HoBlogsFollowings, HoBlogsExplores } = hoiModules

  return {
    app,
    modules: {
      user,
      followings,
      explores,
      dashboard,
      likes,
      follow,
      unfollow,
      reblog,
      HoPostsDashboard,
      HoPostsLikes,
      HoBlogsFollowings,
      HoBlogsExplores
    }
  }
}