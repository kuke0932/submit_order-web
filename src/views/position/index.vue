<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header" >位置单
      </x-header>
      <div class="container">
        <search
          v-model="searchContent"
          placeholder="请输入编码/名称"
          position="fixed"
          @on-submit="onSubmit"
          ref="search"
          style="position:fixed;z-index: 10; top: 46px"></search>
        <div :style="'margin-top: 90px; width: 100%;height:' + viewHeight + 'px;'">
          <scroller ref="scroller" style="position: relative;" :on-refresh="refresh" :on-infinite="infinite" >
            <div class="customer_list">
              <div class="customer_item" v-for="(item, index) in materialList" @click="goDetails(item, index)">
                <span style="margin-right: 30px;">{{item.FNUMBER}}</span>
                <span>{{item.FNAME}}({{item.FSPECIFICATION}})</span>
              </div>
            </div>
          </scroller>
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import { ViewBox, XHeader, XButton, Search, Flexbox, FlexboxItem } from 'vux'
  import Tabbar from '@/components/tabbar'
  import { getMaterial } from '@/api/position'
  import Vue from 'vue'
  import VueScroller from 'vue-scroller'
  Vue.use(VueScroller)
  export default {
    components: {
      XHeader,
      XButton,
      Search,
      Tabbar,
      Flexbox,
      FlexboxItem,
      ViewBox
    },
    data() {
      return {
        viewHeight: document.documentElement.clientHeight - 143,
        materialList: [],
        pageIndex: 1,
        pageSize: 10,
        searchContent: ''
      }
    },
    activated(done) {
      this.refresh(done)
    },
    methods: {
      refresh(done) {
        this.pageIndex = 1
        this.pageSize = 10
        this.materialList = []
        const scroller = this.$refs.scroller
        if (this.$refs.scroller.loadingState === 2) {
          scroller.loadingState = 0
          done && done(false)
        } else {
          done && done(false)
        }
      },
      infinite(done) {
        this.infiniteHandler(done)
      },
      infiniteHandler($state) {
        this.fetchData(this.pageIndex, this.pageSize, this.searchContent).then(resp => {
          this.materialList = this.materialList.concat(resp)
          if (resp.length < this.pageSize) {
            $state && $state(true)
          } else {
            $state && $state()
          }
          this.pageIndex++
        }).catch((e) => {
          $state && $state(true)
        })
      },
      fetchData(orgid, search, pageIndex, pageSize) {
        const orgId = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || ''
        return getMaterial(orgId, this.searchContent, this.pageIndex, this.pageSize)
      },
      onSubmit() {
        this.refresh()
      },
      goDetails(item, index) {
        this.$router.push({name: 'positionDetails', query: {t: 6}, params: {number: item.FNUMBER}})
      }
    }
  }
</script>

<style lang="less" scoped>
  .customer_list{
    .customer_item{
      background-color: #fff;
      padding:15px;
      color: #333;
      border-bottom: 1px solid #ccc;
      .details{
        padding:10px 20px 5px;
        color:#666;
        p{
          font-size: 16px;
        }
      }
    }
    .customer_item:nth-child(odd){
      background: #b7cddf;
      // background: #740e0e;
    }
  }
</style>
