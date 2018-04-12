const Koa = require('koa')
const Mount = require('koa-mount')
const JWT = require('jsonwebtoken')
const API = require('./server')
const { encrypt } = require('./server/custom-jwt')

module.exports = (
  consumerKey,
  consumerSecret,
  accessToken,
  accessSecret,
  {
    prefix = '/api',
    algorithm = 'aes192',
    password = 'password',
    cookieName = 'chooslr:jwt',
    stateName = 'payload',
    secret = 'secret',
    tokenName = 'token',
    secretName = 'secret'
  } = {}
) => ({

  app: new Koa().use(
    Mount(prefix, API({
      encrypt: { algorithm, password },
      jwt: { cookieName, stateName, secret },
      oauth: { consumerKey, consumerSecret, tokenName, secretName }
    }))
  ),

  jwt: accessToken && accessSecret && JWT.sign(
    encrypt(
      algorithm,
      password,
      JSON.stringify({ [tokenName]: accessToken, [secretName]: accessSecret })
    ),
    secret
  )
})