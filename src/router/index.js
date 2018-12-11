import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login/index.vue'
import ChangePwd from '@/views/login/changePwd.vue'
import SelectStore from '@/views/login/selectStore.vue'
import Dashboard from '@/views/dashboard/index.vue'

import Customer from '@/views/customer/index.vue'
import AddCustomer from '@/views/customer/add.vue'
import EditCustomer from '@/views/customer/edit.vue'

import Submit from '@/views/submit/index.vue'
import SellBill from '@/views/submit/sellBill.vue'
import GoBBC from '@/views/submit/goBBC.vue'
import AddSubmit from '@/views/submit/add.vue'
import AddSecond from '@/views/submit/addSecond.vue'
import DetailsSubmit from '@/views/submit/details.vue'
import SelectSubmit from '@/views/submit/select.vue'
import SubmitCollection from '@/views/submit/collection.vue'
import CollectionList from '@/views/submit/collectionList.vue'

import Collection from '@/views/collection/index.vue'
import Qrcode from '@/views/collection/qrcode.vue'
import WorkOrder from '@/views/collection/workOrder.vue'
import CollectionDetail from '@/views/collection/collectionDetail.vue'
import CollectionBill from '@/views/collection/collectionBill.vue'

import Daily from '@/views/daily/index.vue'
import DailySecond from '@/views/daily/second.vue'
import Monthly from '@/views/monthly/index.vue'
import MonthlySecond from '@/views/monthly/second.vue'
import MonthlyThird from '@/views/monthly/third.vue'
import SellCount from '@/views/sellCount/index.vue'
import SellCountEdit from '@/views/sellCount/edit.vue'
import SellCountDel from '@/views/sellCount/delete.vue'
import SellCountEditDetail from '@/views/sellCount/editDetail.vue'
import SellCountDelDetail from '@/views/sellCount/delDetail.vue'
import Inventory from '@/views/inventory/index.vue'

import BorrowMaterial from '@/views/borrow_material/index.vue'
import BorrowRecord from '@/views/borrow_material/record.vue'
import BorrowSelect from '@/views/borrow_material/select.vue'
import BorrowDetails from '@/views/borrow_material/details.vue'

import UnReturn from '@/views/return_material/index.vue'
import IsReturn from '@/views/return_material/isReturn.vue'
import ReturnDetails from '@/views/return_material/details.vue'
import ConfirmReturn from '@/views/return_material/confirmReturn.vue'

import UnVerificateList from '@/views/verification_sheet/index.vue'
import SheetList from '@/views/verification_sheet/list.vue'
import SheetDetail from '@/views/verification_sheet/detail.vue'
import SheetConfirm from '@/views/verification_sheet/confirm.vue'

import InventoryKeeperDetails from '@/views/inventoryKeeper/inventoryKeeperDetails'
import InventoryKeeperRecord from '@/views/inventoryKeeper/inventoryKeeperRecord'

import Position from '@/views/position/index.vue'
import PositionDetails from '@/views/position/details.vue'
import DetailInfo from '@/views/submit/detailInfo.vue'

