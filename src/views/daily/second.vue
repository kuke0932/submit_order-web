<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">日报二级查询</x-header>
      <div class="container">
        <group title="固定信息">
          <div class="total_info">
            <p><span>物料名称：</span>电热水器</p>
            <p><span>规则型号：</span>CEWH-60P10C+</p>
            <p><span>总台数：</span>1</p>
            <p><span>总金额：</span>&yen;3000.00</p>
          </div>
        </group>
        <group title="明细信息">
          <div class="item_info">
            <p><span>张三</span>13931897413</p>
            <p><span>总台数：</span>1</p>
            <p><span>总金额：</span>&yen;1500.00</p>
          </div>
          <div class="item_info">
            <p><span>张三</span>13931897413</p>
            <p><span>总台数：</span>1</p>
            <p><span>总金额：</span>&yen;1500.00</p>
          </div>
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
