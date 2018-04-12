const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')()
const jwtExtract = require('koa-jwt')
const jwtRestore = require('./custom-jwt')
const OAuth = require('oauth-1.0a')
const got = require('got')
const assert = require('assert')
const { createHmac } = require('crypto')

const BASE_URL = 'https://api.tumblr.com/v2'
const BLOG_URL = `${BASE_URL}/blog`
const USER_URL = `${BASE_URL}/user`
const INFO_URL = `${USER_URL}/info`
const FOLLOWINGS_URL = `${USER_URL}/following`
const DASHBOARD_URL = `${USER_URL}/dashboard`
const LIKES_URL = `${USER_URL}/likes`
const FOLLOW_URL = `${USER_URL}/follow`
const UNFOLLOW_URL = `${USER_URL}/unfollow`
const IDENTIFIER_URL = (account) => `${account}.tumblr.com`
const POST_URL = (account) => `${BLOG_URL}/${IDENTIFIER_URL(account)}/post`
const REBLOG_URL = (account) => `${POST_URL(account)}/reblog`
const DELETE_URL = (account) => `${POST_URL(account)}/delete`
const EXPLORE_URLs = [
  'trending',
  'staff-picks',
  'text',
  'photos',
  'gifs',
  'quotes',
  'video'
].map(type => `https://www.tumblr.com/explore/${type}`)

const joinParams = (params) => {
  const valids = Object.entries(params).filter(([key,value]) => value)
  return valids.length
    ? '?' + valids.map(([key,value]) => `${key}=${value}`).join('&')
    : ''
}

