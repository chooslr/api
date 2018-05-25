const Koa = require('koa')
const logger = require('koa-logger')
const bff = require('./src/server').default

const app = new Koa()
const port = 3000
const { CONSUMER_KEY, CONSUMER_SECRET } = process.env

app
.use(
  logger()
)
.use(
  bff(app, {
    prefix: '/api',
    consumerKey: CONSUMER_KEY,
    consumerSecret: CONSUMER_SECRET,
    jwt: { secret: 'secret', cookie: 'chooslr:jwt' },
    grantServer: { protocol: 'http', host: `localhost:${port}` }
  })
)
.listen(port, () => console.log('ok => ' + `http://localhost:${port}`))