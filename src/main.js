// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import store from './store'
import { ToastPlugin, AlertPlugin, LoadingPlugin, ConfirmPlugin, DatetimePlugin } from 'vux'
import { getToken } from '@/utils/auth' // getToken from cookie
import Stack from '@/utils/stack' // getToken from cookie

// eslint-disable-next-line

// import VConsole from 'vconsole'
// const vconsole = new VConsole()
//
// Vue.use(vconsole)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(LoadingPlugin)
Vue.use(ConfirmPlugin)
Vue.use(DatetimePlugin)

const whiteList = ['/login', '/authredirect', '/login/changePwd']// no redirect whitelist

router.beforeEach((to, from, next) => {
  if (!window.back) {
    window.historyStack.push(to)
  }
  if (getToken() && sessionStorage.getItem('loginSuccessful') === 'true') {
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to, from) => {
  if (window.back) {
    window.back = false
    window.historyStack.pop()
  }
})

FastClick.attach(document.body)

Vue.config.productionTip = false
const bus = new Vue()

Vue.prototype.bus = function() {
  return bus
}

Vue.prototype.back = function() {
  window.back = true
  window.history.back()
}

Vue.prototype.numberFixed2 = function(number) {
  if (isNaN(number)) {
    return 0
  }
  if (typeof number === 'number') {
    return number.toFixed(2)
  } else {
    return Number.parseFloat(number).toFixed(2)
  }
}

Vue.prototype.numberFixed0 = function(number) {
  if (isNaN(number)) {
    return 0
  }
  if (typeof number === 'number') {
    return number.toFixed(0)
  } else {
    return Number.parseFloat(number).toFixed(0)
  }
}

/* 时间补0 */
Vue.prototype.dateAdd0 = function(date) {
  if (date < 10) {
    return '0' + date
  } else {
    return date
  }
}

/* 判断用户权限 */
Vue.prototype.isAuthority = function(appNumber, localAppNumbers) {
  let flag = false
  for (let i = 0; i < localAppNumbers.length; i++) {
    if (localAppNumbers[i] === appNumber) {
      flag = true
      break
    }
  }
  return flag
}
window.historyStack = new Stack()

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
