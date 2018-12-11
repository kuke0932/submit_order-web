/**
 *
 * @author Liuchaoqun
 * @create 2018-05-09 9:19
 **/
import request from '@/utils/request'

/**
 * 获取业务收款单列表
 * @param empID 员工
 * @param search 搜索内容，顾客姓名、顾客手机号
 * @param pageIndex
 * @param pageSize
 */
export function getList(orgID, empID, search, pageIndex, pageSize) {
  const data = [{
    OrgId: orgID,
    EmpID: empID,
    search: search,
    PageIndex: pageIndex,
    PageSize: pageSize
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.BusinessReceipt.BusinessCreditInterface.getList,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 新增业务收款单
 * @param jsonData
 */
export function addCollection(jsonData) {
  const data = [
    jsonData
  ]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.BusinessReceipt.BusinessCreditInterface.Add,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 收款
 * @param Fid 业务收款单FID
 * @param forgid 组织ID
 */
export function toCollection(Fid, forgid) {
  const data = [{
    Fid: Fid,
    forgid: forgid
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.BusinessReceipt.BusinessCreditInterface.pay,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 获取派工单列表
 * @param orgid 组织ID
 * @param deptid 部门ID
 * @param workerName 员工名字
 * @param search 搜索内容，顾客姓名、顾客手机号
 * @param pageIndex
 * @param pageSize
 */
export function getPgdList(orgid, deptid, workerName, whorkerId, search, pageIndex, pageSize) {
  const data = [{
    orgID: orgid,
    deptID: deptid,
    workerName: workerName,
    whorkerId: whorkerId,
    search: search,
    pageIndex: pageIndex,
    pageSize: pageSize
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.BusinessReceipt.GetWorkOrderListWebAPI.GetpgdList,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 通过FID获取业务收款单明细
 * @param Fid 业务收款单FID
 */
export function getListByfid(Fid) {
  const data = [
    Fid
  ]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.BusinessReceipt.BusinessCreditInterface.getListByfid,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}
