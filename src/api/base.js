/**
 *
 * @author Dragon
 * @create 2018-03-02 11:02
 **/
import request from '@/utils/request'

/**
 * 顾客添加、修改接口  如果是修改顾客信息则需要传入对应单据的**FID**和**FNumber**
 * @param data  数组
 */
export function save(data) {
  return request({
    url: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Save.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 批量修改保存**
 * @param data  数组
 */
export function batchSave(data) {
  return request({
    url: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.BatchSave.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 保存单据
 * @param data
 */
export function materialDocumentsSave(data) {
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.MaterialDocumentsSave.EntrySave,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 提交接口
 * @param data  json数据包
 */
export function submit(data) {
  return request({
    url: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Submit.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 顾客信息审核接口
 * @param jsonData  json数据包
 */
export function audit(jsonData) {
  return request({
    url: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Audit.common.kdsvc',
    method: 'post',
    data: jsonData
  })
}

/**
 * 顾客信息反审核接口
 * @param data
 */
export function unAudit(data) {
  return request({
    url: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.UnAudit.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 顾客信息删除接口
 * @param data  数组
 */
export function remove(data) {
  return request({
    url: '/K3Cloud/Kingdee.BOS.WebApi.ServicesStub.DynamicFormService.Delete.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 还料删除接口
 * @param data  数组
 */
export function removeReturn(data) {
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.MaterialDocumentsDelet.DocumentDelete,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}
