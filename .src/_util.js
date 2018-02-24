export const identifier = account => `${account}.tumblr.com`

const isSuccees = status =>
  status === 200 ||
  status === 201

const throws = message => {
  throw new Error(message)
}

export const fetchInterface = (...arg) =>
  fetch(...arg)
  .then(res =>
    isSuccees(res.status)
    ? res.json()
    : throws(res.statusText)
  )
  .then(res =>
    isSuccees(res.meta.status)
    ? res.response
    : throws(res.meta.msg)
  )

export const joinParams = (params = {}) => {
  const valids = Object.entries(params).filter(([key, value]) => Boolean(value) || typeof value === 'number')
  return valids.length
    ? '?' + valids.map(([key,value]) => `${key}=${value}`).join('&')
    : ''
}
