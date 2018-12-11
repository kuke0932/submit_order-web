<template>
  <div>
    <tabbar v-if="tabbarType == 0">
      <tabbar-item link="/dashboard">
        <img slot="icon" src="../assets/icons/dashboard.svg">
        <span slot="label">门户</span>
      </tabbar-item>
      <tabbar-item link="/customer?t=0" selected>
        <img slot="icon" src="../assets/icons/customer.svg">
        <span slot="label">顾客</span>
      </tabbar-item>
      <tabbar-item link="/submit?t=0">
        <img slot="icon" src="../assets/icons/menu.svg">
        <span slot="label">动销订单</span>
      </tabbar-item>
      <tabbar-item link="/submit/sellBill?t=0">
        <img slot="icon" src="../assets/icons/record.svg">
        <span slot="label">销售订单</span>
      </tabbar-item>
      <tabbar-item link="/submit/collectionList?t=0">
        <img slot="icon" src="../assets/icons/money.svg">
        <span slot="label">收款</span>
      </tabbar-item>
    </tabbar>
    <tabbar v-if="tabbarType == 1">
      <tabbar-item link="/dashboard">
        <img slot="icon" src="../assets/icons/dashboard.svg">
        <span slot="label">门户</span>
      </tabbar-item>
      <tabbar-item link="/borrow_material/select?t=1">
        <img slot="icon" src="../assets/icons/menu.svg">
        <span slot="label">借料</span>
      </tabbar-item>
      <tabbar-item link="/borrow_material/record?t=1" selected>
        <img slot="icon" src="../assets/icons/record.svg">
        <span slot="label">借料记录</span>
      </tabbar-item>
    </tabbar>
    <tabbar v-if="tabbarType == 2">
      <tabbar-item link="/dashboard">
        <img slot="icon" src="../assets/icons/dashboard.svg">
        <span slot="label">门户</span>
      </tabbar-item>
      <tabbar-item link="/inventoryKeeper/inventoryKeeperRecord?t=2" selected>
        <img slot="icon" src="../assets/icons/record.svg">
        <span slot="label">记录</span>
      </tabbar-item>
    </tabbar>
    <tabbar v-if="tabbarType == 3">
      <tabbar-item link="/dashboard">
        <img slot="icon" src="../assets/icons/dashboard.svg">
        <span slot="label">门户</span>
      </tabbar-item>
      <tabbar-item link="/return_material?t=3" selected>
        <img slot="icon" src="../assets/icons/menu.svg">
        <span slot="label">未还料</span>
      </tabbar-item>
      <tabbar-item link="/return_material/isReturn?t=3" >
        <img slot="icon" src="../assets/icons/record.svg">
        <span slot="label">已还料</span>
      </tabbar-item>
    </tabbar>
    <tabbar v-if="tabbarType == 4">
      <tabbar-item link="/dashboard">
        <img slot="icon" src="../assets/icons/dashboard.svg">
        <span slot="label">门户</span>
      </tabbar-item>
      <tabbar-item link="/collection?t=4">
        <img slot="icon" src="../assets/icons/money.svg" selected>
        <span slot="label">收款单</span>
      </tabbar-item>
      <tabbar-item link="/collection/workOrder?t=4">
        <img slot="icon" src="../assets/icons/menu.svg">
        <span slot="label">派工单</span>
      </tabbar-item>
    </tabbar>
    <tabbar v-if="tabbarType == 5">
      <tabbar-item link="/dashboard">
        <img slot="icon" src="../assets/icons/dashboard.svg">
        <span slot="label">门户</span>
      </tabbar-item>
      <tabbar-item link="/verification_sheet?t=5">
        <img slot="icon" src="../assets/icons/money.svg" selected>
        <span slot="label">未使用</span>
      </tabbar-item>
      <tabbar-item link="/verification_sheet/list?t=5">
        <img slot="icon" src="../assets/icons/menu.svg">
        <span slot="label">已使用</span>
      </tabbar-item>
    </tabbar>
    <tabbar v-if="tabbarType == 6">
      <tabbar-item link="/dashboard">
        <img slot="icon" src="../assets/icons/dashboard.svg">
        <span slot="label">门户</span>
      </tabbar-item>
      <tabbar-item link="/position?t=6" selected>
        <img slot="icon" src="../assets/icons/record.svg">
        <span slot="label">物料位置单</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import { Tabbar, TabbarItem } from 'vux'
  export default {
    components: {
      Tabbar,
      TabbarItem
    },
    data() {
      return {
        tabbarType: 0
      }
    },
    created() {
      this.tabbarType = this.$route.query.t
    },
    mounted: function() {
    },
    methods: {
    }
  }
</script>

<style>
</style>
