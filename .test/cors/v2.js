import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'
import fetch from 'node-fetch'
import * as modules from '../../.rewired/v2.js'

describe(`v2: core.js`, () => {

  const { CONSUMER_KEY: api_key } = process.env
  const account = '0ni-chan'
  const arg = [account, api_key]

  describe('posts', () => {

    const { posts: api } = modules

    it(`{}`, async () => {
      const posts = await api(...arg)
      assert.equal(posts.length, 20)
    })

    it(`{ limit }`, async () => {
      const limit = 5
      const posts = await api(...arg, { limit })
      assert.equal(posts.length, limit)
    })

    it(`{ type }`, () =>
      Promise.all(
        [
          'text',
          'quote',
          'link',
          'answer',
          'video',
          'audio',
          'photo',
          'chat'
        ]
        .map(type =>
          api(...arg, { type }).then(posts =>
            assert(posts.every(post => post.type === type))
          )
        )
      )
    )

  })

  describe(`post`, () => {

    const { post: api } = modules
    const id = '171300746219'
    const reblog_info_keys = [
      'reblogged_from_id',
      'reblogged_from_url',
      'reblogged_from_name',
      'reblogged_from_title',
      'reblogged_from_uuid',
      'reblogged_from_can_message',
      'reblogged_root_id',
      'reblogged_root_url',
      'reblogged_root_name',
      'reblogged_root_title',
      'reblogged_root_uuid',
      'reblogged_root_can_message'
    ]

    it('{}', async () => {
      const post = await api(...arg, id)
      const post_keys = Object.keys(post)
      assert.equal(post.id, id)
      assert(reblog_info_keys.every(reblog_info_key => !post_keys.includes(reblog_info_key)))
      assert(!Array.isArray(post.notes))
    })

    it('{ reblog_info }', async () => {
      const post = await api(...arg, id, { reblog_info: true })
      const post_keys = Object.keys(post)
      assert.equal(post.id, id)
      assert(reblog_info_keys.every(reblog_info_key => post_keys.includes(reblog_info_key)))
      assert(!Array.isArray(post.notes))
    })

    it('{ notes_info }', async () => {
      const post = await api(...arg, id, { notes_info: true })
      const post_keys = Object.keys(post)
      assert.equal(post.id, id)
      assert(reblog_info_keys.every(reblog_info_key => !post_keys.includes(reblog_info_key)))
      assert(Array.isArray(post.notes))
    })
  })

  describe(`total`, () => {

    const { total: api } = modules

    it('{}', async () => {
      const total = await api(...arg)
      assert(typeof total === 'number')
    })

    it('{ type }', async () => {
      const total = await api(...arg, { type: 'video' })
      assert(typeof total === 'number')
    })

    it('{ tag }', async () => {
      const total = await api(...arg, { tag: 'one punch man' })
      assert(typeof total === 'number')
    })
  })

  describe(`blog`, () => {

    const { blog: api } = modules

    it('{}', async () => {
      const blog = await api(...arg)
      assert(blog.name, account)
    })
  })

  describe(`avatar`, () => {

    const { avatar: api } = modules

    it('{}', () => {
      const url = api(account)
      assert(typeof url === 'string')
    })

    it('{ size }', () =>
      [
        16,
        24,
        30,
        40,
        48,
        64,
        96,
        128,
        512
      ]
      .map(size => api(account, size))
      .forEach(url =>
        assert(typeof url === 'string')
      )
    )
  })
})