/**
 *
 * @author Dragon
 * @create 2018-03-02 11:02
 **/
import request from '@/utils/request'

/**
 * 查询顾客接口
 * @param PageIndex     第几页
 * @param PageSize      每页条数
 * @param search        搜索内容，按顾客姓名和顾客手机号查找
 * @param BussinessId    商家id
 */
export function GetMemberInfo(PageIndex, PageSize, search, BussinessId) {
  const data = [{
    PageIndex: PageIndex,
    PageSize: PageSize,
    search: search,
    BussinessId: BussinessId
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.MemberInfo.GetMemberInfo,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 顾客保存接口
 * @param jsonData     jsonData数据包
 */
export function SaveMemberInfoNew(jsonData) {
  const data = [
    jsonData
  ]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.MemberInfo.SaveMemberInfoNew,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 查询顾客信息
 * @param formId        业务对象表单Id（必录）
 * @param startRow      开始行（非必录）
 * @param topRowCount   总行数（非必录）
 * @param limit         最大行数，不能超过2000（非必录）
 * @param filterString  过滤（非必录）
 * @param orderString   排序字段（非必录）
 * @param fieldKeys     字段keys，字符串类型用逗号分隔，比如"key1,key2..."（必录）
 */
export function executeBillQuery(formId, fieldKeys, filterString = '', orderString = '', startRow = 0, topRowCount = 0, limit = 0) {
  const data = [{
    FormId: formId,
    TopRowCount: topRowCount,
    Limit: limit,
    StartRow: startRow,
    FilterString: filterString,
    OrderString: orderString,
    FieldKeys: fieldKeys
  }]
  return request({
    url: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.ExecuteBillQuery.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 顾客添加、修改接口  如果是修改顾客信息则需要传入对应单据的**FID**和**FNumber**
 * @param jsonData  json数据包
 */
export function save(jsonData) {
  const data = [
    'kf3a96165411248208f1c003b965344be',
    jsonData
  ]
  return request({
    url: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Save.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 顾客信息提交接口
 * @param jsonData  json数据包
 */
export function submit(jsonData) {
  const data = [
    'kf3a96165411248208f1c003b965344be',
    jsonData
  ]
  return request({
    url: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Submit.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 顾客信息提交接口
 * @param number
 */
export function SubmitMemberInfo(number) {
  const data = [
    number
  ]
  return request({
    url: 'K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.MemberInfo.SubmitMemberInfo,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 顾客信息审核接口
 * @param jsonData  json数据包
 */
export function audit(jsonData) {
  const data = [
    'kf3a96165411248208f1c003b965344be',
    jsonData
  ]
  return request({
    url: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Audit.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 顾客信息反审核接口
 * @param jsonData  json数据包
 */
export function unAudit(jsonData) {
  const data = [
    'kf3a96165411248208f1c003b965344be',
    jsonData
  ]
  return request({
    url: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.UnAudit.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 顾客信息删除接口
 * @param jsonData  json数据包
 */
export function remove(jsonData) {
  const data = [
    'kf3a96165411248208f1c003b965344be',
    jsonData
  ]
  return request({
    url: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Delete.common.kdsvc',
    method: 'post',
    data: data
  })
}
