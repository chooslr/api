import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'

describe('sampling.js', () => {

  const { samplingPosts: samplingPostsV1, samplingTags: samplingTagsV1 } = require('../../.rewired/v1.js')
  const { samplingPosts: samplingPostsV2, samplingTags: samplingTagsV2 } = require('../../.rewired/v2.js')

  const { CONSUMER_KEY: api_key } = process.env
  const account = 'lssr'
  const arg = [account, api_key]

  describe('samplingPosts: {}', () => {

    it('v1', () => test(
      samplingPostsV1(account)
    ))
    it('v2', () => test(
      samplingPostsV2(...arg)
    ))

    async function test(promise) {
      const posts = await promise
      assert(Array.isArray(posts))
    }
  })

  describe('samplingPosts: { type, denom, maxNum }', () => {

    const type = 'photo'
    const denom = 4
    const maxNum = 3

    it('v1', () => test(
      samplingPostsV1(account, { type, denom, maxNum })
    ))

    it('v2', () => test(
      samplingPostsV2(...arg, { type, denom, maxNum })
    ))

    async function test(promise) {
      const posts = await promise
      assert(posts.every(post => post.type === type))
    }
  })

  describe('samplingTags: { type, denom, maxNum }', () => {

    const type = 'photo'
    const denom = 4
    const maxNum = 3

    it('v1', () => test(
      samplingTagsV1(account, { type, denom, maxNum })
    ))

    it('v2', () => test(
      samplingTagsV2(...arg, { type, denom, maxNum })
    ))

    async function test(promise) {
      const tags = await promise
      assert(tags.every(tag => typeof tag === 'string'))
    }
  })
})