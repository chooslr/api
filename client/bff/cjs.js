'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var _regeneratorRuntime = _interopDefault(require('babel-runtime/regenerator'))
var tiloop = require('tiloop')
var tiloop__default = _interopDefault(tiloop)

var slicedToArray = (function() {
  function sliceIterator(arr, i) {
    var _arr = []
    var _n = true
    var _d = false
    var _e = undefined

    try {
      for (
        var _i = arr[Symbol.iterator](), _s;
        !(_n = (_s = _i.next()).done);
        _n = true
      ) {
        _arr.push(_s.value)

        if (i && _arr.length === i) break
      }
    } catch (err) {
      _d = true
      _e = err
    } finally {
      try {
        if (!_n && _i['return']) _i['return']()
      } finally {
        if (_d) throw _e
      }
    }

    return _arr
  }

  return function(arr, i) {
    if (Array.isArray(arr)) {
      return arr
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i)
    } else {
      throw new TypeError(
        'Invalid attempt to destructure non-iterable instance'
      )
    }
  }
})()

var toConsumableArray = function(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i]

    return arr2
  } else {
    return Array.from(arr)
  }
}

var identifier = function identifier(account) {
  return account + '.tumblr.com'
}

var fetchInterface = function fetchInterface() {
  return fetch
    .apply(undefined, arguments)
    .then(function(res) {
      return isSuccess(res.status) ? res.json() : throws(res.statusText)
    })
    .then(function(res) {
      return isSuccess(res.meta.status) ? res.response : throws(res.meta.msg)
    })
}

var isSuccess = function isSuccess(status) {
  return status === 200 || status === 201
}

var throws = function throws(message, isType) {
  throw isType ? new TypeError(message) : new Error(message)
}

var asserts = function asserts(condition, message, isType) {
  return !condition && throws(message, isType)
}

var joinParams = function joinParams() {
  var params =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

  var valids = Object.entries(params).filter(function(_ref) {
    var _ref2 = slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1]

    return paramFilter(value)
  })
  return valids.length
    ? '?' +
        valids
          .map(function(_ref3) {
            var _ref4 = slicedToArray(_ref3, 2),
              key = _ref4[0],
              value = _ref4[1]

            return key + '=' + value
          })
          .join('&')
    : ''
}

var paramFilter = function paramFilter(value) {
  return Boolean(value) || typeof value === 'number'
}

var arrToUniques = function arrToUniques(arr) {
  return [].concat(toConsumableArray(new Set(arr).values()))
}

var wrapIteratorAsAsync = function wrapIteratorAsAsync(iterator) {
  return function() {
    var _iterator$next = iterator.next(),
      done = _iterator$next.done,
      value = _iterator$next.value

    return Promise.resolve(value).then(function(res) {
      return { res: res, done: done }
    })
  }
}

var BASE = '/api'
var credentials = 'same-origin'

var fetchAsGet = function fetchAsGet(path, params) {
  return fetchInterface(path + joinParams(params), {
    method: 'GET',
    credentials: credentials
  })
}

var fetchAsPost = function fetchAsPost(path, body) {
  return fetchInterface(path, {
    method: 'POST',
    credentials: credentials,
    headers: new Headers({ 'content-type': 'application/json' }),
    body: JSON.stringify(body)
  })
}

var user = function user() {
  return fetchAsGet(BASE + '/info').then(function(_ref) {
    var user = _ref.user
    return user
  })
}

var followings = function followings() {
  var _ref2 =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    limit = _ref2.limit,
    offset = _ref2.offset

  return fetchAsGet(BASE + '/followings', {
    limit: limit,
    offset: offset
  }).then(function(_ref3) {
    var blogs = _ref3.blogs
    return blogs
  })
}

var explores = function explores() {
  return fetchAsGet(BASE + '/explores')
    .then(function(_ref4) {
      var htmls = _ref4.htmls
      return htmls.map(function(html) {
        return extractNames(html)
      })
    })
    .then(function(names_arr) {
      var _ref5

      return (_ref5 = []).concat.apply(_ref5, toConsumableArray(names_arr))
    })
    .then(function(names) {
      return arrToUniques(names)
    })
}

