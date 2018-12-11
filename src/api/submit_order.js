/**
 *
 * @author Dragon
 * @create 2018-04-03 9:53
 **/

import request from '@/utils/request'

/**
 *   保存
 *
 * @param jsonData  json数据包
 */
export function save(jsonData) {
  const data = [
    jsonData
  ]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.SaveDXDD,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 ** 提交接口
 * @param number  动销订单单号
 */
export function submitNew(number) {
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxSubmitInterface.SubmitNew,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: number
  })
}

/**
 * 报单门店接口
 * @param phoneNumber
 */
export function getBDMD(phoneNumber) {
  const data = [{
    'PhoneNumber': phoneNumber
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PinOrderInterface.GetReportMD,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 合作客户接口
 * @param orgid     组织id
 * @param search
 * @param pageIndex 页码
 * @param pageSize  每页条数
 */
export function getHZKH(search, orgid, pageIndex, pageSize) {
  const data = [{
    'search': search,
    'orgid': orgid,
    'PageIndex': pageIndex,
    'PageSize': pageSize
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.GetHZKH,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 活动类型接口
 * @param search
 * @param pageIndex 页码
 * @param pageSize  每页条数
 */
export function getHDLX(search, pageIndex, pageSize) {
  const data = [{
    'search': search,
    'PageIndex': pageIndex,
    'PageSize': pageSize
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.GetHDLX,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 顾客类型接口
 * @param search
 * @param pageIndex 页码
 * @param pageSize  每页条数
 */
export function getGKLX(search, pageIndex, pageSize) {
  const data = [{
    'PageIndex': pageIndex,
    'PageSize': pageSize,
    'search': search
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.GetGKLX,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 促销方案接口
 * @param strOrgNumber    组织number
 * @param strCustNumber   客户number
 * @param search    促销方案number或name
 */
export function getCXFA(search, strOrgNumber, strCustNumber) {
  const data = [{
    'search': search,
    'strOrgNumber': strOrgNumber,
    'strCustNumber': strCustNumber
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.GetCXFA,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 票据类型接口
 * @param search
 * @param pageIndex 页码
 * @param pageSize  每页条数
 */
export function getPJLX(search, pageIndex, pageSize) {
  const data = [{
    'search': search,
    'PageIndex': pageIndex,
    'PageSize': pageSize
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.GetPJLX,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 岗位折扣负责人接口
 * @param search
 * @param pageIndex 页码
 * @param pageSize  每页条数
 */
export function getZKFZR(search, pageIndex, pageSize) {
  const data = [{
    'search': search,
    'PageIndex': pageIndex,
    'PageSize': pageSize
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.GetZKFZR,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 *  通过四位码获取成品信息接口
 *  录入四位码、四位码变更时调用的接口
 * @param billType
 * @param FourCode
 * @param CustNumber
 * @param OrgNumber
 */
export function FourbitcodeForCp(billType, FourCode, CustNumber, OrgNumber) {
  const data = [{
    'billType': billType,
    'FourCode': FourCode,
    'CustNumber': CustNumber,
    'OrgNumber': OrgNumber
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.FourbitcodeForCp,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 *  通过四位码获取赠品品信息接口
 *  录入四位码、四位码变更时调用的接口
 * @param OrgId
 * @param FourCode   四位码
 */
export function FourbitcodeForZp(OrgId, FourCode) {
  const data = [{
    'OrgId': OrgId,
    'FourCode': FourCode
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.FourbitcodeForZp,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 物料赠品接口
 * @param forgnumber    组织number
 * @param fcustnumber   客户number
 * @param wlzpNumber    物料number
 * @param fcxnumber     促销方案number
 * @param FPBPBText4    以旧换新卡号
 */
export function iCSelectForWLZP(forgnumber, fcustnumber, wlzpNumber, fcxnumber, FPBPBText4) {
  const data = [{
    'forgnumber': forgnumber,
    'fcustnumber': fcustnumber,
    'wlzpNumber': wlzpNumber,
    'fcxnumber': fcxnumber,
    'F_PBPB_Text4': FPBPBText4
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.ICSelectForWLZP,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 成品物料查询接口
 * 获取赠品类型接口
 * @param orgid     组织id
 * @param search    物料编码或名称或者规格型号
 * @param pageIndex 页码
 * @param pageSize  每页条数
 */
export function chooseMaterialCp(custNumber, orgNumber, orgid, search, pageIndex, pageSize) {
  const data = [{
    'CustNumber': custNumber,
    'OrgNumber': orgNumber,
    'PageIndex': pageIndex,
    'PageSize': pageSize,
    'orgid': orgid,
    'search': search
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.ChooseMaterialCp,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 成品物料查询接口
 * 获取赠品类型接口
 * @param orgid     组织id
 * @param search    物料编码或名称或者规格型号
 * @param pageIndex 页码
 * @param pageSize  每页条数
 */
export function chooseMaterialZp(search, orgid, pageIndex, pageSize) {
  const data = [{
    'PageIndex': pageIndex,
    'PageSize': pageSize,
    'orgid': orgid,
    'search': search
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.ChooseMaterialZp,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 加赠标志接口
 * @param search
 */
export function getJZBZ(search) {
  const data = [{
    'search': search
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.GetJZBZ,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 赠品类型接口
 * @param search
 */
export function getZPLX(search) {
  const data = [{
    'search': search
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.GetZPLX,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 通过物料number查询计量单位接口
 * @param number    赠品类型编码
 * @param orgid     组织ID
 */
export function getJLDW(orgid, number) {
  const data = [{
    'orgid': orgid,
    'number': number
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxationFormInterface.GetJLDW,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 动销订单查询接口
 * @param merchid      //商家ID
 * @param search
 * @param PageIndex
 * @param PageSize
 */
export function getSimpleDXDDList(merchid, search, PageIndex, PageSize) {
  const data = [{
    'merchid': merchid,
    'search': search,
    'PageIndex': PageIndex,
    'PageSize': PageSize
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxOtherList.getSimpleDXDDList,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 动销订单提交前删除接口
 * @param number     //单据编码
 */
export function deleteDXDD(number) {
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxOtherList.deleteDXDD,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: number
  })
}

/**
 * 动销订单详情接口
 * @param fid     //单据编码
 */
export function getDXDDList(fid) {
  const data = [{
    'fid': fid
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxOtherList.getDXDDList,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 销售订单查询接口
 * @param merchid     //创建员工ID
 * @param search
 * @param PageIndex
 * @param PageSize
 */
export function getSimpleXSDDList(merchid, search, PageIndex, PageSize) {
  const data = [{
    'merchid': merchid,
    'search': search,
    'PageIndex': PageIndex,
    'PageSize': PageSize
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneAfterSubmit.getSimpleXSDDList,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 销售订单详情接口
 * @param fid     //单据编码
 */
export function getXSDDList(fid) {
  const data = [{
    'fid': fid
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneAfterSubmit.getXSDDList,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 销售订单提交接口
 * @param fid     //单据编码
 */
export function SubmitForPhoneTax(fid) {
  const data = [fid]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxOtherOperation.SubmitForPhoneTax,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 销售订单修改前调用验证接口
 * @param fid     //单据编码
 */
export function modifyVerifyXSDD(fid) {
  const data = [{
    'fid': fid
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneAfterSubmit.ModifyVerifyXSDD,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 *   保存手机变更单
 * @param jsonData  json数据包
 */
export function SaveSJBGD(jsonData) {
  const data = [
    jsonData
  ]
  return request({
    url: '/K3cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneAfterSubmit.SaveSJBGD,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 *  提交手机变更单
 * @param fid
 */
export function SubmitSJBGD(fid) {
  const data = [{
    'FID': fid
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneOrderChangeBill.Submit,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 赠品退货列表
 * @param jsonData  json数据包
 */
export function getPartDeleteList(jsonData) {
  const data = [
    jsonData
  ]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxOtherOperation.GetPartDeleteList,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 手机报单退货
 * @param jsonData
 */
export function ReturnForPhoneTax(jsonData) {
  const data = [
    jsonData
  ]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxOtherOperation.SaleReturn,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 手机报单分录退货
 * @param jsonData
 */
export function SalePartReturn(jsonData) {
  const data = [
    jsonData
  ]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneTaxOtherOperation.SalePartReturn,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 图片上传
 * @param strfile
 * @param fileName
 */
export function UploadImage(strfile, fileName) {
  const data = [
    strfile,
    fileName
  ]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.FileServerInterface.Upload,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 图片下载
 * @param FileID
 */
export function DownLoading(FileID) {
  const data = [
    FileID
  ]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.FileServerInterface.DownLoading,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * BBC保存接口
 * @jsonData
 */
export function SaveBBCORDER(jsonData) {
  const data = [
    jsonData
  ]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.SalOrderTOBBC.SaveBBCORDER,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 业务类型
 * @jsonData
 */
export function BusinessType(businessType) {
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.SalOrderTOBBC.BusinessType,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: [businessType]
  })
}

/**
 * 配送方式
 */
export function postWay() {
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.SalOrderTOBBC.postWay,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post'
  })
}

/**
 *支付方式
 * @payWay
 */
export function payWay(payWay) {
  const data = [{
    payWay
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.SalOrderTOBBC.payWay,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 收货地址
 * @fulladdrs
 */
export function GetFullAddress(PageIndex, PageSize, search) {
  const data = [{
    'PageIndex': PageIndex,
    'PageSize': PageSize,
    'search': search
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.SalOrderTOBBC.GetFullAddress,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}
/**
 * 删除安装类赠品时校验接口 张浩添加 2018-08-10
 * @EntryID
 */
export function GiftDeleteValid(EntryID) {
  const data = [{
    'FENTRYID': EntryID
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.SaleOrderInterface.GiftDeleteValid,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}
/**
 * 销售订单详情查看接口
 */
export function GetInfoOfSalOrder(fid) {
  const data = [{
    'FID': fid
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.SaleOrderInterface.GetInfoOfSalOrder,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}
export function ValidShopBillCount(jsonData) {
  const data = [
    jsonData
  ]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.SaleOrderInterface.ValidShopBillCount,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}
/**
 * 保存手机保单变更的接口 张浩 2018-08-23
 */
export function SaveSJBGDNew(jsonData) {
  const data = [
    jsonData
  ]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneOrderChangeBill.Add,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}
/**
 * 获取销售订单流程信息
 */
export function GetFlowInfo(fid) {
  const data = [{
    'FID': fid
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.SaleOrderInterface.GetFlowInfo,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}
