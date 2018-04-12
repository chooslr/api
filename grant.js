const just = require('grant-just')
const { PORT = 3000, CONSUMER_KEY: key, CONSUMER_SECRET: secret } = process.env

if (!key || !secret){
  throw new Error(`!key || !secret`)
} else {
  just(PORT, {
    server: { protocol: 'http', host: `localhost:${PORT}` },
    tumblr: { key, secret, callback: '/connected/tumblr' }
  })
}