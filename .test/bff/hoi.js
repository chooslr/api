import assert from 'assert'
import rewire from 'rewire'
import sinon from 'sinon'
import { feedArrayRecursiveTillDone } from '../../client/.src/util'


describe('hoi: bff', () => {

  const port = 7002
  const { CONSUMER_KEY: api_key } = process.env
  const { modules, app } = require('../../.rewired/bff.js').default(port)

  let server
  before(() => server = app.listen(port))
  after(() => server.close())

  describe('matching [before, after]', () => {

    const { dashboard, likes, HoPostsDashboard, HoPostsLikes } = modules

    it('HoPostsDashboard', () => test(HoPostsDashboard, dashboard))
    it('HoPostsLikes', () => test(HoPostsLikes, likes))

    async function test(HoFeed, justFetch, { offset = 500 } = {}) {

      const feed = await HoFeed({ offset, limit: 4 })
      const pairs = []
      const pushPair = ({ res: posts }) => pairs.push([posts[0].id, posts[posts.length - 1].id])
      await feed().then(pushPair)
      await feed().then(pushPair)
      await feed().then(pushPair)
      await feed().then(pushPair)
      await feed().then(pushPair)

      const twentyIds = await justFetch({ offset }).then(posts => posts.map(({ id }) => id))

      pairs.forEach((pair,index) => {

        if (index === pairs.length - 1) return

        const before = pair[1]
        const after = pairs[index + 1][0]

        const beforeMatchIndex = twentyIds.findIndex(id => id === before)
        if (beforeMatchIndex !== -1) {
          const expectAsAfter = twentyIds[beforeMatchIndex + 1]
          assert.equal(after, expectAsAfter)
        }

        const afterMatchIndex = twentyIds.findIndex(id => id === after)
        if (afterMatchIndex !== -1) {
          const expectAsBefore = twentyIds[afterMatchIndex - 1]
          assert.equal(before, expectAsBefore)
        }
      })
    }
  })

  it('HoBlogsFollowings', async () => {
    const { user, HoBlogsFollowings } = modules
    const feed = await HoBlogsFollowings()
    // const blogs = await feedArrayRecursiveTillDone(feed)
    // const expectTotal = await user().then(({ following }) => following)
    // assert.equal(blogs.length, expectTotal)
  })

  it('HoBlogsExplores', async () => {
    const { HoBlogsExplores } = modules
    const feed = await HoBlogsExplores(api_key)
    // const blogs = await feedArrayRecursiveTillDone(feed)
  })
})