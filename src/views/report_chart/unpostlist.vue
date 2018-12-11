<template>
  <div>
    <x-header :left-options="{preventGoBack: true, showBack: true}" @on-click-back="back">
      未传递到MOA单据
    </x-header>
    <div class="container">
      <div class="head_tab">
        <button-tab>
        <button-tab-item @on-item-click="itemClick(1)" selected>概况</button-tab-item>
        <button-tab-item selected @on-item-click="itemClick(2)">详情</button-tab-item>
        <button-tab-item @on-item-click="itemClick(3)">分析</button-tab-item>
      </button-tab>
      </div>
      <div class="content_gk" v-if="gk">
        概况
      </div>
      <div class="content_xq" v-if="xq">
        详情
      </div>
      <div class="content_fx" v-if="fx">
        分析
      </div>
    </div>
  </div>
</template>

<script>
  import { ButtonTab, ButtonTabItem, XHeader, Group } from 'vux'
  export default {
    components: {
      ButtonTab,
      ButtonTabItem,
      XHeader,
      Group
    },
    data() {
      return {
        'gk': false,
        'xq': false,
        'fx': false
      }
    },
    mounted() {
    },
    methods: {
      goSystem(path) {
        this.$router.push(path)
      },
      itemClick(index) {
        if (index === 1) {
          this.gk = true
          this.xq = false
          this.fx = false
        } else if (index === 2) {
          this.gk = false
          this.xq = true
          this.fx = false
        } else if (index === 3) {
          this.gk = false
          this.xq = false
          this.fx = true
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .nav_menu{
    padding:70px 10px 10px 10px;
    background-color: #fff;
    .flexItem{
      margin-bottom: 10px;
    }
    span{
      font-size: 12px;
      display: block;
    }
    .img_box{
      width:3.4em;
      height:3.4em;
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      border-radius: 50%;
      img{
        width:2em;
        height:2em;
      }
    }
  }
  .swiper-demo-img img {
    width: 100%;
  }
  .head_tab {
    padding:15px;
  }
</style>