var dashboard = function dashboard() {
  var _ref6 =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    limit = _ref6.limit,
    offset = _ref6.offset,
    type = _ref6.type,
    before_id = _ref6.before_id,
    since_id = _ref6.since_id,
    reblog_info = _ref6.reblog_info,
    notes_info = _ref6.notes_info

  return fetchAsGet(BASE + '/dashboard', {
    limit: limit,
    offset: offset,
    type: type,
    before_id: before_id,
    since_id: since_id,
    reblog_info: reblog_info,
    notes_info: notes_info
  }).then(function(_ref7) {
    var posts = _ref7.posts
    return posts
  })
}

var likes = function likes() {
  var _ref8 =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    limit = _ref8.limit,
    offset = _ref8.offset,
    before = _ref8.before,
    after = _ref8.after,
    reblog_info = _ref8.reblog_info,
    notes_info = _ref8.notes_info

  return fetchAsGet(BASE + '/likes', {
    limit: limit,
    offset: offset,
    before: before,
    after: after,
    reblog_info: reblog_info,
    notes_info: notes_info
  }).then(function(_ref9) {
    var liked_posts = _ref9.liked_posts
    return liked_posts
  })
}

var follow = function follow(account) {
  return fetchAsPost(BASE + '/follow', { account: account }).then(function(
    _ref10
  ) {
    var blog = _ref10.blog
    return blog
  })
}

var unfollow = function unfollow(account) {
  return fetchAsPost(BASE + '/unfollow', { account: account }).then(function(
    _ref11
  ) {
    var blog = _ref11.blog
    return blog
  })
}

var reblog = function reblog(account, id, reblog_key) {
  var _ref12 =
      arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
    comment = _ref12.comment,
    native_inline_images = _ref12.native_inline_images

  return fetchAsPost(BASE + '/reblog', {
    account: account,
    id: id,
    reblog_key: reblog_key,
    comment: comment,
    native_inline_images: native_inline_images
  }).then(function(_ref13) {
    var id = _ref13.id
    return id
  })
}

/* used by explores */
var parseFromString = function parseFromString(string) {
  return new DOMParser().parseFromString(string, 'text/html')
}

var extractNames = function extractNames(html) {
  return JSON.parse(
    parseFromString(html).getElementById('bootloader').dataset.bootstrap
  ).Components.DiscoveryPosts.posts.map(function(post) {
    return parseFromString(post)
      .querySelector('.post-info-tumblelog')
      .children[0].innerHTML.trim()
  })
}

var BASE$1 = 'https://api.tumblr.com/v2/blog'
var API_URL = function API_URL(account) {
  return BASE$1 + '/' + identifier(account)
}
var method = 'GET'
var mode = 'cors'

var infoAPI = function infoAPI(account, api_key) {
  return fetchInterface(
    API_URL(account) + '/info' + joinParams({ api_key: api_key }),
    { method: method, mode: mode }
  )
}

var blog = function blog(account, api_key) {
  return infoAPI(account, api_key).then(function(_ref7) {
    var blog = _ref7.blog
    return blog
  })
}

var _marked = /*#__PURE__*/ _regeneratorRuntime.mark(loopYieldGenerator)

function loopYieldGenerator(yielded) {
  return _regeneratorRuntime.wrap(
    function loopYieldGenerator$(_context) {
      while (1) {
        switch ((_context.prev = _context.next)) {
          case 0:
            _context.next = 3
            return yielded()

          case 3:
            _context.next = 0
            break

          case 5:
          case 'end':
            return _context.stop()
        }
      }
    },
    _marked,
    this
  )
}

