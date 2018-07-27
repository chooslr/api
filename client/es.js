import regeneratorRuntime from 'regenerator-runtime'
import tiloop from 'tiloop'
import join from 'url-join'
import { blog } from 'tumblrinbrowser'

var asyncToGenerator = function(fn) {
  return function() {
    var gen = fn.apply(this, arguments)
    return new Promise(function(resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg)
          var value = info.value
        } catch (error) {
          reject(error)
          return
        }

        if (info.done) {
          resolve(value)
        } else {
          return Promise.resolve(value).then(
            function(value) {
              step('next', value)
            },
            function(err) {
              step('throw', err)
            }
          )
        }
      }

      return step('next')
    })
  }
}

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
  delete: '/delete',
  extract: '/extract'
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

var _this = undefined

var _marked = /*#__PURE__*/ regeneratorRuntime.mark(loop)

/* util */
var arrToUniques = function arrToUniques(arr) {
  return [].concat(toConsumableArray(new Set(arr).values()))
}

var throws = function throws(message) {
  throw new Error(message)
}

var asserts = function asserts(condition, message) {
  return !condition && throws(message)
}

/* fetch */

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
  var _ref =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    mode = _ref.mode,
    credentials = _ref.credentials,
    jwt = _ref.jwt

  return fetchInterface(path + joinParams(params), {
    method: 'GET',
    mode: mode,
    credentials: credentials,
    headers: new Headers(
      Object.assign({}, jwt && { Authorization: 'Bearer ' + jwt })
    )
  })
}

var fetchAsPost = function fetchAsPost(path, body) {
  var _ref2 =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    mode = _ref2.mode,
    credentials = _ref2.credentials,
    jwt = _ref2.jwt

  return fetchInterface(path, {
    method: 'POST',
    mode: mode,
    credentials: credentials,
    body: JSON.stringify(body),
    headers: new Headers(
      Object.assign(
        {},
        { 'content-type': 'application/json' },
        jwt && { Authorization: 'Bearer ' + jwt }
      )
    )
  })
}

