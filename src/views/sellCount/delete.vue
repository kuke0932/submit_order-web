<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">动销删除</x-header>
      <div class="container">
        <group class="group">
          <calendar v-model="currentDate" title="日期" placeholder="请点击选择日期" popup-header-title="请选择" disable-future></calendar>
          <x-input title="手机号" placeholder="请输入手机号" :max="11" ></x-input>
          <x-input title="顾客姓名" placeholder="请输入顾客姓名"></x-input>
        </group>
        <div style="margin: 10px 20px;text-align: right">
          <x-button mini type="primary">查询</x-button>
        </div>
        <group title="查询结果">
          <router-link to="/sellCount/delDetail">
            <div class="item_info">
              <p><span>张三</span>13954853215</p>
              <p><span>审批时间：</span>2018-01-02 18:34:28</p>
              <p><span>申请时间：</span>2018-01-01 18:34:28</p>
              <p style="text-align: center">审核通过</p>
            </div>
          </router-link>
          <router-link to="/sellCount/delDetail">
            <div class="item_info">
              <p><span>张三</span>13954853215</p>
              <p><span>审批时间：</span>2018-01-02 18:34:28</p>
              <p><span>申请时间：</span>2018-01-01 18:34:28</p>
              <p style="text-align: center">审核通过</p>
            </div>
          </router-link>
        </group>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader, XButton, Search, Group, Calendar, XInput } from 'vux'
  export default {
    components: {
      XHeader,
      XButton,
      Search,
      ViewBox,
      Group,
      Calendar,
      XInput
    },
    data() {
      return {
        currentDate: ''
      }
    },
    methods: {
    }
  }
</script>
<style scoped lang="less">
  .item_info{
    padding:10px 20px;
    color:#666;
    border-bottom: 1px solid #ccc;
    p{
      font-size: 16px;
      span{
        display: inline-block;
        width:6em;
      }
    }
  }
</style>
