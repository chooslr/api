'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var tiloop = _interopDefault(require('tiloop'))
var regeneratorRuntime = _interopDefault(require('regenerator-runtime'))
var tumblrinbrowser = require('tumblrinbrowser')

var classCallCheck = function(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var createClass = (function() {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) descriptor.writable = true
      Object.defineProperty(target, descriptor.key, descriptor)
    }
  }

  return function(Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps)
    if (staticProps) defineProperties(Constructor, staticProps)
    return Constructor
  }
})()

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

var endpoints = {
  info: '/info',
  followings: '/followings',
  explores: '/explores',
  dashboard: '/dashboard',
  likes: '/likes',
  follow: '/follow',
  unfollow: '/unfollow',
  reblog: '/reblog',
  delete: '/delete'
}

var joinParams = function joinParams() {
  var params =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

  var valids = Object.entries(params).filter(function(_ref) {
    var _ref2 = slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1]

    return value
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

var _marked = /*#__PURE__*/ regeneratorRuntime.mark(loop)

/* util */
var throws = function throws(message) {
  throw new Error(message)
}

var asserts = function asserts(condition, message) {
  return !condition && throws(message)
}

var arrToUniques = function arrToUniques(arr) {
  return [].concat(toConsumableArray(new Set(arr).values()))
}

var formatPath = function formatPath(base) {
  return base[base.length - 1] === '/' ? base.slice(0, base.length - 1) : base
}

/* fetch */
var credentials = 'same-origin'

var isSuccess = function isSuccess(status) {
  return status === 200 || status === 201
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

/* fetch as "GET" */
var _user = function _user(base) {
  return fetchAsGet(formatPath(base) + endpoints['info']).then(function(_ref) {
    var user = _ref.user
    return user
  })
}
var _followings = function _followings(base) {
  var _ref2 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    limit = _ref2.limit,
    offset = _ref2.offset

  return fetchAsGet(formatPath(base) + endpoints['followings'], {
    limit: limit,
    offset: offset
  }).then(function(_ref3) {
    var blogs = _ref3.blogs
    return blogs
  })
}
var _explores = function _explores(base) {
  return fetchAsGet(formatPath(base) + endpoints['explores'])
    .then(function(_ref4) {
      var htmls = _ref4.htmls
      return htmls.map(extractNames)
    })
    .then(function(names_arr) {
      var _ref5

      return (_ref5 = []).concat.apply(_ref5, toConsumableArray(names_arr))
    })
    .then(function(names) {
      return arrToUniques(names)
    })
}
var _dashboard = function _dashboard(base) {
  var _ref6 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    limit = _ref6.limit,
    offset = _ref6.offset,
    type = _ref6.type,
    before_id = _ref6.before_id,
    since_id = _ref6.since_id,
    reblog_info = _ref6.reblog_info,
    notes_info = _ref6.notes_info

  return fetchAsGet(formatPath(base) + endpoints['dashboard'], {
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
var _likes = function _likes(base) {
  var _ref8 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    limit = _ref8.limit,
    offset = _ref8.offset,
    before = _ref8.before,
    after = _ref8.after,
    reblog_info = _ref8.reblog_info,
    notes_info = _ref8.notes_info

  return fetchAsGet(formatPath(base) + endpoints['likes'], {
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
var _follow = function _follow(base, account) {
  return fetchAsPost(formatPath(base) + endpoints['follow'], {
    account: account
  }).then(function(_ref10) {
    var blog = _ref10.blog
    return blog
  })
}
var _unfollow = function _unfollow(base, account) {
  return fetchAsPost(formatPath(base) + endpoints['unfollow'], {
    account: account
  }).then(function(_ref11) {
    var blog = _ref11.blog
    return blog
  })
}
var _reblog = function _reblog(base, account, id, reblog_key) {
  var _ref12 =
      arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
    comment = _ref12.comment,
    native_inline_images = _ref12.native_inline_images

  return fetchAsPost(formatPath(base) + endpoints['reblog'], {
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
var deletePost = function deletePost(base, account, id) {
  return fetchAsPost(formatPath(base) + endpoints['delete'], {
    account: account,
    id: id
  }).then(function(_ref14) {
    var id = _ref14.id
    return id
  })
}

/* used by explores() */
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

/* generators */
function loop(yielded) {
  return regeneratorRuntime.wrap(
    function loop$(_context) {
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

var _generateDashboard = function _generateDashboard(base) {
  var _ref15 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref15$offset = _ref15.offset,
    offset = _ref15$offset === undefined ? 0 : _ref15$offset,
    _ref15$limit = _ref15.limit,
    limit = _ref15$limit === undefined ? 20 : _ref15$limit,
    type = _ref15.type,
    reblog_info = _ref15.reblog_info,
    notes_info = _ref15.notes_info

  asserts(limit <= 20, 'invalid limit')

  var params = {
    before_id: undefined,
    offset: offset,
    limit: limit,
    type: type,
    reblog_info: reblog_info,
    notes_info: notes_info
  }

  var iterator = loop(function() {
    return _dashboard(base, params).then(function(posts) {
      params.before_id = posts[posts.length - 1].id
      params.offset = undefined
      return posts
    })
  })

  return function() {
    var _iterator$next = iterator.next(),
      done = _iterator$next.done,
      promise = _iterator$next.value

    return Promise.resolve(promise).then(function(value) {
      return { value: value, done: done }
    })
  }
}
var _generateLikes = async function _generateLikes(base) {
  var _ref16 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    total = _ref16.total,
    _ref16$limit = _ref16.limit,
    limit = _ref16$limit === undefined ? 20 : _ref16$limit,
    _ref16$offset = _ref16.offset,
    offset = _ref16$offset === undefined ? 0 : _ref16$offset,
    reblog_info = _ref16.reblog_info,
    notes_info = _ref16.notes_info

  asserts(limit <= 20, 'invalid limit')

  total =
    total ||
    (await _user(base).then(function(_ref17) {
      var likes = _ref17.likes
      return likes
    }))

  asserts(typeof total === 'number' && total !== -1, 'invalid total')

  var params = {
    before: undefined,
    offset: offset,
    limit: limit,
    reblog_info: reblog_info,
    notes_info: notes_info
  }

  return tiloop({
    length: total - offset,
    maxIncrement: limit,
    promisify: true,
    yielded: function yielded(indexedArr) {
      return _likes(base, params).then(function(posts) {
        posts = posts.slice(0, indexedArr.length)
        params.before = posts[posts.length - 1].liked_timestamp
        params.offset = undefined
        return posts
      })
    }
  })
}
var _generateFollowings = async function _generateFollowings(base) {
  var _ref18 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    total = _ref18.total,
    _ref18$limit = _ref18.limit,
    limit = _ref18$limit === undefined ? 20 : _ref18$limit,
    _ref18$offset = _ref18.offset,
    offset = _ref18$offset === undefined ? 0 : _ref18$offset

  asserts(limit <= 20, 'invalid limit')

  total =
    total ||
    (await _user(base).then(function(_ref19) {
      var following = _ref19.following
      return following
    }))

  asserts(typeof total === 'number' && total !== -1, 'invalid total')

  return tiloop({
    length: total - offset,
    maxIncrement: limit,
    promisify: true,
    yielded: function yielded(indexedArr) {
      return _followings(base, {
        offset: indexedArr[0],
        limit: indexedArr.length
      })
    }
  })
}
var _generateExplores = async function _generateExplores(base) {
  var _ref20 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    api_key = _ref20.api_key,
    proxy = _ref20.proxy,
    names = _ref20.names,
    _ref20$limit = _ref20.limit,
    limit = _ref20$limit === undefined ? 20 : _ref20$limit

  asserts(api_key || proxy, 'required api_key || proxy')

  names = Array.isArray(names) ? names : await _explores(base)

  return tiloop({
    length: names.length,
    maxIncrement: limit,
    promisify: true,
    yielded: function yielded(indexedArr) {
      return Promise.all(
        indexedArr.map(function(index) {
          return tumblrinbrowser
            .blog({ api_key: api_key, proxy: proxy, account: names[index] })
            .catch(function(err) {
              return undefined
            })
        })
      ).then(function(blogs) {
        return blogs.filter(function(blog) {
          return blog
        })
      })
    }
  })
}

var Chooslr = (function() {
  function Chooslr(base) {
    var _ref21 =
        arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      api_key = _ref21.api_key,
      proxy = _ref21.proxy

    classCallCheck(this, Chooslr)

    asserts(base && typeof base === 'string')
    asserts(typeof api_key === 'string' || typeof proxy === 'string')
    this.base = base
    this.api_key = api_key
    this.proxy = proxy
  }

  createClass(Chooslr, [
    {
      key: 'user',
      value: function user() {
        return _user(this.base)
      }
    },
    {
      key: 'followings',
      value: function followings(params) {
        return _followings(this.base, params)
      }
    },
    {
      key: 'explores',
      value: function explores() {
        return _explores(this.base)
      }
    },
    {
      key: 'dashboard',
      value: function dashboard(params) {
        return _dashboard(this.base, params)
      }
    },
    {
      key: 'likes',
      value: function likes(params) {
        return _likes(this.base, params)
      }
    },
    {
      key: 'follow',
      value: function follow(account) {
        return _follow(this.base, account)
      }
    },
    {
      key: 'unfollow',
      value: function unfollow(account) {
        return _unfollow(this.base, account)
      }
    },
    {
      key: 'reblog',
      value: function reblog() {
        for (
          var _len = arguments.length, arg = Array(_len), _key = 0;
          _key < _len;
          _key++
        ) {
          arg[_key] = arguments[_key]
        }

        return _reblog.apply(undefined, [this.base].concat(arg))
      }
    },
    {
      key: 'delete',
      value: function _delete() {
        for (
          var _len2 = arguments.length, arg = Array(_len2), _key2 = 0;
          _key2 < _len2;
          _key2++
        ) {
          arg[_key2] = arguments[_key2]
        }

        return deletePost.apply(undefined, [this.base].concat(arg))
      }
    },
    {
      key: 'generateDashboard',
      value: function generateDashboard(params) {
        return _generateDashboard(this.base, params)
      }
    },
    {
      key: 'generateLikes',
      value: function generateLikes(params) {
        return _generateLikes(this.base, params)
      }
    },
    {
      key: 'generateFollowings',
      value: function generateFollowings(params) {
        return _generateFollowings(this.base, params)
      }
    },
    {
      key: 'generateExplores',
      value: function generateExplores() {
        var _ref22 =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {},
          names = _ref22.names,
          limit = _ref22.limit

        return _generateExplores(this.base, {
          api_key: this.api_key,
          proxy: this.proxy,
          names: names,
          limit: limit
        })
      }
    }
  ])
  return Chooslr
})()

exports.user = _user
exports.followings = _followings
exports.explores = _explores
exports.dashboard = _dashboard
exports.likes = _likes
exports.follow = _follow
exports.unfollow = _unfollow
exports.reblog = _reblog
exports.deletePost = deletePost
exports.generateDashboard = _generateDashboard
exports.generateLikes = _generateLikes
exports.generateFollowings = _generateFollowings
exports.generateExplores = _generateExplores
exports.default = Chooslr
