'use strict'

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var Koa = _interopDefault(require('koa'))
var Router = _interopDefault(require('koa-router'))
var Grant = _interopDefault(require('grant-koa'))
var app2mw = _interopDefault(require('koa-mount'))
var session = _interopDefault(require('koa-session'))
var proxy = _interopDefault(require('koa-proxies'))
var bodyParser = _interopDefault(require('koa-bodyparser'))
var jwt = _interopDefault(require('koa-jwt'))
var OAuth = _interopDefault(require('oauth-1.0a'))
var got = _interopDefault(require('got'))
var jsonwebtoken = _interopDefault(require('jsonwebtoken'))
var join = _interopDefault(require('url-join'))
var assert = _interopDefault(require('assert'))
var crypto = require('crypto')

const endpoints = {
  info: '/info',
  followings: '/followings',
  explores: '/explores',
  search: '/search',
  dashboard: '/dashboard',
  likes: '/likes',
  follow: '/follow',
  unfollow: '/unfollow',
  reblog: '/reblog',
  delete: '/delete',
  extract: '/extract'
}

const joinParams = (params = {}) => {
  const valids = Object.entries(params).filter(([key, value]) => value)
  return valids.length
    ? '?' + valids.map(([key, value]) => `${key}=${value}`).join('&')
    : ''
}

const ORIGIN = 'https://api.tumblr.com'
const BASE_URL = join(ORIGIN, 'v2')
const IDENTIFIER_URL = name => `${name}.tumblr.com`

const USER_URL = join(BASE_URL, 'user')
const INFO_URL = join(USER_URL, 'info')
const FOLLOWINGS_URL = join(USER_URL, 'following')
const DASHBOARD_URL = join(USER_URL, 'dashboard')
const LIKES_URL = join(USER_URL, 'likes')
const FOLLOW_URL = join(USER_URL, 'follow')
const UNFOLLOW_URL = join(USER_URL, 'unfollow')

const BLOG_URL = join(BASE_URL, 'blog')
const REBLOG_URL = name => join(BLOG_URL, IDENTIFIER_URL(name), '/post/reblog')
const DELETE_URL = name => join(BLOG_URL, IDENTIFIER_URL(name), '/post/delete')

const PAGE_URL = name => `https://${IDENTIFIER_URL(name)}`
const SEARCH_URL = (name, word) => `${PAGE_URL(name)}/search/${word}`

const EXPLORE_URLs = [
  'trending',
  'staff-picks',
  'text',
  'photos',
  'gifs',
  'quotes',
  'video'
].map(type => join('https://www.tumblr.com/explore', type))