var HoPostsDashboard = function HoPostsDashboard() {
  var _ref =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$offset = _ref.offset,
    offset = _ref$offset === undefined ? 0 : _ref$offset,
    _ref$limit = _ref.limit,
    limit = _ref$limit === undefined ? 20 : _ref$limit,
    type = _ref.type,
    reblog_info = _ref.reblog_info,
    notes_info = _ref.notes_info

  asserts(limit <= 20, 'invalid limit')

  var params = {
    before_id: undefined,
    offset: offset,
    limit: limit,
    type: type,
    reblog_info: reblog_info,
    notes_info: notes_info
  }

  var iterator = loopYieldGenerator(function() {
    return dashboard(params).then(function(posts$$1) {
      params.before_id = posts$$1[posts$$1.length - 1].id
      params.offset = undefined
      return posts$$1
    })
  })

  return wrapIteratorAsAsync(iterator)
}

var HoPostsLikes = async function HoPostsLikes() {
  var _ref2 =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    total$$1 = _ref2.total,
    _ref2$limit = _ref2.limit,
    limit = _ref2$limit === undefined ? 20 : _ref2$limit,
    _ref2$offset = _ref2.offset,
    offset = _ref2$offset === undefined ? 0 : _ref2$offset,
    reblog_info = _ref2.reblog_info,
    notes_info = _ref2.notes_info

  asserts(limit <= 20, 'invalid limit')

  total$$1 =
    total$$1 ||
    (await user().then(function(_ref3) {
      var likes$$1 = _ref3.likes
      return likes$$1
    }))

  asserts(typeof total$$1 === 'number' && total$$1 !== -1, 'invalid total')

  var params = {
    before: undefined,
    offset: offset,
    limit: limit,
    reblog_info: reblog_info,
    notes_info: notes_info
  }

  var iterator = tiloop__default(
    new tiloop.IndexesZero({
      length: total$$1 - offset,
      maxIncrement: limit
    }),
    function(indexedArr) {
      return likes(params).then(function(posts$$1) {
        posts$$1 = posts$$1.slice(0, indexedArr.length)
        params.before = posts$$1[posts$$1.length - 1].liked_timestamp
        params.offset = undefined
        return posts$$1
      })
    }
  )

  return wrapIteratorAsAsync(iterator)
}

var HoBlogsFollowings = async function HoBlogsFollowings() {
  var _ref4 =
      arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    total$$1 = _ref4.total,
    _ref4$limit = _ref4.limit,
    limit = _ref4$limit === undefined ? 20 : _ref4$limit,
    _ref4$offset = _ref4.offset,
    offset = _ref4$offset === undefined ? 0 : _ref4$offset

  asserts(limit <= 20, 'invalid limit')

  total$$1 =
    total$$1 ||
    (await user().then(function(_ref5) {
      var following = _ref5.following
      return following
    }))

  asserts(typeof total$$1 === 'number' && total$$1 !== -1, 'invalid total')

  var iterator = tiloop__default(
    new tiloop.IndexesZero({
      length: total$$1 - offset,
      maxIncrement: limit
    }),
    function(indexedArr) {
      return followings({
        offset: indexedArr[0],
        limit: indexedArr.length
      })
    }
  )

  return wrapIteratorAsAsync(iterator)
}

var HoBlogsExplores = async function HoBlogsExplores(api_key) {
  var _ref6 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    names = _ref6.names,
    _ref6$limit = _ref6.limit,
    limit = _ref6$limit === undefined ? 20 : _ref6$limit

  asserts(api_key, 'invalid api_key')

  names = names || (await explores())

  var iterator = tiloop__default(
    new tiloop.IndexesZero({
      length: names.length,
      maxIncrement: limit
    }),
    function(indexedArr) {
      return Promise.all(
        indexedArr.map(function(index) {
          return blog(names[index], api_key).catch(function(err) {
            return undefined
          })
        })
      ).then(function(blogs) {
        return blogs.filter(function(blog$$1) {
          return blog$$1
        })
      })
    }
  )

  return wrapIteratorAsAsync(iterator)
}

exports.user = user
exports.followings = followings
exports.explores = explores
exports.dashboard = dashboard
exports.likes = likes
exports.follow = follow
exports.unfollow = unfollow
exports.reblog = reblog
exports.HoPostsDashboard = HoPostsDashboard
exports.HoPostsLikes = HoPostsLikes
exports.HoBlogsFollowings = HoBlogsFollowings
exports.HoBlogsExplores = HoBlogsExplores
