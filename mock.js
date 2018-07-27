const Koa = require('koa')
const jwt = require('jsonwebtoken')
const rewire = require('rewire')
const { JSDOM } = require('jsdom')
const chooslr = require('./src/middleware').default
const { fetch, Headers } = require('cross-fetch')

global.fetch = fetch
global.Headers = Headers

const client = () => {
  const modules = rewire('./src/client')
  modules.__set__({ parseFromString: (string) => new JSDOM(string).window.document })
  return modules
}

const server = (prefix, consumerKey, consumerSecret, accessToken, accessSecret, options) => {

  const {
    timeout,
    jwtSecret = 'secret',
    jwtOpts = {},
    jwtCookieName = 'chooslr:jwt',
    jwtCookieOpts = { overwrite: true, signed: false }
  } = options || {}

  const app = new Koa()

  return {
    app: app.use(
      chooslr(app, {
        prefix,
        consumerKey,
        consumerSecret,
        timeout,
        grantServer: { protocol: 'http', host: 'localhost:1234' },
        jwt: { secret: jwtSecret, options: jwtOpts, cookie: [ jwtCookieName, jwtCookieOpts ] }
      })
    ),
    jwt: accessToken && accessSecret && jwt.sign({ token: accessToken, secret: accessSecret }, jwtSecret)
  }
}

module.exports = { client, server }