import axios from 'axios'
import UUID from 'uuid'
import Vue from 'vue'
import { removeToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 15000, // request timeout 15s
  withCredentials: true
})

// request interceptor
service.interceptors.request.use(config => {
  // Do something before request is sent
  // if (store.getters.token) {
    // config.headers['x-auth-token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  // }
  const hashCode = (str) => {
    let hash = 0
    if (str.length === 0) return hash
    for (let i = 0; i < str.length; i++) {
      let char = str.charCodeAt(i)
      hash = ((hash << 5) + hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }
  const addition = {
    'format': 1,
    'useragent': 'ApiClient',
    'rid': hashCode(UUID.v1()),
    'timestamp': new Date().getTime(),
    'v': '1.0',
    'parameters': config.data
  }
  config.data = addition
  Vue.$vux.loading.show({
    text: '页面加载中...'
  })
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    Vue.$vux.loading.hide()
    if (typeof response.data === 'string' && response.data.startsWith('response_error:')) {
      if (response.data.indexOf('"Message":"{ctx == null}"') > 0) {
        Vue.$vux.confirm.show({
          title: '登录超时！',
          content: '登录超时,请重新登录！点击跳转到登录页，取消留在当前页面!',
          onConfirm() {
            removeToken()
            window.location.reload()
          },
          onCancel() {
          }
        })
      } else {
        Vue.$vux.alert.show({
          title: '系统出错！',
          content: '系统内部出错,请联系管理员或者稍后重试！'
        })
      }
      return Promise.reject(new Error('系统内部出错,请联系管理员或者稍后重试！'))
    } else {
      return response.data
    }
  },
  error => {
    Vue.$vux.loading.hide()
    console.log('err' + error)// for debug
    if (error.toString().indexOf('timeout') >= 0) {
      Vue.$vux.alert.show({
        title: '网络超时！',
        content: '网络超时,请稍后重试！'
      })
    }
    return Promise.reject(error)
  })

export default service
