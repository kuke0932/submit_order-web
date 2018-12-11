<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">收款二维码
      </x-header>
    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader } from 'vux'
  export default {
    components: {
      XHeader,
      ViewBox
    },
    data() {
      return {
        fid: ''
      }
    },
    mounted() {
      this.fid = this.$route.query.fid
      this.fetchData()
    },
    methods: {
      fetchdata() {

      }
    }
  }
</script>

<style lang="less" scoped>
  .container{
    text-align: center;
    margin-top: 100px;
    .code_img{
      img{
        width:200px;
      }
    }
  }
</style>
