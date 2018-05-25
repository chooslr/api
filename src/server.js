import Koa from 'koa'
import Router from 'koa-router'
import Grant from 'grant-koa'
import app2mw from 'koa-mount'
import session from 'koa-session'
import proxy from 'koa-proxies'
import bodyParser from 'koa-bodyparser'
import jwt from 'koa-jwt'
import OAuth from 'oauth-1.0a'
import got from 'got'
import jsonwebtoken from 'jsonwebtoken'
import join from 'url-join'
import assert from 'assert'
import { createHmac } from 'crypto'
import { endpoints, joinParams } from './universal.js'

const ORIGIN = 'https://api.tumblr.com'
const BASE_URL = join(ORIGIN, 'v2')
const IDENTIFIER_URL = (name) => `${name}.tumblr.com`

const USER_URL = join(BASE_URL, 'user')
const INFO_URL = join(USER_URL, 'info')
const FOLLOWINGS_URL = join(USER_URL, 'following')
const DASHBOARD_URL = join(USER_URL, 'dashboard')
const LIKES_URL = join(USER_URL, 'likes')
const FOLLOW_URL = join(USER_URL, 'follow')
const UNFOLLOW_URL = join(USER_URL, 'unfollow')

const BLOG_URL = join(BASE_URL, 'blog')
const REBLOG_URL = (name) => join(BLOG_URL, IDENTIFIER_URL(name), '/post/reblog')
const DELETE_URL = (name) => join(BLOG_URL, IDENTIFIER_URL(name), '/post/delete')

const EXPLORE_URLs = [
  'trending',
  'staff-picks',
  'text',
  'photos',
  'gifs',
  'quotes',
  'video'
].map(type => join('https://www.tumblr.com/explore', type))

const HigherOrderAuthorization = (key, secret) => {

  const oauth = OAuth({
    consumer: { key, secret },
    signature_method: 'HMAC-SHA1',
    hash_function: (base_string, key) => createHmac('sha1', key).update(base_string).digest('base64')
  })

  return (url, method, key, secret) => {
    const authorized = oauth.authorize({ url, method }, { key, secret })
    const { Authorization } = oauth.toHeader(authorized)
    return Authorization
  }
}

const HigherOrderErrorHandler = (timeout) => async (ctx, next) => {

  ctx.req.setTimeout(timeout)

  try {
    await next()
  } catch (e) {
    console.error(e)
    ctx.status = e.status || 500
    ctx.set('Content-Type', 'application/problem+json; charset=utf-8')
    ctx.body = { meta: { status: ctx.status, msg: e.message || 'Internal Server Error' } }
  }
}

const jwtStateName = 'payload'
const proxyPath = '/proxy'
const grantCallback = '/attached'
const sessionCookieName = 'chooslr:sess'

