<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">动销</x-header>
      <div class="container">
        <grid class="chose">
          <grid-item link="/sellCount/edit" label="动销修改" class="item">
            <img slot="icon" src="../../assets/icons/edit.svg">
            <span slot="label">动销修改</span>
          </grid-item>
          <grid-item link="/sellCount/delete" label="动销删除" class="item">
            <img slot="icon" src="../../assets/icons/del.svg">
            <span slot="label">动销删除</span>
          </grid-item>
        </grid>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader, XButton, Grid, GridItem } from 'vux'
  export default {
    components: {
      XHeader,
      XButton,
      ViewBox,
      Grid,
      GridItem
    },
    data() {
      return {
      }
    },
    methods: {
    }
  }
</script>
<style scoped lang="less">
  .container{
    margin: 200px 10px;
    .chose{
      background-color: #fff;
    }
  }
</style>
