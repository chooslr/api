'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

function _interopDefault(ex) {
  return ex && typeof ex === 'object' && 'default' in ex ? ex['default'] : ex
}

var jsonp = _interopDefault(require('jsonp-simple'))
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

var SAMPLING_DENOM = 4
var SAMPLING_MAX_NUM = 3

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

var feedArrayRecursiveTillDone = async function feedArrayRecursiveTillDone(
  feed
) {
  var set$$1 =
    arguments.length > 1 && arguments[1] !== undefined
      ? arguments[1]
      : new Set()

  var _ref5 = await feed(),
    done = _ref5.done,
    fetched_posts = _ref5.res

  fetched_posts.forEach(function(post) {
    return set$$1.add(post)
  })
  return done
    ? [].concat(toConsumableArray(set$$1.values()))
    : feedArrayRecursiveTillDone(feed, set$$1)
}

var postsToTags = function postsToTags(posts) {
  var _ref6

  return arrToUniques(
    (_ref6 = []).concat.apply(
      _ref6,
      toConsumableArray(
        posts
          .filter(function(_ref7) {
            var tags = _ref7.tags
            return tags
          })
          .map(function(_ref8) {
            var tags = _ref8.tags
            return tags
          })
      )
    )
  )
}

var BASE = function BASE(account) {
  return 'https://' + identifier(account)
}
var API_URL = function API_URL(account) {
  return BASE(account) + '/api/read/json'
}

var v1API = function v1API(account) {
  var _ref =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    start = _ref.start,
    num = _ref.num,
    type = _ref.type,
    tag = _ref.tag,
    id = _ref.id,
    filter = _ref.filter

  var timeout =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5000
  return jsonp(
    API_URL(account) +
      joinParams({
        start: start,
        num: num,
        type: type,
        tagged: tag,
        id: id,
        filter: filter
      }),
    timeout
  )
}

var posts = function posts(account, options, timeout) {
  return v1API(account, options, timeout).then(function(_ref2) {
    var posts = _ref2.posts
    return posts
  })
}

var post = function post(account, id, timeout) {
  return v1API(account, { id: id }, timeout).then(function(_ref3) {
    var posts = _ref3.posts
    return posts[0]
  })
}

var total = function total(account) {
  var _ref4 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    type = _ref4.type,
    tag = _ref4.tag

  var timeout = arguments[2]
  return v1API(account, { num: 0, type: type, tag: tag }, timeout).then(
    function(res) {
      return res['posts-total']
    }
  )
}

var blog = function blog(account, timeout) {
  return v1API(account, { num: 0 }, timeout).then(function(_ref5) {
    var tumblelog = _ref5.tumblelog
    return tumblelog
  })
}

var samplingPosts = async function samplingPosts(account, params) {
  var _ref = params || {},
    type = _ref.type,
    _ref$denom = _ref.denom,
    denom = _ref$denom === undefined ? SAMPLING_DENOM : _ref$denom,
    _ref$maxNum = _ref.maxNum,
    maxNum = _ref$maxNum === undefined ? SAMPLING_MAX_NUM : _ref$maxNum

  var length = await total(account)
  asserts(length > 0, 'sampling account has no posts')

  var maxIncrement = Math.floor(length / denom)
  asserts(maxIncrement > 0, 'sampling account has no posts')

  var iterator = tiloop__default(
    new tiloop.IndexesRandom({ length: length, maxIncrement: maxIncrement }),
    function(indexedArr) {
      return posts(account, {
        type: type,
        start: indexedArr[0],
        num: indexedArr.length < maxNum ? indexedArr.length : maxNum
      })
    }
  )

  var feed = wrapIteratorAsAsync(iterator)
  var posts$$1 = await feedArrayRecursiveTillDone(feed)

  return posts$$1
}

var samplingTags = function samplingTags() {
  return samplingPosts.apply(undefined, arguments).then(postsToTags)
}

var MAX_INCREMENT = 50

var HoPosts = async function HoPosts(account, params) {
  var _ref = params || {},
    _ref$start = _ref.start,
    start = _ref$start === undefined ? 0 : _ref$start,
    _ref$num = _ref.num,
    num = _ref$num === undefined ? MAX_INCREMENT : _ref$num,
    type = _ref.type,
    tag = _ref.tag,
    filter = _ref.filter

  asserts(num <= MAX_INCREMENT, 'HoPosts > invalid num')

  var total$$1 = await total(account, { type: type, tag: tag })

  asserts(start < total$$1, 'HoPosts > invalid start')

  var iterator = tiloop__default(
    new tiloop.IndexesZero({
      length: total$$1 - start,
      maxIncrement: num
    }),
    function(indexedArr) {
      return posts(account, {
        start: indexedArr[0] + start,
        num: indexedArr.length,
        type: type,
        tag: tag,
        filter: filter
      })
    }
  )

  return wrapIteratorAsAsync(iterator)
}

var HoPostsRandom = async function HoPostsRandom(account, params) {
  var _ref2 = params || {},
    _ref2$start = _ref2.start,
    start = _ref2$start === undefined ? 0 : _ref2$start,
    _ref2$num = _ref2.num,
    num = _ref2$num === undefined ? MAX_INCREMENT : _ref2$num,
    type = _ref2.type,
    tag = _ref2.tag,
    filter = _ref2.filter

  asserts(num <= MAX_INCREMENT, 'HoPostsRandom > invalid num')

  var total$$1 = await total(account, { type: type, tag: tag })

  asserts(start < total$$1, 'HoPostsRandom > invalid start')

  var iterator = tiloop__default(
    new tiloop.IndexesRandom({
      length: total$$1 - start,
      maxIncrement: num
    }),
    function(indexedArr) {
      return posts(account, {
        start: indexedArr[0] + start,
        num: indexedArr.length,
        type: type,
        tag: tag,
        filter: filter
      })
    }
  )

  return wrapIteratorAsAsync(iterator)
}

exports.posts = posts
exports.post = post
exports.total = total
exports.blog = blog
exports.samplingPosts = samplingPosts
exports.samplingTags = samplingTags
exports.HoPosts = HoPosts
exports.HoPostsRandom = HoPostsRandom