var middleware = (app, config) => {
  assert(app, 'required app')

  const {
    prefix = '/',
    timeout = 10000,
    consumerKey,
    consumerSecret,
    grantServer,
    jwt: { secret: jwtSecret, options: jwtOpts, cookie: jwtCookie } = {}
  } =
    config || {}

  const [jwtCookieName, jwtCookieOpts] = Array.isArray(jwtCookie)
    ? jwtCookie
    : [jwtCookie, undefined]

  assert(prefix, 'required config.prefix')
  assert(consumerKey, 'required config.consumerKey')
  assert(consumerSecret, 'required config.consumerSecret')
  assert(typeof grantServer === 'object', 'required config.grantServer')
  assert(jwtSecret, 'required config.jwt.secret')
  assert(jwtCookieName, 'required config.jwt.cookie')

  if (prefix !== '/' && !grantServer.path) {
    grantServer.path = prefix
  }

  const jwtStateName = 'payload'
  const proxyPath = '/proxy'
  const grantCallbackPath = '/attached'
  const sessionCookieName = 'chooslr:sess'
  const redirectCookieName = 'chooslr:redirect_url'
  const errorHandler = HigherOrderErrorHandler(timeout)
  const oauthAuthorization = HigherOrderAuthorization(
    consumerKey,
    consumerSecret
  )

  const router = new Router()
    .get(
      `${proxyPath}**`,
      proxy('*', {
        target: ORIGIN,
        changeOrigin: true,
        rewrite: path =>
          path.split(proxyPath).join('') +
          (path.includes('api_key')
            ? ''
            : (path.includes('?') ? '&' : '?') + `api_key=${consumerKey}`)
      })
    )
    .get('/attach', ctx => {
      ctx.cookies.set(redirectCookieName, ctx.query.redirect_url || '/')
      ctx.redirect(join(ctx.mountPath, 'connect/tumblr'))
    })
    .get(grantCallbackPath, ctx => {
      const { access_token: token, access_secret: secret } = ctx.query
      const jwt$$1 = jsonwebtoken.sign({ token, secret }, jwtSecret, jwtOpts)
      ctx.cookies.set(jwtCookieName, jwt$$1, jwtCookieOpts)

      const redirect_url = ctx.cookies.get(redirectCookieName)
      ctx.cookies.set(redirectCookieName)
      ctx.cookies.set(sessionCookieName)
      ctx.redirect(redirect_url)
    })
    .get('/detach', ctx => {
      ctx.cookies.set(jwtCookieName)
      ctx.redirect(ctx.query.redirect_url || '/')
    })
    .get(
      endpoints['extract'],
      ctx =>
        (ctx.body = {
          meta: { status: 200 },
          response: { jwt: ctx.cookies.get(jwtCookieName, jwtCookieOpts) }
        })
    )
    .get(endpoints['explores'], errorHandler, async ctx => {
      const pwgs = EXPLORE_URLs.map(url =>
        got.get(url).then(({ body }) => body)
      )
      const htmls = await Promise.all(pwgs)
      ctx.body = { meta: { status: 200, msg: 'OK' }, response: { htmls } }
    })
    .get(endpoints['search'], errorHandler, async ctx => {
      const { name, word, page = 1 } = ctx.query
      ctx.assert(name && word, 400, '/search need { name, word } as query')

      const url =
        SEARCH_URL(name, encodeURIComponent(word)) +
        joinParams({ page, format: 'json' })

      const jsonpString = await got(url).then(({ body }) => body)
      const jsonString = jsonpString.slice(
        jsonpString.indexOf('{'),
        jsonpString.length - 2
      )
      const { posts } = JSON.parse(jsonString)

      ctx.body = { meta: { status: 200, msg: 'OK' }, response: { posts } }
    })
    .use(
      /*
  jwtOpts: https://github.com/koajs/jwt/blob/27344cc23949f6dafe08cd3e88505ea4f25af048/lib/index.js#L36
  jwtCookieOpts: https://github.com/koajs/jwt/blob/27344cc23949f6dafe08cd3e88505ea4f25af048/lib/index.js#L19
  */
      jwt(
        Object.assign({}, jwtOpts, jwtCookieOpts, {
          cookie: jwtCookieName,
          secret: jwtSecret,
          key: jwtStateName,
          passthrough: false
        })
      )
    )
    .get(endpoints['info'], errorHandler, async ctx => {
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
    })
    .get(endpoints['followings'], errorHandler, async ctx => {
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
    })
    .get(endpoints['dashboard'], errorHandler, async ctx => {
      const {
        limit,
        offset,
        type,
        since_id,
        before_id,
        reblog_info,
        notes_info
      } = ctx.query

      const url =
        DASHBOARD_URL +
        joinParams({
          limit,
          offset,
          type,
          since_id,
          before_id,
          reblog_info,
          notes_info
        })
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
    })
    .get(endpoints['likes'], errorHandler, async ctx => {
      const {
        limit,
        offset,
        before,
        after,
        reblog_info,
        notes_info
      } = ctx.query

      const url =
        LIKES_URL +
        joinParams({ limit, offset, before, after, reblog_info, notes_info })
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
    })
    .use(bodyParser())
    .post(endpoints['follow'], errorHandler, async ctx => {
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
    })
    .post(endpoints['unfollow'], errorHandler, async ctx => {
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
    })
    .post(endpoints['reblog'], errorHandler, async ctx => {
      const {
        name,
        id,
        reblog_key,
        comment,
        native_inline_images
      } = ctx.request.body
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
    })
    .post(endpoints['delete'], errorHandler, async ctx => {
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
    })

  return app2mw(
    prefix,
    new Koa()
      .use(router.routes())
      .use(router.allowedMethods({ throw: true }))
      .use(
        session(app, {
          key: sessionCookieName,
          maxAge: 'session',
          signed: false
        })
      )
      .use(
        app2mw(
          new Grant({
            server: grantServer,
            tumblr: {
              key: consumerKey,
              secret: consumerSecret,
              callback: join(prefix, grantCallbackPath)
            }
          })
        )
      )
  )
}

const HigherOrderAuthorization = (key, secret) => {
  const oauth = OAuth({
    consumer: { key, secret },
    signature_method: 'HMAC-SHA1',
    hash_function: (base_string, key) =>
      crypto
        .createHmac('sha1', key)
        .update(base_string)
        .digest('base64')
  })

  return (url, method, key, secret) => {
    const authorized = oauth.authorize({ url, method }, { key, secret })
    const { Authorization } = oauth.toHeader(authorized)
    return Authorization
  }
}

const HigherOrderErrorHandler = timeout => async (ctx, next) => {
  ctx.req.setTimeout(timeout)

  try {
    await next()
  } catch (e) {
    console.error(e)
    ctx.status = e.status || 500
    ctx.set('Content-Type', 'application/problem+json; charset=utf-8')
    ctx.body = {
      meta: { status: ctx.status, msg: e.message || 'Internal Server Error' }
    }
  }
}

module.exports = middleware
