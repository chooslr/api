import tiloop, { IndexesRandom, IndexesZero } from 'tiloop'

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

var post = function post(account, api_key, id) {
  var _ref3 =
      arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
    reblog_info = _ref3.reblog_info,
    notes_info = _ref3.notes_info

  return postsAPI(account, api_key, {
    id: id,
    reblog_info: reblog_info,
    notes_info: notes_info
  }).then(function(_ref4) {
    var posts = _ref4.posts
    return posts[0]
  })
}

var total = function total(account, api_key) {
  var _ref5 =
      arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
    type = _ref5.type,
    tag = _ref5.tag

  return postsAPI(account, api_key, { limit: 1, type: type, tag: tag }).then(
    function(_ref6) {
      var total_posts = _ref6.total_posts
      return total_posts
    }
  )
}

var blog = function blog(account, api_key) {
  return infoAPI(account, api_key).then(function(_ref7) {
    var blog = _ref7.blog
    return blog
  })
}

var avatar = function avatar(account) {
  var size =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64
  return API_URL(account) + '/avatar/' + size
}

var samplingPosts = async function samplingPosts(account, api_key, params) {
  var _ref = params || {},
    type = _ref.type,
    _ref$denom = _ref.denom,
    denom = _ref$denom === undefined ? SAMPLING_DENOM : _ref$denom,
    _ref$maxNum = _ref.maxNum,
    maxNum = _ref$maxNum === undefined ? SAMPLING_MAX_NUM : _ref$maxNum

  var length = await total(account, api_key, { type: type })
  asserts(length > 0, 'sampling account has no posts')

  var maxIncrement = Math.floor(length / denom)
  asserts(maxIncrement > 0, 'sampling account has no posts')

  var iterator = tiloop(
    new IndexesRandom({ length: length, maxIncrement: maxIncrement }),
    function(indexedArr) {
      return posts(account, api_key, {
        type: type,
        offset: indexedArr[0],
        limit: indexedArr.length < maxNum ? indexedArr.length : maxNum
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

var MAX_INCREMENT = 20

var HoPosts = async function HoPosts(account, api_key, params) {
  var _ref = params || {},
    _ref$offset = _ref.offset,
    offset = _ref$offset === undefined ? 0 : _ref$offset,
    _ref$limit = _ref.limit,
    limit = _ref$limit === undefined ? MAX_INCREMENT : _ref$limit,
    type = _ref.type,
    tag = _ref.tag,
    reblog_info = _ref.reblog_info,
    notes_info = _ref.notes_info,
    filter = _ref.filter

  asserts(limit <= MAX_INCREMENT, 'HoPosts > invalid limit')

  var total$$1 = await total(account, api_key, { type: type, tag: tag })

  asserts(offset < total$$1, 'HoPosts > invalid offset')

  var iterator = tiloop(
    new IndexesZero({
      length: total$$1 - offset,
      maxIncrement: limit
    }),
    function(indexedArr) {
      return posts(account, api_key, {
        offset: indexedArr[0] + offset,
        limit: indexedArr.length,
        type: type,
        tag: tag,
        reblog_info: reblog_info,
        notes_info: notes_info,
        filter: filter
      })
    }
  )

  return wrapIteratorAsAsync(iterator)
}

var HoPostsRandom = async function HoPostsRandom(account, api_key, params) {
  var _ref2 = params || {},
    _ref2$offset = _ref2.offset,
    offset = _ref2$offset === undefined ? 0 : _ref2$offset,
    _ref2$limit = _ref2.limit,
    limit = _ref2$limit === undefined ? MAX_INCREMENT : _ref2$limit,
    type = _ref2.type,
    tag = _ref2.tag,
    reblog_info = _ref2.reblog_info,
    notes_info = _ref2.notes_info,
    filter = _ref2.filter

  asserts(limit <= MAX_INCREMENT, 'HoPostsRandom > invalid limit')

  var total$$1 = await total(account, api_key, { type: type, tag: tag })

  asserts(offset < total$$1, 'HoPostsRandom > invalid offset')

  var iterator = tiloop(
    new IndexesRandom({
      length: total$$1 - offset,
      maxIncrement: limit
    }),
    function(indexedArr) {
      return posts(account, api_key, {
        offset: indexedArr[0] + offset,
        limit: indexedArr.length,
        type: type,
        tag: tag,
        reblog_info: reblog_info,
        notes_info: notes_info,
        filter: filter
      })
    }
  )

  return wrapIteratorAsAsync(iterator)
}

var POST_TYPES = [
  'quote',
  'text',
  'chat',
  'photo',
  'link',
  'video',
  'audio',
  'answer'
]

var TumblrCors = (function() {
  function TumblrCors(api_key) {
    classCallCheck(this, TumblrCors)

    this.api_key = api_key
  }

  createClass(TumblrCors, [
    {
      key: 'posts',
      value: function posts$$1(account, params) {
        return posts(account, this.api_key, params)
      }
    },
    {
      key: 'post',
      value: function post$$1(account, id, params) {
        return post(account, this.api_key, id, params)
      }
    },
    {
      key: 'total',
      value: function total$$1(account, params) {
        return total(account, this.api_key, params)
      }
    },
    {
      key: 'blog',
      value: function blog$$1(account) {
        return blog(account, this.api_key)
      }
    },
    {
      key: 'avatar',
      value: function avatar$$1(account) {
        var size =
          arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 64

        return avatar(account, size)
      }
    },
    {
      key: 'samplingPosts',
      value: function samplingPosts$$1(account, params) {
        return samplingPosts(account, this.api_key, params)
      }
    },
    {
      key: 'samplingTags',
      value: function samplingTags$$1(account, params) {
        return samplingTags(account, this.api_key, params)
      }
    },
    {
      key: 'HoPosts',
      value: function HoPosts$$1() {
        return HoPosts(account, this.api_key, params)
      }
    },
    {
      key: 'HoPostsRandom',
      value: function HoPostsRandom$$1() {
        return HoPostsRandom(account, this.api_key, params)
      }
    }
  ])
  return TumblrCors
})()

export default TumblrCors
export {
  posts,
  post,
  total,
  blog,
  avatar,
  samplingPosts,
  samplingTags,
  HoPosts,
  HoPostsRandom,
  POST_TYPES
}
