import assert from 'assert'
import request from 'supertest'
import { join } from 'path'
import { joinParams } from '../src/universal.js'
import createMock from '../mock.js'

const { CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET } = process.env

const port = 7000
const prefix = '/prefix'
const cookieName = 'chooslr:jwt'

const { app, jwt, client: { default: Chooslr } } = createMock(prefix, CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET, { cookieName })

// two way to send jwt
const Cookie = cookieName + '=' + jwt
const Authorization = 'Bearer ' + jwt

const chooslr = new Chooslr(`http://localhost:${port}${prefix}`, { api_key: CONSUMER_KEY })

let server
before(() => server = app.listen(port))
after(() => server.close())

describe('/info', () => {

  const test = (user) => {
    const { name, likes, following, default_post_format, blogs } = user
    assert(typeof name === 'string')
    assert(typeof likes === 'number')
    assert(typeof following === 'number')
    assert(typeof default_post_format === 'string')
    assert(Array.isArray(blogs))
  }

  it('server', () =>
    request(server)
    .get(join(prefix, '/info'))
    .set('Cookie', Cookie)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(({ body }) => {
      const { meta: { status, msg }, response: { user } } = body
      assert.equal(status, 200)
      assert.equal(msg, 'OK')
      test(user)
    })
  )

  it(`client`, () => chooslr.user().then(user => test(user)))

})

describe('/followings', () => {

  const params = { limit: 5, offset: 20 }

  const test = (blogs) => assert(Array.isArray(blogs))

  it('server', () =>
    request(server)
    .get(join(prefix, '/followings' + joinParams(params)))
    .set('Authorization', Authorization)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(({ body }) => {
      const { meta: { status, msg }, response: { total_blogs, blogs } } = body
      assert.equal(status, 200)
      assert.equal(msg, 'OK')
      assert(typeof total_blogs === 'number')
      test(blogs)
    })
  )

  it(`client`, () => chooslr.followings(params).then(blogs => test(blogs)))

})

describe('/explores', () => {

  it('server', () =>
    request(server)
    .get(join(prefix, '/explores'))
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(({ body }) => {
      const { meta: { status, msg }, response: { htmls } } = body
      assert.equal(status, 200)
      assert.equal(msg, 'OK')
      assert(Array.isArray(htmls))
    })
  )

  it(`client`, () => chooslr.explores().then(names => Array.isArray(names)))

})

describe('/dashboard and /likes', () => {

  const params = { reblog_info: true, notes_info: true }

  const test = (posts) => {
    assert(Array.isArray(posts))
    assert(posts.some(({ notes }) => Array.isArray(notes)))
    assert(posts.some((post) => 'reblogged_from_name' in post && 'reblogged_root_name' in post))
  }

  it('server: dashboard', () =>
    request(server)
    .get(join(prefix, '/dashboard' + joinParams(params)))
    .set('Authorization', Authorization)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(({ body }) => {
      const { meta: { status, msg }, response: { posts } } = body
      assert.equal(status, 200)
      assert.equal(msg, 'OK')
      test(posts)
    })
  )

  it(`client: dashboard`, () => chooslr.dashboard(params).then(posts => test(posts)))

  it('server: likes', () =>
    request(server)
    .get(join(prefix, '/likes' + joinParams(params)))
    .set('Authorization', Authorization)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(({ body }) => {
      const { meta: { status, msg }, response: { liked_count, liked_posts } } = body
      assert.equal(status, 200)
      assert.equal(msg, 'OK')
      assert(typeof liked_count === 'number')
      test(liked_posts)
    })
  )

  it(`client: likes`, () => chooslr.likes(params).then(liked_posts => test(liked_posts)))

})

describe('/follow and /unfollow', () => {

  const account = 'kthjm'

  it('server: follow', () =>
    request(server)
    .post(join(prefix, '/follow'))
    .send({ account })
    .set('Cookie', Cookie)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(({ body }) => {
      const { meta: { status, msg }, response: { blog } } = body
      assert.equal(status, 200)
      assert.equal(msg, 'OK')
      assert(blog)
    })
  )

  it('server: unfollow', () =>
    request(server)
    .post(join(prefix, '/unfollow'))
    .send({ account })
    .set('Authorization', Authorization)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(({ body }) => {
      const { meta: { status, msg }, response: { blog } } = body
      assert.equal(status, 200)
      assert.equal(msg, 'OK')
      assert(blog)
    })
  )

  it(`client: follow`, () => chooslr.follow(account).then(blog => assert(blog)))

  it(`client: unfollow`, () => chooslr.unfollow(account).then(blog => assert(blog)))

})

describe('/reblog and /delete', () => {

  const account = 'pthjm'
  const id = '171229531525'
  const reblog_key = 'ydj0DmZq'

  let created_id
  const createTest = (id) => {
    assert(typeof id === 'number')
    created_id = id
  }

  it('server: reblog', () =>
    request(server)
    .post(join(prefix, '/reblog'))
    .send({ account, id, reblog_key })
    .set('Cookie', Cookie)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(({ body }) => {
      const { meta: { status, msg }, response: { id } } = body
      assert.equal(status, 201)
      assert.equal(msg, 'Created')
      createTest(id)
    })
  )

  it('server: delete', () =>
    request(server)
    .post(join(prefix, '/delete'))
    .send({ account, id: created_id })
    .set('Authorization', Authorization)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect(({ body }) => {
      const { meta: { status, msg }, response: { id } } = body
      assert.equal(status, 200)
      assert.equal(msg, 'OK')
      assert.equal(id, created_id)
    })
  )

  it(`server: reblog`, () => chooslr.reblog(account, id, reblog_key).then(id => createTest(id)))

  it(`server: delete`, () => chooslr.delete(account, created_id).then(id => assert.equal(id, created_id)))

})

describe('generateDashboard and generateLikes', () => {

  const test = (methodName) => async () => {
    const offset = 500
    const iterate2 = await chooslr[methodName]({ offset, limit: 2 })
    const iterate10 = await chooslr[methodName]({ offset, limit: 10 })

    // limit: 2 * 5 = 10
    const entries = []
    const pushPair = ({ value: posts }) => entries.push([posts[0].id, posts[posts.length - 1].id])
    await iterate2().then(pushPair)
    await iterate2().then(pushPair)
    await iterate2().then(pushPair)
    await iterate2().then(pushPair)
    await iterate2().then(pushPair)

    const tenIds = await iterate10().then(({ value: posts }) => posts.map(({ id }) => id))

    entries.forEach((pair, index) => {
      if (index === entries.length - 1) return

      const before_id = pair[1]
      const after_id = entries[index + 1][0]

      const beforeMatchIndex = tenIds.findIndex(id => id === before_id)
      if (beforeMatchIndex !== -1) assert.equal(after_id, tenIds[beforeMatchIndex + 1])

      const afterMatchIndex = tenIds.findIndex(id => id === after_id)
      if (afterMatchIndex !== -1) assert.equal(before_id, tenIds[afterMatchIndex - 1])
    })
  }

  it('generateDashboard', test('generateDashboard'))
  it('generateLikes', test('generateLikes'))
})

describe('generateFollowings and generateExplores', () => {

  const test = async (iterate) => {
    const { value, done } = await iterate()
    assert(typeof done === 'boolean')
    assert(Array.isArray(value))
  }

  it('generateFollowings', () => chooslr.generateFollowings().then(iterate => test(iterate)))
  it('generateExplores', () => chooslr.generateExplores().then(iterate => test(iterate)))
})