export default (app, config) => {

  assert(app, 'required config.app')

  const {
    prefix = '/',
    apiTimeout = 10000,
    consumerKey,
    consumerSecret,
    grantServer,
    grantCallbackRedirect = '/',
    jwt: { secret: jwtSecret, cookie: jwtCookie } = {},
  } = config || {}

  const [ jwtCookieName, jwtCookieOpts ] = Array.isArray(jwtCookie) ? jwtCookie : [ jwtCookie, undefined ]

  assert(prefix, 'required config.prefix')
  assert(consumerKey, 'required config.consumerKey')
  assert(consumerSecret, 'required config.consumerSecret')
  assert(typeof grantServer === 'object', 'required config.grantServer')
  assert(jwtSecret, 'required config.jwt.secret')
  assert(jwtCookieName, 'required config.jwt.cookie')

  if (prefix !== '/' && !grantServer.path) {
    grantServer.path = prefix
  }

  const oauthAuthorization = HigherOrderAuthorization(consumerKey, consumerSecret)
  const errorHandler = HigherOrderErrorHandler(apiTimeout)

  const router = new Router()
  .get(
    '/attach',
    (ctx) => ctx.redirect(join(ctx.mountPath, 'connect/tumblr'))
  )
  .get(
    grantCallback,
    (ctx) => {
      const { access_token: token, access_secret: secret } = ctx.query
      ctx.cookies.set(jwtCookieName, jsonwebtoken.sign({ token, secret }, jwtSecret), jwtCookieOpts)
      ctx.cookies.set(sessionCookieName)
      ctx.redirect(grantCallbackRedirect)
    }
  )
  .get(
    '/detach',
    (ctx) => {
      ctx.cookies.set(jwtCookieName)
      ctx.redirect(grantCallbackRedirect)
    }
  )
  .get(
    endpoints['explores'],
    errorHandler,
    async (ctx) => {
      const pwgs = EXPLORE_URLs.map(url => got.get(url).then(({ body }) => body))
      const htmls = await Promise.all(pwgs)
      ctx.body = { meta: { status: 200, msg: 'OK' }, response: { htmls } }
    }
  )
  .use(
    jwt(Object.assign({}, jwtCookieOpts, {
      cookie: jwtCookieName,
      secret: jwtSecret,
      key: jwtStateName,
      passthrough: false
    }))
  )
  .get(
    endpoints['info'],
    errorHandler,
    async (ctx) => {

      const url = INFO_URL
      const method = 'GET'
      const { token, secret } = ctx.state[jwtStateName]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, token, secret)
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
    }
  )
  .get(
    endpoints['followings'],
    errorHandler,
    async (ctx) => {

      const { limit, offset } = ctx.query

      const url = FOLLOWINGS_URL + joinParams({ limit, offset })
      const method = 'GET'
      const { token, secret } = ctx.state[jwtStateName]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, token, secret)
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
    }
  )
  .get(
    endpoints['dashboard'],
    errorHandler,
    async (ctx) => {

      const { limit, offset, type, since_id, before_id, reblog_info, notes_info } = ctx.query

      const url = DASHBOARD_URL + joinParams({ limit, offset, type, since_id, before_id, reblog_info, notes_info })
      const method = 'GET'
      const { token, secret } = ctx.state[jwtStateName]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, token, secret)
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
    }
  )
  .get(
    endpoints['likes'],
    errorHandler,
    async (ctx) => {

      const { limit, offset, before, after, reblog_info, notes_info } = ctx.query

      const url = LIKES_URL + joinParams({ limit, offset, before, after, reblog_info, notes_info })
      const method = 'GET'
      const { token, secret } = ctx.state[jwtStateName]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, token, secret)
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
    }
  )
  .get(
    endpoints['extract'],
    (ctx) => {
      const { token, secret } = ctx.state[jwtStateName]
      ctx.body = { meta: { status: 200 }, response: { [jwtStateName]: { token, secret } } }
    }
  )
  .use(bodyParser())
  .post(
    endpoints['follow'],
    errorHandler,
    async (ctx) => {

      const { name } = ctx.request.body
      ctx.assert(name, 400, '/follow need { name } as body')

      const url = FOLLOW_URL
      const method = 'POST'
      const { token, secret } = ctx.state[jwtStateName]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, token, secret)
        },
        body: {
          url: `http://${IDENTIFIER_URL(name)}`
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
    }
  )
  .post(
    endpoints['unfollow'],
    errorHandler,
    async (ctx) => {

      const { name } = ctx.request.body
      ctx.assert(name, 400, '/unfollow need { name } as body')

      const url = UNFOLLOW_URL
      const method = 'POST'
      const { token, secret } = ctx.state[jwtStateName]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, token, secret)
        },
        body: {
          url: `http://${IDENTIFIER_URL(name)}`
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
    }
  )
  .post(
    endpoints['reblog'],
    errorHandler,
    async (ctx) => {

      const { name, id, reblog_key, comment, native_inline_images } = ctx.request.body
      ctx.assert(name, 400, '/reblog need { name } as body')
      ctx.assert(id, 400, '/reblog need { id } as body')
      ctx.assert(reblog_key, 400, '/reblog need { reblog_key } as body')

      const url = REBLOG_URL(name)
      const method = 'POST'
      const { token, secret } = ctx.state[jwtStateName]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, token, secret)
        },
        body: {
          id,
          reblog_key,
          comment,
          native_inline_images
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
    }
  )
  .post(
    endpoints['delete'],
    errorHandler,
    async (ctx) => {

      const { name, id } = ctx.request.body
      ctx.assert(name, 400, '/delete need { name } as body')
      ctx.assert(id, 400, '/delete need { id } as body')

      const url = DELETE_URL(name)
      const method = 'POST'
      const { token, secret } = ctx.state[jwtStateName]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, token, secret)
        },
        body: { id }
      })

      ctx.body = await pwg.then(({ body }) => body)
    }
  )

  return app2mw(
    prefix,
    new Koa()
    .use(
      router.routes()
    )
    .use(
      router.allowedMethods({ throw: true })
    )
    .use(
      proxy(proxyPath, {
        target: ORIGIN,
        changeOrigin: true,
        rewrite: (path) =>
          path.split(proxyPath).join('') + (
            path.includes('api_key')
            ? ''
            : (path.includes('?') ? '&' : '?') + `api_key=${consumerKey}`
          )
      })
    )
    .use(
      session(app, {
        key: sessionCookieName,
        maxAge: 'session',
        signed: false
      })
    )
    .use(
      app2mw(new Grant({
        server: grantServer,
        tumblr: {
          key: consumerKey,
          secret: consumerSecret,
          callback: join(prefix, grantCallback)
        }
      }))
    )
  )
}