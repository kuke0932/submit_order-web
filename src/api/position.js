/**
 *
 * @author Dragon
 * @create 2018-03-02 11:02
 **/
import request from '@/utils/request'

/**
 * 物料查询接口
 * @param PageIndex  页码
 * @param PageSize  每页条数
 * @param orgid  物料组织
 * @param search  //搜索内容 编码/名称/规格型号
 */
export function getMaterial(orgid, search, PageIndex, PageSize) {
  const data = [{
    'orgid': orgid,
    'search': search,
    'PageIndex': PageIndex,
    'PageSize': PageSize
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.materialPositionInterface.ChooseMaterial,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}

/**
 * 物料位置查询接口
 * @param EmpID  物料组织
 * @param MaterialNumber  //搜索内容 编码/名称/规格型号
 */
export function getPosition(EmpID, MaterialNumber) {
  const data = [{
    EmpID,
    MaterialNumber
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.materialPositionInterface.GetMaterialPosition,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}
