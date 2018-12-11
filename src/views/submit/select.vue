<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <!--<x-header v-if="pageType == 'GKLX'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">顾客类型</x-header>-->
      <x-header v-if="pageType == 'BDMD'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">报单门店</x-header>
      <x-header v-if="pageType == 'CXFA'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">促销方案</x-header>
      <x-header v-if="pageType == 'HDLX'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">活动类型</x-header>
      <x-header v-if="pageType == 'HZKH'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">合作客户</x-header>
      <x-header v-if="pageType == 'WLCP'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">选择成品</x-header>
      <x-header v-if="pageType == 'WLZP'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">选择赠品</x-header>
      <!--<x-header v-if="pageType == 'ZPLX'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">赠品类型</x-header>-->
      <x-header v-if="pageType == 'YWLX'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">业务类型</x-header>
      <x-header v-if="pageType == 'PSFS'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">配送方式</x-header>
      <x-header v-if="pageType == 'ZFFS'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">支付方式</x-header>
      <x-header v-if="pageType == 'SHDZ'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">收货地址</x-header>
      <!--<x-header v-if="pageType == 'JZBZ'" :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">加赠标志</x-header>-->
      <div class="container"  :style="'height:' + (screenHeight - 90) + 'px'">
        <!--<search v-if="pageType == 'GKLX'"  @on-submit="search" v-model="searchContent" placeholder="请输入顾客类型"   auto-scroll-to-top top="46px" ref="search"></search>-->
        <search v-if="pageType == 'BDMD'"  @on-submit="search" v-model="searchContent" placeholder="请输入手机号码"   auto-scroll-to-top top="46px" ref="search"></search>
        <search v-if="pageType == 'CXFA'"  @on-submit="search" v-model="searchContent" placeholder="请输入促销方案"   auto-scroll-to-top top="46px" ref="search"></search>
        <search v-if="pageType == 'HDLX'"  @on-submit="search" v-model="searchContent" placeholder="请输入活动类型"   auto-scroll-to-top top="46px" ref="search"></search>
        <search v-if="pageType == 'HZKH'"  @on-submit="search" v-model="searchContent" placeholder="请输入合作客户"   auto-scroll-to-top top="46px" ref="search"></search>
        <search v-if="pageType == 'WLCP'"  @on-submit="search" v-model="searchContent" placeholder="请输入成品名称"   auto-scroll-to-top top="46px" ref="search"></search>
        <search v-if="pageType == 'WLZP'"  @on-submit="search" v-model="searchContent" placeholder="请输入赠品名称"   auto-scroll-to-top top="46px" ref="search"></search>
        <search v-if="pageType == 'YWLX'"  @on-submit="search" v-model="searchContent" placeholder="请输入业务类型"   auto-scroll-to-top top="46px" ref="search"></search>
        <search v-if="pageType == 'PSFS'"  placeholder="请输入配送方式"   auto-scroll-to-top top="46px" ref="search"></search>
        <search v-if="pageType == 'ZFFS'"  placeholder="请输入支付方式"   auto-scroll-to-top top="46px" ref="search"></search>
        <search v-if="pageType == 'SHDZ'"  @on-submit="search" v-model="searchContent" placeholder="请输入收货地址"   auto-scroll-to-top top="46px" ref="search"></search>
        <!--<search v-if="pageType == 'ZPLX'"  @on-submit="search" v-model="searchContent" placeholder="请输入赠品类型"   auto-scroll-to-top top="46px" ref="search"></search>-->
        <!--<search v-if="pageType == 'JZBZ'"  @on-submit="search" v-model="searchContent" placeholder="请输入加赠标志"   auto-scroll-to-top top="46px" ref="search"></search>-->
        <scroller ref="scroller" height="-90" lock-x style="position: fixed;top:90px;width:100%;"
                  use-pulldown :pulldown-config=pulldownConfig @on-pulldown-loading="pullDown(true)"
                  use-pullup :pullup-config=pullupConfig @on-pullup-loading="pullUp(true)" :scroll-bottom-offset="200">
          <div class="submit_list">
            <div class="submit_item" @click="itemClick($event, index)" v-for="(item, index) in dataList" v-bind:key="index">
              <flexbox>
                <flexbox-item :span="3" v-if="pageType == 'WLCP'">{{item.FNUMBER}}</flexbox-item>
                <flexbox-item :span="3" v-if="pageType == 'WLZP'">{{item.FNUMBER}}</flexbox-item>
                <flexbox-item>{{item.FNAME}}</flexbox-item>
                <flexbox-item :span="4" v-if="pageType == 'WLCP'">{{item.FSPECIFICATION}}</flexbox-item>
                <flexbox-item :span="4" v-if="pageType == 'WLZP'">{{item.FSPECIFICATION}}</flexbox-item>
              </flexbox>
              <flexbox v-if="pageType == 'SHDZ'">
                <flexbox-item class="addrItem">{{item.FullAddress}}</flexbox-item>
              </flexbox>
            </div>
          </div>
        </scroller>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { getBDMD, getHDLX, getHZKH, getCXFA, chooseMaterialCp, chooseMaterialZp, BusinessType, postWay, payWay, GetFullAddress } from '@/api/submit_order'
  import { ViewBox, XHeader, XButton, Search, Flexbox, FlexboxItem, Scroller } from 'vux'
  export default {
    components: {
      XHeader,
      XButton,
      Search,
      Flexbox,
      FlexboxItem,
      ViewBox,
      Scroller
    },
    data() {
      return {
        screenHeight: document.documentElement.clientHeight,
        orgID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || '',
        orgNumber: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGNUMBER) || '',
        custNumber: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].CUSTNUMBER) || '',
        pageIndex: 1,
        pageSize: 20,
        pageType: '',
        dataList: [],
        searchContent: '',
        phoneNumber: '',
        pulldownConfig: {
          content: '下拉刷新',
          downContent: '下拉刷新',
          upContent: '释放开始刷新',
          pullDownHeight: 60,
          height: 40,
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        pullupConfig: {
          content: '请上拉刷新数据',
          pullUpHeight: 200,
          height: 40,
          downContent: '释放刷新数据',
          upContent: '暂无更多数据',
          loadingContent: '加载中...',
          clsPrefix: 'xs-plugin-pullup-'
        },
        pulldown: false,   // 是否处于下拉状态
        pullup: false   // 是否处于上拉状态
      }
    },
    mounted() {
      this.phoneNumber = JSON.parse(window.sessionStorage.getItem('login')).mobile
      this.pageType = this.$route.query.type
      this.fetchData()
    },
    methods: {
      fetchData() {
        let that = this
        let promise
        if (that.pageType === 'BDMD') {
          promise = getBDMD(that.phoneNumber)
        }
        if (that.pageType === 'HDLX') {
          promise = getHDLX(that.searchContent, that.pageIndex, that.pageSize)
        }
        if (that.pageType === 'CXFA') {
          promise = getCXFA(that.searchContent, that.orgNumber, that.custNumber)
        }
        if (that.pageType === 'HZKH') {
          promise = getHZKH(that.searchContent, that.orgID, that.pageIndex, that.pageSize)
        }
        if (that.pageType === 'WLCP') {
          promise = chooseMaterialCp(that.custNumber, that.orgNumber, that.orgID, that.searchContent, that.pageIndex, that.pageSize)
        }
        if (that.pageType === 'WLZP') {
          promise = chooseMaterialZp(that.searchContent, that.orgID, that.pageIndex, that.pageSize)
        }
        if (that.pageType === 'YWLX') {
          promise = BusinessType(that.searchContent)
        }
        if (that.pageType === 'PSFS') {
          promise = postWay()
        }
        if (that.pageType === 'ZFFS') {
          promise = payWay()
        }
        if (that.pageType === 'SHDZ') {
          promise = GetFullAddress(that.pageIndex, that.pageSize, that.searchContent)
        }
        return promise.then(resp => {
          that.dataList = that.dataList.concat(resp)
          if (resp.length < that.pageSize) {
            if (that.pullup) {
              that.$refs.scroller.disablePullup()
            }
          }
          if (that.pulldown) {
            that.$refs.scroller.donePulldown()
          }
          if (that.pullup) {
            that.$refs.scroller.donePullup()
          }
        })
      },
      search() {
        this.dataList = []
        this.pageIndex = 1
        this.$refs.search.setBlur()
        this.fetchData()
      },
      itemClick(e, index) {
        let submitDetails = this.$store.getters.submitDetails || {}
        for (let i = 0; i < this.dataList.length; i++) {
          if (index === i) {
            submitDetails[this.pageType] = this.dataList[i]
            this.$store.dispatch('setSubmitDetails', submitDetails)
            /* if (this.pageType === 'WLZP' || this.pageType === 'ZPLX' || this.pageType === 'JZBZ') {
              this.$router.replace({path: './addSecond', query: {}})
            } else {
              this.$router.replace({path: './add', query: {}})
            } */
            history.go(-1)
          }
        }
      },
      // 下拉刷新
      pullDown(pulldown) {
        this.dataList = []
        this.pageIndex = 1
        this.pageSize = 20
        this.$refs.scroller.enablePullup()
        this.pulldown = !!pulldown
        this.fetchData()
      },
      // 上拉加载
      pullUp(pullup) {
        this.pageIndex++
        this.pullup = !!pullup
        this.fetchData()
      }
    }
  }
</script>

<style lang="less" scoped>
  .submit_list{
    .submit_item{
      background-color: #fff;
      padding:10px;
      color: #333;
      .addrItem{
        height:50px;
      }
    }
    .submit_item:nth-child(odd){
      background: #b7cddf;
    }
  }
</style>
