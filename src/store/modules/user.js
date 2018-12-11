import { loginByUsername, getUserInfo } from '@/api/login'
import { getToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    organizations: [],
    organizationsAndAppModel: [],
    // apps: [],
    // shops: [],
    userID: '',
    deptMercCustModel: [],
    deptMercCustModelIndex: 0,
    employees: [],
    // dept: [],
    mrStock: [],
    grStock: [],
    setting: { },
    billType: []
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ORGANIZATIONS: (state, organizations) => {
      state.organizations = organizations
    },
    SET_USERID: (state, userID) => {
      state.userID = userID
    },
    SET_EMPLOYEES: (state, employees) => {
      state.employees = employees
    },
    SET_BILLTYPE: (state, billType) => {
      state.billType = billType
    },
    SET_MRSTOCK: (state, mrStock) => {
      state.mrStock = mrStock
    },
    SET_GRSTOCK: (state, grStock) => {
      state.grStock = grStock
    },
    SET_DEPTMERCCUSTMODEL: (state, deptMercCustModel) => {
      state.deptMercCustModel = deptMercCustModel
    },
    SET_ORGANIZATIONSANDAPPMODEL: (state, organizationsAndAppModel) => {
      state.organizationsAndAppModel = organizationsAndAppModel
    },
    set_deptMercCustModelIndex: (state, deptMercCustModelIndex) => {
      state.deptMercCustModelIndex = deptMercCustModelIndex
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.mobile.trim().replace(/ /g, ''), userInfo.password, userInfo.appNumber).then(response => {
          const data = response[0]
          if (data.Result === 1) {
            // 默认使用第一个
            if (data.DeptMercCustModel.length > 0) {
              commit('SET_ORGANIZATIONS', [{
                ORGID: data.DeptMercCustModel[0].ORGID,
                FNUMBER: data.DeptMercCustModel[0].FNUMBER,
                FNAME: data.DeptMercCustModel[0].FNAME
              }])
            }
            commit('SET_DEPTMERCCUSTMODEL', data.DeptMercCustModel)
            if (data.AppsModel.length !== 0) {
              commit('SET_ORGANIZATIONSANDAPPMODEL', data.AppsModel)
            }
            commit('SET_USERID', data.UserID)
            commit('SET_EMPLOYEES', data.EmployeesModel)
            commit('SET_BILLTYPE', data.billtype[0].billType)
            commit('SET_MRSTOCK', data.mrStockModel)
            commit('SET_GRSTOCK', data.grStockModel)
            sessionStorage.setItem('loginSuccessful', true)
            resolve()
          } else {
            reject(data)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取门店
    setDeptMercCustModelIndex({ commit }, deptMercCustModelIndex) {
      return new Promise((resolve, reject) => {
        commit('set_deptMercCustModelIndex', deptMercCustModelIndex)
        resolve()
      })
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          if (!response.data) { // 由于mockjs 不支持自定义状态码只能这样hack
            reject(new Error('error'))
          }
          const data = response.data.data
          // commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        commit('SET_CODE', [])
        commit('SET_TOKEN', [])
        commit('SET_INTRODUCTION', [])
        commit('SET_STATUS', [])
        commit('SET_NAME', [])
        commit('SET_AVATAR', [])
        commit('SET_ROLES', [])
        commit('SET_ORGANIZATIONS', [])
        commit('SET_USERID', [])
        commit('SET_EMPLOYEES', [])
        commit('SET_BILLTYPE', [])
        commit('SET_MRSTOCK', [])
        commit('SET_GRSTOCK', [])
        commit('SET_DEPTMERCCUSTMODEL', [])
        commit('SET_ORGANIZATIONSANDAPPMODEL', [])
        commit('set_deptMercCustModelIndex', 0)
        removeToken()
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeToken()
        resolve()
      })
    }
  }
}

export default user