/* fetch as "GET" */
var _user = function _user(prefix, options) {
  return fetchAsGet(join(prefix, endpoints['info']), undefined, options).then(
    function(_ref3) {
      var user = _ref3.user
      return user
    }
  )
}
var _followings = function _followings(prefix) {
  var _ref4 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    limit = _ref4.limit,
    offset = _ref4.offset

  var options = arguments[2]
  return fetchAsGet(
    join(prefix, endpoints['followings']),
    { limit: limit, offset: offset },
    options
  ).then(function(_ref5) {
    var blogs = _ref5.blogs
    return blogs
  })
}
var _explores = function _explores(prefix, options) {
  return fetchAsGet(join(prefix, endpoints['explores']), undefined, options)
    .then(function(_ref6) {
      var htmls = _ref6.htmls
      return htmls.map(extractNames)
    })
    .then(function(names_arr) {
      var _ref7

      return (_ref7 = []).concat.apply(_ref7, toConsumableArray(names_arr))
    })
    .then(function(names) {
      return arrToUniques(names)
    })
}
var _dashboard = function _dashboard(prefix) {
  var _ref8 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    limit = _ref8.limit,
    offset = _ref8.offset,
    type = _ref8.type,
    before_id = _ref8.before_id,
    since_id = _ref8.since_id,
    reblog_info = _ref8.reblog_info,
    notes_info = _ref8.notes_info

  var options = arguments[2]
  return fetchAsGet(
    join(prefix, endpoints['dashboard']),
    {
      limit: limit,
      offset: offset,
      type: type,
      before_id: before_id,
      since_id: since_id,
      reblog_info: reblog_info,
      notes_info: notes_info
    },
    options
  ).then(function(_ref9) {
    var posts = _ref9.posts
    return posts
  })
}
var _likes = function _likes(prefix) {
  var _ref10 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    limit = _ref10.limit,
    offset = _ref10.offset,
    before = _ref10.before,
    after = _ref10.after,
    reblog_info = _ref10.reblog_info,
    notes_info = _ref10.notes_info

  var options = arguments[2]
  return fetchAsGet(
    join(prefix, endpoints['likes']),
    {
      limit: limit,
      offset: offset,
      before: before,
      after: after,
      reblog_info: reblog_info,
      notes_info: notes_info
    },
    options
  ).then(function(_ref11) {
    var liked_posts = _ref11.liked_posts
    return liked_posts
  })
}
var _extract = function _extract(prefix, options) {
  return fetchAsGet(
    join(prefix, endpoints['extract']),
    undefined,
    options
  ).then(function(_ref12) {
    var jwt = _ref12.jwt
    return jwt
  })
}
var _follow = function _follow(prefix, name, options) {
  return fetchAsPost(
    join(prefix, endpoints['follow']),
    { name: name },
    options
  ).then(function(_ref13) {
    var blog$$1 = _ref13.blog
    return blog$$1
  })
}
var _unfollow = function _unfollow(prefix, name, options) {
  return fetchAsPost(
    join(prefix, endpoints['unfollow']),
    { name: name },
    options
  ).then(function(_ref14) {
    var blog$$1 = _ref14.blog
    return blog$$1
  })
}
var _reblog = function _reblog(prefix, name, id, reblog_key) {
  var _ref15 =
      arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {},
    comment = _ref15.comment,
    native_inline_images = _ref15.native_inline_images

  var options = arguments[5]
  return fetchAsPost(
    join(prefix, endpoints['reblog']),
    {
      name: name,
      id: id,
      reblog_key: reblog_key,
      comment: comment,
      native_inline_images: native_inline_images
    },
    options
  ).then(function(_ref16) {
    var id = _ref16.id
    return id
  })
}
var deletePost = function deletePost(prefix, name, id, options) {
  return fetchAsPost(
    join(prefix, endpoints['delete']),
    { name: name, id: id },
    options
  ).then(function(_ref17) {
    var id = _ref17.id
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

var _generateDashboard = function _generateDashboard(prefix) {
  var _ref18 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    _ref18$offset = _ref18.offset,
    offset = _ref18$offset === undefined ? 0 : _ref18$offset,
    _ref18$limit = _ref18.limit,
    limit = _ref18$limit === undefined ? 20 : _ref18$limit,
    type = _ref18.type,
    reblog_info = _ref18.reblog_info,
    notes_info = _ref18.notes_info

  var options = arguments[2]

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
    return _dashboard(prefix, params, options).then(function(posts) {
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
var _generateLikes = (function() {
  var _ref19 = asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee(prefix) {
      var _ref20 =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {},
        total = _ref20.total,
        _ref20$limit = _ref20.limit,
        limit = _ref20$limit === undefined ? 20 : _ref20$limit,
        _ref20$offset = _ref20.offset,
        offset = _ref20$offset === undefined ? 0 : _ref20$offset,
        reblog_info = _ref20.reblog_info,
        notes_info = _ref20.notes_info

      var options = arguments[2]
      var params
      return regeneratorRuntime.wrap(
        function _callee$(_context2) {
          while (1) {
            switch ((_context2.prev = _context2.next)) {
              case 0:
                asserts(limit <= 20, 'invalid limit')

                _context2.t0 = total

                if (_context2.t0) {
                  _context2.next = 6
                  break
                }

                _context2.next = 5
                return _user(prefix, options).then(function(_ref21) {
                  var likes = _ref21.likes
                  return likes
                })

              case 5:
                _context2.t0 = _context2.sent

              case 6:
                total = _context2.t0

                asserts(
                  typeof total === 'number' && total !== -1,
                  'invalid total'
                )

                params = {
                  before: undefined,
                  offset: offset,
                  limit: limit,
                  reblog_info: reblog_info,
                  notes_info: notes_info
                }
                return _context2.abrupt(
                  'return',
                  tiloop({
                    length: total - offset,
                    maxIncrement: limit,
                    promisify: true,
                    yielded: function yielded(indexedArr) {
                      return _likes(prefix, params, options).then(function(
                        posts
                      ) {
                        posts = posts.slice(0, indexedArr.length)
                        params.before = posts[posts.length - 1].liked_timestamp
                        params.offset = undefined
                        return posts
                      })
                    }
                  })
                )

              case 10:
              case 'end':
                return _context2.stop()
            }
          }
        },
        _callee,
        _this
      )
    })
  )

  return function _generateLikes(_x9) {
    return _ref19.apply(this, arguments)
  }
})()
var _generateFollowings = (function() {
  var _ref22 = asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee2(prefix) {
      var _ref23 =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {},
        total = _ref23.total,
        _ref23$limit = _ref23.limit,
        limit = _ref23$limit === undefined ? 20 : _ref23$limit,
        _ref23$offset = _ref23.offset,
        offset = _ref23$offset === undefined ? 0 : _ref23$offset

      var options = arguments[2]
      return regeneratorRuntime.wrap(
        function _callee2$(_context3) {
          while (1) {
            switch ((_context3.prev = _context3.next)) {
              case 0:
                asserts(limit <= 20, 'invalid limit')

                _context3.t0 = total

                if (_context3.t0) {
                  _context3.next = 6
                  break
                }

                _context3.next = 5
                return _user(prefix, options).then(function(_ref24) {
                  var following = _ref24.following
                  return following
                })

              case 5:
                _context3.t0 = _context3.sent

              case 6:
                total = _context3.t0

                asserts(
                  typeof total === 'number' && total !== -1,
                  'invalid total'
                )

                return _context3.abrupt(
                  'return',
                  tiloop({
                    length: total - offset,
                    maxIncrement: limit,
                    promisify: true,
                    yielded: function yielded(indexedArr) {
                      return _followings(
                        prefix,
                        { offset: indexedArr[0], limit: indexedArr.length },
                        options
                      )
                    }
                  })
                )

              case 9:
              case 'end':
                return _context3.stop()
            }
          }
        },
        _callee2,
        _this
      )
    })
  )

  return function _generateFollowings(_x11) {
    return _ref22.apply(this, arguments)
  }
})()
var _generateExplores = (function() {
  var _ref25 = asyncToGenerator(
    /*#__PURE__*/ regeneratorRuntime.mark(function _callee3(prefix) {
      var _ref26 =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : {},
        names = _ref26.names,
        _ref26$limit = _ref26.limit,
        limit = _ref26$limit === undefined ? 20 : _ref26$limit

      var _ref27 =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : {},
        api_key = _ref27.api_key,
        proxy = _ref27.proxy

      return regeneratorRuntime.wrap(
        function _callee3$(_context4) {
          while (1) {
            switch ((_context4.prev = _context4.next)) {
              case 0:
                asserts(api_key || proxy, 'required api_key || proxy')

                if (!Array.isArray(names)) {
                  _context4.next = 5
                  break
                }

                _context4.t0 = names
                _context4.next = 8
                break

              case 5:
                _context4.next = 7
                return _explores(prefix)

              case 7:
                _context4.t0 = _context4.sent

              case 8:
                names = _context4.t0
                return _context4.abrupt(
                  'return',
                  tiloop({
                    length: names.length,
                    maxIncrement: limit,
                    promisify: true,
                    yielded: function yielded(indexedArr) {
                      return Promise.all(
                        indexedArr.map(function(index) {
                          return blog({
                            api_key: api_key,
                            proxy: proxy,
                            name: names[index]
                          }).catch(function(err) {
                            return undefined
                          })
                        })
                      ).then(function(blogs) {
                        return blogs.filter(function(blog$$1) {
                          return blog$$1
                        })
                      })
                    }
                  })
                )

              case 10:
              case 'end':
                return _context4.stop()
            }
          }
        },
        _callee3,
        _this
      )
    })
  )

  return function _generateExplores(_x14) {
    return _ref25.apply(this, arguments)
  }
})()

var Chooslr = (function() {
  function Chooslr(prefix, tumblrOpts, options) {
    classCallCheck(this, Chooslr)

    asserts(prefix && typeof prefix === 'string')
    this.prefix = prefix

    var _ref28 = tumblrOpts || {},
      api_key = _ref28.api_key,
      proxy = _ref28.proxy

    asserts(typeof api_key === 'string' || typeof proxy === 'string')
    this.tumblrOpts = { api_key: api_key, proxy: proxy }

    var _ref29 = options || {},
      _ref29$credentials = _ref29.credentials,
      credentials =
        _ref29$credentials === undefined ? 'same-origin' : _ref29$credentials,
      _ref29$mode = _ref29.mode,
      mode = _ref29$mode === undefined ? 'same-origin' : _ref29$mode,
      jwt = _ref29.jwt

    this.fetchOpts = { credentials: credentials, mode: mode, jwt: jwt }
  }

  createClass(Chooslr, [
    {
      key: 'user',
      value: function user() {
        return _user(this.prefix, this.fetchOpts)
      }
    },
    {
      key: 'followings',
      value: function followings(params) {
        return _followings(this.prefix, params, this.fetchOpts)
      }
    },
    {
      key: 'explores',
      value: function explores() {
        return _explores(this.prefix, this.fetchOpts)
      }
    },
    {
      key: 'dashboard',
      value: function dashboard(params) {
        return _dashboard(this.prefix, params, this.fetchOpts)
      }
    },
    {
      key: 'likes',
      value: function likes(params) {
        return _likes(this.prefix, params, this.fetchOpts)
      }
    },
    {
      key: 'follow',
      value: function follow(name) {
        return _follow(this.prefix, name, this.fetchOpts)
      }
    },
    {
      key: 'unfollow',
      value: function unfollow(name) {
        return _unfollow(this.prefix, name, this.fetchOpts)
      }
    },
    {
      key: 'reblog',
      value: function reblog(name, id, reblog_key, params) {
        return _reblog(
          this.prefix,
          name,
          id,
          reblog_key,
          params,
          this.fetchOpts
        )
      }
    },
    {
      key: 'delete',
      value: function _delete(name, id) {
        return deletePost(this.prefix, name, id, this.fetchOpts)
      }
    },
    {
      key: 'generateDashboard',
      value: function generateDashboard(params) {
        return _generateDashboard(this.prefix, params, this.fetchOpts)
      }
    },
    {
      key: 'generateLikes',
      value: function generateLikes(params) {
        return _generateLikes(this.prefix, params, this.fetchOpts)
      }
    },
    {
      key: 'generateFollowings',
      value: function generateFollowings(params) {
        return _generateFollowings(this.prefix, params, this.fetchOpts)
      }
    },
    {
      key: 'generateExplores',
      value: function generateExplores() {
        var _ref30 =
            arguments.length > 0 && arguments[0] !== undefined
              ? arguments[0]
              : {},
          names = _ref30.names,
          limit = _ref30.limit

        return _generateExplores(
          this.prefix,
          { names: names, limit: limit },
          this.tumblrOpts
        )
      }
    },
    {
      key: 'attachURL',
      value: function attachURL(redirect_url) {
        return (
          join(this.prefix, '/attach') +
          joinParams({ redirect_url: redirect_url })
        )
      }
    },
    {
      key: 'detachURL',
      value: function detachURL(redirect_url) {
        return (
          join(this.prefix, '/detach') +
          joinParams({ redirect_url: redirect_url })
        )
      }
    },
    {
      key: 'extract',
      value: function extract() {
        return _extract(this.prefix, this.fetchOpts)
      }
    }
  ])
  return Chooslr
})()

export default Chooslr
export {
  _user as user,
  _followings as followings,
  _explores as explores,
  _dashboard as dashboard,
  _likes as likes,
  _extract as extract,
  _follow as follow,
  _unfollow as unfollow,
  _reblog as reblog,
  deletePost,
  _generateDashboard as generateDashboard,
  _generateLikes as generateLikes,
  _generateFollowings as generateFollowings,
  _generateExplores as generateExplores,
  endpoints,
  joinParams,
  asserts
}