// 引入报表组件
import ReportIndex from '@/views/report_chart/index.vue'
import UnPostList from '@/views/report_chart/unpostlist.vue'

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: 'dashboard'
  },
  {
    path: '/403',
    component: require('@/views/errorPage/403.vue').default
  },
  { path: '/404',
    component: require('@/views/errorPage/404.vue').default
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/login/changePwd',
    name: 'changePwd',
    component: ChangePwd
  },
  {
    path: '/login/selectStore',
    name: 'selectStore',
    component: SelectStore
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard
  },
  {
    path: '/customer',
    name: 'customer',
    component: Customer,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/customer/add',
    name: 'addCustomer',
    component: AddCustomer
  },
  {
    path: '/customer/edit',
    name: 'editCustomer',
    component: EditCustomer
  },
  {
    path: '/submit',
    name: 'submit',
    component: Submit,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/submit/sellBill',
    name: 'sellBill',
    component: SellBill,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/submit/goBBC',
    name: 'goBBC',
    component: GoBBC,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/submit/add',
    name: 'addSubmit',
    component: AddSubmit,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/submit/addSecond',
    name: 'addSecond',
    component: AddSecond,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/submit/details',
    name: 'detailsSubmit',
    component: DetailsSubmit,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/submit/select',
    name: 'selectSubmit',
    component: SelectSubmit
  },
  {
    path: '/submit/collection',
    name: 'submitCollection',
    component: SubmitCollection,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/submit/collectionList',
    name: 'collectionList',
    component: CollectionList,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/position',
    name: 'position',
    component: Position,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/position/details',
    name: 'positionDetails',
    component: PositionDetails,
    meta: {
      showTabbar: true
    }
  },
  {
    path: '/borrow_material',
    name: 'borrow_material',
    component: BorrowMaterial,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/borrow_material/record',
    name: 'borrowRecord',
    component: BorrowRecord,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/borrow_material/select',
    name: 'select',
    component: BorrowSelect
  },
  {
    path: '/borrow_material/details',
    name: 'borrowDetails',
    component: BorrowDetails
  },
  {
    path: '/return_material',
    name: 'unReturn',
    component: UnReturn,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/return_material/isReturn',
    name: 'isReturn',
    component: IsReturn,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/return_material/confirmReturn',
    name: 'confirmReturn',
    component: ConfirmReturn
  },
  {
    path: '/return_material/details',
    name: 'returnDetails',
    component: ReturnDetails,
    meta: {
      showTabbar: true
    }
  },

  {
    path: '/verification_sheet',
    name: 'unSheetList',
    component: UnVerificateList,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/verification_sheet/list',
    name: 'sheetList',
    component: SheetList,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/verification_sheet/confirm',
    name: 'sheetConfirm',
    component: SheetConfirm
  },
  {
    path: '/verification_sheet/detail',
    name: 'sheetDetail',
    component: SheetDetail,
    meta: {
      showTabbar: true
    }
  },
  {
    path: '/inventoryKeeper/inventoryKeeperDetails',
    name: 'inventoryKeeperDetails',
    component: InventoryKeeperDetails,
    meta: {
      showTabbar: true
    }
  },
  {
    path: '/inventoryKeeper/inventoryKeeperRecord',
    name: 'inventoryKeeperRecord',
    component: InventoryKeeperRecord,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/collection',
    name: 'collection',
    component: Collection,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/collection/workOrder',
    name: 'workOrder',
    component: WorkOrder,
    meta: {
      showTabbar: true
    }
  },
  {
    path: '/collection/qrcode',
    name: 'qrcode',
    component: Qrcode
  },
  {
    path: '/collection/collectionDetail',
    name: 'collectionDetail',
    component: CollectionDetail,
    meta: {
      showTabbar: true
    }
  },
  {
    path: '/collection/collectionBill',
    name: 'collectionBill',
    component: CollectionBill,
    meta: {
      keepAlive: true,
      showTabbar: true
    }
  },
  {
    path: '/daily',
    name: 'daily',
    component: Daily
  },
  {
    path: '/daily/second',
    name: 'dailySecond',
    component: DailySecond
  },
  {
    path: '/monthly',
    name: 'monthly',
    component: Monthly
  },
  {
    path: '/monthly/second',
    name: 'monthlySecond',
    component: MonthlySecond
  },
  {
    path: '/monthly/third',
    name: 'monthlyThird',
    component: MonthlyThird
  },
  {
    path: '/sellCount',
    name: 'sellCount',
    component: SellCount
  },
  {
    path: '/sellCount/edit',
    name: 'sellCountEdit',
    component: SellCountEdit
  },
  {
    path: '/sellCount/delete',
    name: 'sellCountDel',
    component: SellCountDel
  },
  {
    path: '/sellCount/editDetail',
    name: 'sellCountEditDetail',
    component: SellCountEditDetail
  },
  {
    path: '/sellCount/delDetail',
    name: 'sellCountDelDetail',
    component: SellCountDelDetail
  },
  {
    path: '/sellCount/Inventory',
    name: 'inventory',
    component: Inventory
  },
  {
    path: '*',
    component: require('@/views/errorPage/404.vue').default
  },
  {
    path: '/submit/detailInfo',
    name: 'detailInfo',
    component: DetailInfo
  },
  {
    path: '/report_chart/index',
    name: 'reportIndex',
    component: ReportIndex
  },
  {
    path: '/report_chart/unpostlist',
    name: 'unpostlist',
    component: UnPostList
  }
]

export default new Router({
  mode: 'history',
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  }
})
