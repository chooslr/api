import jsonp from 'jsonp-simple'

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
    id = _ref.id,
    filter = _ref.filter,
    tagged = _ref.tagged

  return jsonp(
    API_URL(account) +
      joinParams({
        start: start,
        num: num,
        type: type,
        id: id,
        filter: filter,
        tagged: tagged
      })
  )
}

var posts = function posts(account, options) {
  return v1API(account, options).then(function(_ref2) {
    var posts = _ref2.posts
    return posts
  })
}

var single = function single(account, id) {
  return v1API(account, { id: id }).then(function(_ref3) {
    var posts = _ref3.posts
    return posts[0]
  })
}

var total = function total(account) {
  var _ref4 =
      arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
    type = _ref4.type,
    tag = _ref4.tag

  return v1API(account, { num: 0, type: type, tagged: tag }).then(function(
    res
  ) {
    return res['posts-total']
  })
}

var blog = function blog(account) {
  return v1API(account, { num: 0 }).then(function(_ref5) {
    var tumblelog = _ref5.tumblelog
    return tumblelog
  })
}

export { posts, single, total, blog }
