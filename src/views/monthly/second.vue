<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">月报二级查询</x-header>
      <div class="container">
        <group title="固定信息">
          <div class="total_info">
            <p><span>物料名称：</span>电热水器</p>
            <p><span>规则型号：</span>CEWH-60P10C+</p>
            <p><span>总台数：</span>3</p>
            <p><span>总金额：</span>&yen;4500.00</p>
          </div>
        </group>
        <group title="明细信息">
          <router-link to="/monthly/third">
            <div class="item_info">
              <p><span>日期</span>2018-01-01</p>
              <p><span>总台数：</span>1</p>
              <p><span>总金额：</span>&yen;1500.00</p>
            </div>
          </router-link>
          <router-link to="/monthly/third">
            <div class="item_info">
              <p><span>日期</span>2018-01-05</p>
              <p><span>总台数：</span>2</p>
              <p><span>总金额：</span>&yen;3000.00</p>
            </div>
          </router-link>
        </group>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader, XButton, Group } from 'vux'
  export default {
    components: {
      XHeader,
      XButton,
      ViewBox,
      Group
    },
    data() {
      return {
        results: [],
        value: ''
      }
    },
    methods: {
      onSubmit() {
        this.$refs.search.setBlur()
      },
      onFocus() {
        console.log('on focus')
      },
      onCancel() {
        console.log('on cancel')
      }
    }
  }
</script>
<style scoped lang="less">
  .item_info, .total_info {
    padding:10px 20px;
    color:#666;
    p{
      font-size: 16px;
      span{
        display: inline-block;
        width:6em;
      }
    }
  }
  .item_info{
    border-bottom: 1px solid #ccc
  }
</style>
