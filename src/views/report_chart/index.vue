<template>
  <div>
    <x-header :left-options="{preventGoBack: true, showBack: true}" @on-click-back="back">
      报表统计
    </x-header>
    <div class="container">
      <div class="nav_menu">
        <flexbox wrap="wrap" :gutter="0">
          <flexbox-item class='flexItem' :span='3' align="center">
            <div class="img_box" style="background-color: #89c47d" @click="goSystem({ path: '/report_chart/unpostlist',query:{ t: 0 } })">
              <img slot="icon" src="../../assets/icons/report.svg">
            </div>
            <span>未传递单据统计</span>
          </flexbox-item>
          <flexbox-item class='flexItem' :span='3' align="center">
            <div class="img_box" style="background-color: #16a085" @click="goSystem({ path: '/collection/workOrder', query:{ t: 4 } })">
              <img slot="icon" src="../../assets/icons/search.svg">
            </div>
            <span>服务收款</span>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
  </div>
</template>

<script>
  import { XHeader, Swiper, SwiperItem, Grid, GridItem, Flexbox, FlexboxItem, Group, PopupPicker, Actionsheet, TransferDom } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Swiper,
      SwiperItem,
      Grid,
      GridItem,
      Flexbox,
      FlexboxItem,
      Group,
      PopupPicker,
      Actionsheet,
      TransferDom
    },
    data() {
      return {
      }
    },
    mounted() {
    },
    methods: {
      goSystem(path) {
        this.$router.push(path)
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
</style>
