import request from '@/utils/request'

export function getRB(BeginDate, EndDate, CustNumber) {
  const data = [{
    BeginDate: BeginDate,
    EndDate: EndDate,
    CustNumber: CustNumber
  }]
  return request({
    url: '/K3Cloud/Joy.NHBusiness.ServicePlugIn.PhoneWebApi.PhoneRB.GetRB,Joy.NHBusiness.ServicePlugIn.common.kdsvc',
    method: 'post',
    data: data
  })
}
