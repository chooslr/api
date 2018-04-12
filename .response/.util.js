export const outpath = (type) => `.res/jsons/${type}.json`
export const account = 'kthjm'
export const spaces = '  '

export const extractZero = ([zero]) => zero

export const HoExtractExclude = (excludes) =>
  (post) => {
    const result = {}
    const excludes_keys = Array.isArray(excludes) ? excludes : excludes(post)

    Object
    .keys(post)
    .filter(key => !excludes_keys.includes(key))
    .forEach(key => result[key] = post[key])

    return result
  }

export const createCommon = (posts) => {
  const result = {}
  const properties = new Map()

  posts.forEach(post =>
    Object.keys(post).forEach(key =>
      !properties.has(key) &&
      properties.set(key, post[key])
    )
  )

  ;[...properties.keys()]
  .filter(key => posts.every(post => Object.keys(post).includes(key)))
  .forEach(key => result[key] = properties.get(key))

  return result
}