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

var toConsumableArray = function(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++)
      arr2[i] = arr[i]

    return arr2
  } else {
    return Array.from(arr)
  }
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
    after = _ref8.after

  return fetchAsGet(BASE + '/likes', {
    limit: limit,
    offset: offset,
    before: before,
    after: after
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
      .children[0].innerText.trim()
  })
}

var arrToUniques = function arrToUniques(arr) {
  return [].concat(toConsumableArray(new Set(arr).values()))
}

exports.user = user
exports.followings = followings
exports.explores = explores
exports.dashboard = dashboard
exports.likes = likes
exports.follow = follow
exports.unfollow = unfollow
exports.reblog = reblog