const HoOAuthAuthorization = (key, secret) => {
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

const API = (requires) => {

  const {
    timeout = 10000,
    encrypt: {
      algorithm: encrypt_algorithm = 'aes192',
      password: encrypt_password
    },
    jwt: {
      cookieName: jwt_cookie_name = 'chooslr:jwt',
      stateName: jwt_state_name = 'user',
      secret: jwt_secret
    },
    oauth: {
      consumerKey: oauth_consumer_key,
      consumerSecret: oauth_consumer_secret,
      tokenName: oauth_token_name = 'token',
      secretName: oauth_secret_name = 'secret'
    }
  } = requires

  assert(encrypt_password)
  assert(jwt_secret)
  assert(oauth_consumer_key)
  assert(oauth_consumer_secret)

  const rootMiddleware = async (ctx, next) => {
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

  const oauthAuthorization = HoOAuthAuthorization(oauth_consumer_key, oauth_consumer_secret)

  const jwtMiddlewares = [
    jwtExtract({
      key: jwt_state_name,
      cookie: jwt_cookie_name,
      secret: jwt_secret,
      passthrough: false
    }),
    jwtRestore({
      key: jwt_state_name,
      algorithm: encrypt_algorithm,
      password: encrypt_password
    })
  ]

  const router = new Router()
  .get(
    '/info',
    ...jwtMiddlewares,
    async (ctx, next) => {

      const url = INFO_URL
      const method = 'GET'
      const { [oauth_token_name]: oauth_token, [oauth_secret_name]: oauth_secret } = ctx.state[jwt_state_name]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, oauth_token, oauth_secret)
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
      await next()
    }
  )
  .get(
    '/followings',
    ...jwtMiddlewares,
    async (ctx, next) => {

      const { limit, offset } = ctx.query

      const url = FOLLOWINGS_URL + joinParams({ limit, offset })
      const method = 'GET'
      const { [oauth_token_name]: oauth_token, [oauth_secret_name]: oauth_secret } = ctx.state[jwt_state_name]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, oauth_token, oauth_secret)
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
      await next()
    }
  )
  .get(
    '/explores',
    async (ctx, next) => {
      const pwgs = EXPLORE_URLs.map(url => got.get(url).then(({ body }) => body))
      const htmls = await Promise.all(pwgs)
      ctx.body = { meta: { status: 200, msg: 'OK' }, response: { htmls } }
      await next()
    }
  )
  .get(
    '/dashboard',
    ...jwtMiddlewares,
    async (ctx, next) => {

      const { limit, offset, type, since_id, before_id, reblog_info, notes_info } = ctx.query

      const url = DASHBOARD_URL + joinParams({ limit, offset, type, since_id, before_id, reblog_info, notes_info })
      const method = 'GET'
      const { [oauth_token_name]: oauth_token, [oauth_secret_name]: oauth_secret } = ctx.state[jwt_state_name]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, oauth_token, oauth_secret)
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
      await next()
    }
  )
  .get(
    '/likes',
    ...jwtMiddlewares,
    async (ctx, next) => {

      const { limit, offset, before, after, reblog_info, notes_info } = ctx.query

      const url = LIKES_URL + joinParams({ limit, offset, before, after, reblog_info, notes_info })
      const method = 'GET'
      const { [oauth_token_name]: oauth_token, [oauth_secret_name]: oauth_secret } = ctx.state[jwt_state_name]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, oauth_token, oauth_secret)
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
      await next()
    }
  )
  .post(
    '/follow',
    ...jwtMiddlewares,
    bodyParser,
    async (ctx, next) => {

      const { account } = ctx.request.body
      ctx.assert(account, 400, '/follow need { account } as body')

      const url = FOLLOW_URL
      const method = 'POST'
      const { [oauth_token_name]: oauth_token, [oauth_secret_name]: oauth_secret } = ctx.state[jwt_state_name]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, oauth_token, oauth_secret)
        },
        body: {
          url: `http://${IDENTIFIER_URL(account)}`
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
      await next()
    }
  )
  .post(
    '/unfollow',
    ...jwtMiddlewares,
    bodyParser,
    async (ctx, next) => {

      const { account } = ctx.request.body
      ctx.assert(account, 400, '/unfollow need { account } as body')

      const url = UNFOLLOW_URL
      const method = 'POST'
      const { [oauth_token_name]: oauth_token, [oauth_secret_name]: oauth_secret } = ctx.state[jwt_state_name]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, oauth_token, oauth_secret)
        },
        body: {
          url: `http://${IDENTIFIER_URL(account)}`
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
      await next()
    }
  )
  .post(
    '/reblog',
    ...jwtMiddlewares,
    bodyParser,
    async (ctx, next) => {

      const { account, id, reblog_key, comment, native_inline_images } = ctx.request.body
      ctx.assert(account, 400, '/reblog need { account } as body')
      ctx.assert(id, 400, '/reblog need { id } as body')
      ctx.assert(reblog_key, 400, '/reblog need { reblog_key } as body')

      const url = REBLOG_URL(account)
      const method = 'POST'
      const { [oauth_token_name]: oauth_token, [oauth_secret_name]: oauth_secret } = ctx.state[jwt_state_name]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, oauth_token, oauth_secret)
        },
        body: {
          id,
          reblog_key,
          comment,
          native_inline_images
        }
      })

      ctx.body = await pwg.then(({ body }) => body)
      await next()
    }
  )
  .post(
    '/delete',
    ...jwtMiddlewares,
    bodyParser,
    async (ctx, next) => {

      const { account, id } = ctx.request.body
      ctx.assert(account, 400, '/delete need { account } as body')
      ctx.assert(id, 400, '/delete need { id } as body')

      const url = DELETE_URL(account)
      const method = 'POST'
      const { [oauth_token_name]: oauth_token, [oauth_secret_name]: oauth_secret } = ctx.state[jwt_state_name]

      const pwg = got(url, {
        method,
        json: true,
        headers: {
          Authorization: oauthAuthorization(url, method, oauth_token, oauth_secret)
        },
        body: { id }
      })

      ctx.body = await pwg.then(({ body }) => body)
      await next()
    }
  )

  // const SEARCH_URL = (account, word) => `${BASE(account)}/search/${word}`
  // export const search = (account, word, { page } = {}) =>
  //   jsonp(
  //     SEARCH_URL(account, word) + joinParams({
  //       format: 'json',
  //       page
  //     })
  //   )
  //
  // const SEARCH_URL = (account, word) => `https://www.tumblr.com/svc/search/blog_search/${account}/${word}`
  // export const search = (account, word, { next_offset, limit, sort, post_type, post_role, filter_nsfw } = {}) =>
  //   fetch(
  //     SEARCH_URL(account, word) + joinParams({
  //       next_offset,
  //       limit,
  //       sort,
  //       post_type,
  //       post_role,
  //       filter_nsfw
  //     })
  //   )
  //   .then(res => res.json())
  //   .then(json => console.log(json))
  //
  // https://www.tumblr.com/svc/search/blog_search/hogesys-blog-blog/hoge?
  // next_offset=0&
  // limit=10&
  // sort=CREATED_DESC&
  // post_type=ANY&
  // post_role=ANY&
  // filter_nsfw=false


  return new Koa()
        .use(rootMiddleware)
        .use(router.routes())
        .use(router.allowedMethods({ throw: true }))
}

API.API = API
API.joinParams = joinParams
module.exports = API