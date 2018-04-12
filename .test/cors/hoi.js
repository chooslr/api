import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'
import { feedArrayRecursiveTillDone } from '../../client/.src/util'

describe('hoi: v2/v1', () => {

  const { HoPosts: HoPostsV2, HoPostsRandom: HoPostsRandomV2, total: fetchTotalV2 } = require('../../.rewired/v2.js')
  const { HoPosts: HoPostsV1, HoPostsRandom: HoPostsRandomV1, total: fetchTotalV1 } = require('../../.rewired/v1.js')

  const { CONSUMER_KEY: api_key } = process.env
  const account = 'ttttthhhhhhheemeeeee'
  const arg = [account, api_key]

  describe('{}', () => {

    it('HoPostsV2', () => test(
      HoPostsV2(...arg),
      fetchTotalV2(...arg)
    ))

    it('HoPostsRandomV2', () => test(
      HoPostsRandomV2(...arg),
      fetchTotalV2(...arg)
    ))

    it('HoPostsV1', () => test(
      HoPostsV1(account),
      fetchTotalV1(account)
    ))

    it('HoPostsRandomV1', () => test(
      HoPostsRandomV1(account),
      fetchTotalV1(account)
    ))

    async function test(feedPromise, totalPromise){
      const feedPosts = await feedPromise
      const posts_all = await feedArrayRecursiveTillDone(feedPosts)
      const total = await totalPromise
      assert.equal(posts_all.length, total)
    }
  })

  describe('{ offset/start, type }', () => {

    /* total is 64 (2018/2/25) */
    const offset = 10
    const type = 'photo'

    it('HoPostsV2', () => test(
      HoPostsV2(...arg, { offset, type }),
      fetchTotalV2(...arg, { type })
    ))

    it('HoPostsRandomV2', () => test(
      HoPostsRandomV2(...arg, { offset, type }),
      fetchTotalV2(...arg, { type })
    ))

    it('HoPostsV1', () => test(
      HoPostsV1(account, { start: offset, type }),
      fetchTotalV1(account, { type })
    ))

    it('HoPostsRandomV1', () => test(
      HoPostsRandomV1(account, { start: offset, type }),
      fetchTotalV1(account, { type })
    ))

    async function test(feedPromise, totalPromise){
      const feedPosts = await feedPromise
      const posts_all = await feedArrayRecursiveTillDone(feedPosts)
      const total = await totalPromise
      assert.equal(posts_all.length, total - offset)
      assert(posts_all.every(post => post.type === type))
    }
  })

  describe('{ limit/num: 21/51 } => throwd', () => {

    const limit = 21
    const num = 51

    it('HoPostsV2', () => test(
      HoPostsV2(...arg, { limit }),
      'HoPosts > invalid limit'
    ))

    it('HoPostsRandomV2', () => test(
      HoPostsRandomV2(...arg, { limit }),
      'HoPostsRandom > invalid limit'
    ))

    it('HoPostsV1', () => test(
      HoPostsV1(account, { num }),
      'HoPosts > invalid num'
    ))

    it('HoPostsRandomV1', () => test(
      HoPostsRandomV1(account, { num }),
      'HoPostsRandom > invalid num'
    ))

    async function test(feedPromise, message) {
      try {
        await feedPromise
        assert(false)
      } catch (e) {
        assert.equal(e.message, message)
      }
    }
  })

  describe('{ offset/start: total } => throwd', () => {

    it('HoPostsV2', () => test(
      fetchTotalV2(...arg),
      (total) => HoPostsV2(...arg, { offset: total }),
      'HoPosts > invalid offset'
    ))

    it('HoPostsRandomV2', () => test(
      fetchTotalV2(...arg),
      (total) => HoPostsRandomV2(...arg, { offset: total }),
      'HoPostsRandom > invalid offset'
    ))

    it('HoPostsV1', () => test(
      fetchTotalV1(account),
      (total) => HoPostsV1(account, { start: total }),
      'HoPosts > invalid start'
    ))

    it('HoPostsRandomV1', () => test(
      fetchTotalV1(account),
      (total) => HoPostsRandomV1(account, { start: total }),
      'HoPostsRandom > invalid start'
    ))

    async function test(totalPromise, HofeedPromise, message) {
      const total = await totalPromise
      try {
        await HofeedPromise(total)
        assert(false)
      } catch (e) {
        assert.equal(e.message, message)
      }
    }
  })

})