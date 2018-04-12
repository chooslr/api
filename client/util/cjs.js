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

exports.identifier = identifier
exports.fetchInterface = fetchInterface
exports.asserts = asserts
exports.joinParams = joinParams
exports.arrToUniques = arrToUniques
exports.SAMPLING_DENOM = SAMPLING_DENOM
exports.SAMPLING_MAX_NUM = SAMPLING_MAX_NUM
exports.wrapIteratorAsAsync = wrapIteratorAsAsync
exports.feedArrayRecursiveTillDone = feedArrayRecursiveTillDone
exports.postsToTags = postsToTags
