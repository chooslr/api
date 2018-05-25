export const endpoints = {
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

export const joinParams = (params = {}) => {
  const valids = Object.entries(params).filter(([key,value]) => value)
  return valids.length
    ? '?' + valids.map(([key,value]) => `${key}=${value}`).join('&')
    : ''
}