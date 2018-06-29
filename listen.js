const Koa = require('koa')
const logger = require('koa-logger')
const chooslr = require('./src/middleware').default

const app = new Koa()
const port = 3000
const { CONSUMER_KEY, CONSUMER_SECRET } = process.env

app
.use(
  logger()
)
.use(
  chooslr(app, {
    prefix: '/api',
    consumerKey: CONSUMER_KEY,
    consumerSecret: CONSUMER_SECRET,
    grantServer: { protocol: 'http', host: `localhost:${port}` },
    jwt: {
      secret: 'secret',
      options: {},
      cookie: ['chooslr:jwt', {}]
    }
  })
)
.listen(port, () => console.log('ok => ' + `http://localhost:${port}`))