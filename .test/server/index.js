import assert from 'assert'
import JWT from 'jsonwebtoken'
import request from 'supertest'
import { joinParams } from '../../server/index.js'
import situation from '../../situation.js'

const { CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET } = process.env
const prefix = '/'
const cookieName = 'chooslr:jwt'
const { app, jwt } = situation(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET, { prefix, cookieName })

describe('api/server', () => {

  let server
  before(() => server = app.listen(7000))
  after(() => server.close())

  describe('200', () => {

    // two way to send jwt
    const Cookie = cookieName + '=' + jwt
    const Authorization = 'Bearer ' + jwt

    it('/info', () =>
      request(server)
      .get('/info')
      .set('Cookie', Cookie)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        const { meta: { status, msg }, response: { user: { name, likes, following, default_post_format, blogs } } } = body
        assert.equal(status, 200)
        assert.equal(msg, 'OK')
        assert(typeof name === 'string')
        assert(typeof likes === 'number')
        assert(typeof following === 'number')
        assert(typeof default_post_format === 'string')
        assert(Array.isArray(blogs))
      })
    )

    it('/followings', () =>
      request(server)
      .get('/followings')
      .set('Authorization', Authorization)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        const { meta: { status, msg }, response: { total_blogs, blogs } } = body
        assert.equal(status, 200)
        assert.equal(msg, 'OK')
        assert(typeof total_blogs === 'number')
        assert(Array.isArray(blogs))
      })
    )

    it('/explores', () =>
      request(server)
      .get('/explores')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        const { meta: { status, msg }, response: { htmls } } = body
        assert.equal(status, 200)
        assert.equal(msg, 'OK')
        assert(Array.isArray(htmls))
      })
    )

    it('/dashboard', () =>
      request(server)
      .get('/dashboard' + joinParams({ reblog_info: true, notes_info: true }))
      .set('Authorization', Authorization)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        const { meta: { status, msg }, response: { posts } } = body
        assert.equal(status, 200)
        assert.equal(msg, 'OK')
        assert(Array.isArray(posts))
        assert(posts.some(({ notes }) => Array.isArray(notes)))
        assert(posts.some((post) =>
          ('reblogged_from_name' in post) &&
          ('reblogged_root_name' in post)
        ))
      })
    )

    it('/likes', () =>
      request(server)
      .get('/likes' + joinParams({ reblog_info: true, notes_info: true }))
      .set('Authorization', Authorization)
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        const { meta: { status, msg }, response: { liked_count, liked_posts } } = body
        assert.equal(status, 200)
        assert.equal(msg, 'OK')
        assert(typeof liked_count === 'number')
        assert(Array.isArray(liked_posts))
        assert(liked_posts.some(({ notes }) => Array.isArray(notes)))
        assert(liked_posts.some((post) =>
          ('reblogged_from_name' in post) &&
          ('reblogged_root_name' in post)
        ))
      })
    )

    describe('follow then unfollow', () => {

      const account = 'david'

      it('/follow', () =>
        request(server)
        .post('/follow')
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

      // it('/follow', () =>
      //   request(server)
      //   .post('/follow')
      //   .send({ account })
      //   .set('Cookie', Cookie)
      //   .expect(200)
      //   .expect('Content-Type', /json/)
      //   .expect(({ body }) => {
      //     const { meta: { status, msg }, response: { blog } } = body
      //     console.log(status)
      //     console.log(msg)
      //     console.log(blog)
      //   })
      // )

      it('/unfollow', () =>
        request(server)
        .post('/unfollow')
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

    })

    describe('reblog then delete', () => {

      const account = 'pthjm'
      const id = '171229531525'
      const reblog_key = 'ydj0DmZq'
      let created_id

      it('/reblog', () =>
        request(server)
        .post('/reblog')
        .send({ account, id, reblog_key })
        .set('Cookie', Cookie)
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(({ body }) => {
          const { meta: { status, msg }, response: { id } } = body
          assert.equal(status, 201)
          assert.equal(msg, 'Created')
          assert(typeof id === 'number')
          created_id = id
        })
      )

      it('/delete', () =>
        request(server)
        .post('/delete')
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
    })

  })

})