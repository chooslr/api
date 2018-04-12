import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'

describe(`bff: core.js`, () => {

  const port = 7001
  const { modules, app } = require('../../.rewired/bff.js').default(port)

  let server
  before(() => server = app.listen(port))
  after(() => server.close())

  describe('user', () => {

    const { user: api } = modules

    it(`{}`, async () => {
      const user = await api()
    })
  })

  describe('followings', () => {

    const { followings: api } = modules

    it(`{}`, async () => {
      const blogs = await api()
    })

    it(`{ limit }`, async () => {
      const blogs = await api({ limit: 5 })
    })

    it(`{ offset }`, async () => {
      const blogs = await api({ offset: 20 })
    })
  })

  describe('explores', () => {

    const { explores: api } = modules

    it(`{}`, async () => {
      const names = await api()
    })
  })

  describe('dashboard', () => {

    const { dashboard: api } = modules

    it(`{}`, async () => {
      const posts = await api()
    })
  })

  describe('likes', () => {

    const { likes: api } = modules

    it(`{}`, async () => {
      const posts = await api()
    })
  })

  // describe('follow', () => {
  //
  //   const { follow: api } = modules
  //
  //   it(`{}`, async () => {
  //     const blog = await api('david')
  //   })
  // })
  //
  // describe('unfollow', () => {
  //
  //   const { unfollow: api } = modules
  //
  //   it(`{}`, async () => {
  //     const posts = await api()
  //   })
  // })

  // describe('reblog', () => {
  //
  //   const { reblog: api } = modules
  //
  //   // it(`{}`, async () => {
  //   //   const posts = await api()
  //   // })
  // })

})