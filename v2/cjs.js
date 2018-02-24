'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

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

var identifier = function identifier(account) {
  return account + '.tumblr.com'
}

var isSuccees = function isSuccees(status) {
  return status === 200 || status === 201
}

var throws = function throws(message) {
  throw new Error(message)
}

var fetchInterface = function fetchInterface() {
  return fetch
    .apply(undefined, arguments)
    .then(function(res) {
      return isSuccees(res.status) ? res.json() : throws(res.statusText)
    })
    .then(function(res) {
      return isSuccees(res.meta.status) ? res.response : throws(res.meta.msg)
    })
}

var joinParams = function joinParams() {
  var params =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

  var valids = Object.entries(params).filter(function(_ref) {
    var _ref2 = slicedToArray(_ref, 2),
      key = _ref2[0],
      value = _ref2[1]

    return Boolean(value) || typeof value === 'number'
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

var BASE = 'https://api.tumblr.com/v2/blog'
var API_URL = function API_URL(account) {
  return BASE + '/' + identifier(account)
}
var method = 'GET'
var mode = 'cors'

var postsAPI = function postsAPI(account, api_key) {
  var _ref =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    type = _ref.type,
    tag = _ref.tag,
    id = _ref.id,
    limit = _ref.limit,
    offset = _ref.offset,
    reblog_info = _ref.reblog_info,
    notes_info = _ref.notes_info,
    filter = _ref.filter

  return fetchInterface(
    API_URL(account) +
      '/posts' +
      joinParams({
        api_key: api_key,
        type: type,
        tag: tag,
        id: id,
        limit: limit,
        offset: offset,
        reblog_info: reblog_info,
        notes_info: notes_info,
        filter: filter
      }),
    { method: method, mode: mode }
  )
}

var infoAPI = function infoAPI(account, api_key) {
  return fetchInterface(
    API_URL(account) + '/info' + joinParams({ api_key: api_key }),
    { method: method, mode: mode }
  )
}

var posts = function posts(account, api_key, params) {
  return postsAPI(account, api_key, params).then(function(_ref2) {
    var posts = _ref2.posts
    return posts
  })
}

var single = function single(account, api_key, id) {
  return postsAPI(account, api_key, { id: id }).then(function(_ref3) {
    var posts = _ref3.posts
    return posts[0]
  })
}

var total = function total(account, api_key) {
  var _ref4 =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    type = _ref4.type,
    tag = _ref4.tag

  return postsAPI(account, api_key, { limit: 1, type: type, tag: tag }).then(
    function(_ref5) {
      var total_posts = _ref5.total_posts
      return total_posts
    }
  )
}

var blog = function blog(account, api_key) {
  return infoAPI(account, api_key).then(function(_ref6) {
    var blog = _ref6.blog
    return blog
  })
}

var avatar = function avatar(account) {
  var size =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64
  return API_URL(account) + '/avatar/' + size
}

exports.posts = posts
exports.single = single
exports.total = total
exports.blog = blog
exports.avatar = avatar
