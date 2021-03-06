const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  status: state => state.user.status,
  roles: state => state.user.roles,
  organizations: state => state.user.organizations,
  // shops: state => state.user.shops,
  // apps: state => state.user.apps,
  userID: state => state.user.userID,
  employees: state => state.user.employees,
  // dept: state => state.user.dept,
  organizationsAndAppModel: state => state.user.organizationsAndAppModel,
  deptMercCustModel: state => state.user.deptMercCustModel,
  deptMercCustModelIndex: state => state.user.deptMercCustModelIndex,
  mrStock: state => state.user.mrStock,
  grStock: state => state.user.grStock,
  setting: state => state.user.setting,
  billType: state => state.user.billType,
  checkedMaterial: state => state.material.checkedMaterial,
  submitDetails: state => state.submit.submitDetails,
  goodsList: state => state.goodsList.goodsList
}
export default getters
