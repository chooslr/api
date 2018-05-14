const Koa = require('koa')
const mount = require('koa-mount')
const JWT = require('jsonwebtoken')
const rewire = require('rewire')
const { default: fetch, Headers } = require('node-fetch')
const { JSDOM } = require('jsdom')
const api = require('./src/server.js').default
const { joinParams } = require('./src/universal.js')

module.exports = (...arg) => {
  const { app, jwt } = server(...arg)
  return { app, jwt, client: client(jwt) }
}

const server = (prefix, consumerKey, consumerSecret, accessToken, accessSecret, options) => {
  const {
    cookieName = 'chooslr:jwt',
    stateName = 'payload',
    secret = 'secret',
    tokenName = 'token',
    secretName = 'secret'
  } = options || {}

  return {
    app: new Koa().use(
      mount(
        prefix,
        api({
          jwt: { cookieName, stateName, secret },
          oauth: { consumerKey, consumerSecret, tokenName, secretName }
        })
      )
    ),
    jwt: accessToken && accessSecret && JWT.sign(
      JSON.stringify({ [tokenName]: accessToken, [secretName]: accessSecret }),
      secret
    )
  }
}

const client = (jwt) => {

  global.fetch = fetch

  const modules = rewire('./src/client.js')
  const fetchInterface = modules.__get__('fetchInterface')
  const Authorization = 'Bearer ' + jwt

  modules.__set__({

    parseFromString: (string) => new JSDOM(string).window.document,

    fetchAsGet: (path, params) => fetchInterface(path + joinParams(params), {
      method: 'GET',
      headers: new Headers({ Authorization })
    }),

    fetchAsPost: (path, body) => fetchInterface(path, {
      method: 'POST',
      headers: new Headers({ Authorization, 'content-type': 'application/json' }),
      body: JSON.stringify(body)
    })

  })

  return modules
}

module.exports.server = server
module.exports.client = client