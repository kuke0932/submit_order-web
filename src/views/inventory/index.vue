<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">库存查询</x-header>
      <div class="container">
        <search
          :results="results"
          v-model="value"
          placeholder="请输入规格型号"
          position="absolute"
          auto-scroll-to-top top="46px"
          @on-focus="onFocus"
          @on-cancel="onCancel"
          @on-submit="onSubmit"
          ref="search"></search>
        <group title="查询结果">
          <div class="item_info">
            <p><span>规格型号：</span>EWH-6B2</p>
            <p><span>地区：</span>公司</p>
            <p><span>库存数量：</span>1352</p>
          </div>
          <div class="item_info">
            <p><span>规格型号：</span>EWH-6B2</p>
            <p><span>地区：</span>公司</p>
            <p><span>库存数量：</span>1352</p>
          </div>
          <div class="item_info">
            <p><span>规格型号：</span>EWH-6B2</p>
            <p><span>地区：</span>公司</p>
            <p><span>库存数量：</span>1352</p>
          </div>
          <div class="item_info">
            <p><span>规格型号：</span>EWH-6B2</p>
            <p><span>地区：</span>公司</p>
            <p><span>库存数量：</span>1352</p>
          </div>
        </group>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader, Search, Group } from 'vux'
  export default {
    components: {
      XHeader,
      Search,
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

<style lang="less" scoped>
  .item_info {
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
