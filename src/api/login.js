import request from '@/utils/request'

export function loginByUsername(username, password, appNumber) {
  const data = [{
    phoneNumber: username,
    passWord: password,
    appNumber: appNumber
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.LoginAndGetUsersInfoNew.login,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}
/**
 * 修改密码
 * */

export function changePwd(PhoneNumber, OldPWD, NewPWD) {
  const data = [{
    'PhoneNumber': PhoneNumber,
    'OldPWD': OldPWD,
    'NewPWD': NewPWD
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.LoginAndGetUsersInfoNew.changePWD,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

export function logout() {
  return request({
    url: '/system/admin/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/system/admin/getUserInfo',
    method: 'get'
  })
}

export function init() {
  const data = [
    // '5a55e9ea6006cf',
    // 'administrator',
    // 'nh6.66',
    '5b2c9b00f561dd', // 测试
    // '5a78cf51384133', // 正式
    'webapi',
    '888888',
    2052
  ]
  // const token = getToken()
  // if (token) {
  //   return new Promise((resolve, reject) => {
  //     if (token) {
  //       resolve()
  //     }
  //   })
  // } else {
  return request({
    url: 'K3Cloud/Kingdee.BOS.WebApi.ServicesStub.AuthService.ValidateUser.common.kdsvc',
    method: 'post',
    data
  })
  // }
}

export function generateRoutes() {
  return request({
    url: '/system/admin/generateRoutes',
    method: 'get'
  })
}
