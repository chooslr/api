const { createCipher, createDecipher } = require('crypto')

const jwtRestore = (opts = {}) => {

  const { key='user', algorithm, password } = opts

  return async (ctx, next) => {

    if (ctx.state[key]) {
      const decoded = ctx.state[key]

      try {
        const decrypted = decrypt(algorithm, password, decoded)
        ctx.state[key] = JSON.parse(decrypted)
      } catch (e) {
        ctx.throw(401, e.message)
      }
    }

    await next()
  }
}

const encrypt = (algorithm, password, stringified, opts = {}) => {
  let result
  const inputEncoding = opts.inputEncoding || 'utf8'
  const outputEncoding = opts.outputEncoding || 'hex'

  const cipher = createCipher(algorithm, password)
  result = cipher.update(stringified, inputEncoding, outputEncoding)
  result += cipher.final(outputEncoding)
  return result
}

const decrypt = (algorithm, password, encrypted, opts = {}) => {
  let result
  const inputEncoding = opts.inputEncoding || 'hex'
  const outputEncoding = opts.outputEncoding || 'utf8'

  const decipher = createDecipher(algorithm, password)
  result = decipher.update(encrypted, inputEncoding, outputEncoding)
  result += decipher.final(outputEncoding)
  return result
}

jwtRestore.jwtRestore = jwtRestore
jwtRestore.encrypt = encrypt
jwtRestore.decrypt = decrypt
module.exports = jwtRestore