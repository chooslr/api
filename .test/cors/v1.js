import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'
import * as modules from '../../.rewired/v1.js'

describe(`v1: core.js`, () => {

  const account = '0ni-chan'

  describe('posts', () => {

    const { posts: api } = modules

    it(`{}`, async () => {
      const posts = await api(account)
      assert.equal(posts.length, 20)
    })

    it(`{ num }`, async () => {
      const num = 50
      const posts = await api(account, { num })
      assert.equal(posts.length, num)
    })

    describe('{ type }', () => {

      it('text/regular', () => test('text', 'regular'))
      it('quote', () => test('quote'))
      it('photo', () => test('photo'))
      it('link', () => test('link'))
      it('chat/conversation', () => test('chat', 'conversation'))
      it('video', () => test('video'))
      it('audio', () => test('audio'))

      async function test(type, postType) {
        postType = postType || type
        const posts = await api(account, { type })
        assert(posts.every(post => post.type === postType))
      }
    })
  })

  describe(`post`, () => {

    const { post: api } = modules
    const id = '171300746219'

    it('{}', async () => {
      const post = await api(account, id)
      assert.equal(post.id, id)
    })
  })

  describe(`total`, () => {

    const { total: api } = modules

    it('{}', async () => {
      const total = await api(account)
      assert(typeof total === 'number')
    })

    it('{ type }', async () => {
      const total = await api(account, { type: 'video' })
      assert(typeof total === 'number')
    })

    it('{ tag }', async () => {
      const total = await api(account, { tag: 'one punch man' })
      assert(typeof total === 'string')
    })
  })

  describe(`blog`, () => {

    const { blog: api } = modules

    it('{}', async () => {
      const blog = await api(account)
      assert(blog.name, account)
    })
  })

})