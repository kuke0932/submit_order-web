import Cookies from 'js-cookie'

const TokenKey = 'kdservice-sessionid'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, options) {
  if (options) {
    return Cookies.set(TokenKey, token, options)
  } else {
    return Cookies.set(TokenKey, token)
  }
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
