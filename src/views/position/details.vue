<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header" >位置信息
      </x-header>
      <div class="container">
        <!--<search
          v-model="searchContent"
          placeholder="请输入编码/名称"
          position="fixed"
          @on-submit="onSubmit"
          ref="search"
          style="position:fixed;z-index: 10; top: 46px"></search>-->
        <div :style="'margin-top: 46px; width: 100%;height:' + viewHeight + 'px;'">
          <!--<scroller ref="scroller" style="position: relative;" :on-refresh="refresh" :on-infinite="infinite" >-->
            <div class="customer_list">
              <div class="customer_item" v-for="(item, index) in materialList" @click="goDetails(item, index)">
                <flexbox>
                  <flexbox-item>仓库：{{item.Stock}}</flexbox-item>
                  <flexbox-item>售价：{{item.Price}}</flexbox-item>
                </flexbox>
                <flexbox>
                  <flexbox-item>位置：{{item.Position}}</flexbox-item>
                  <flexbox-item>物料代码：{{item.MaterialNumber}}</flexbox-item>
                </flexbox>
                <flexbox>
                  <flexbox-item>库存：{{item.Inventory}}</flexbox-item>
                </flexbox>
              </div>
            </div>
          <!--</scroller>-->
        </div>
      </div>
    </view-box>
  </div>
</template>
<script>
  import { ViewBox, XHeader, XButton, Search, Flexbox, FlexboxItem } from 'vux'
  import Tabbar from '@/components/tabbar'
  import { getPosition } from '@/api/position'
  // import Vue from 'vue'
  // import VueScroller from 'vue-scroller'
  // Vue.use(VueScroller)
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
        viewHeight: document.documentElement.clientHeight - 99,
        materialList: [],
        pageIndex: 1,
        pageSize: 10,
        searchContent: ''
      }
    },
    activated() {
//      this.refresh()
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      /* refresh(done) {
        this.pageIndex = 1
        this.pageSize = 10
        this.materialList = []
        if (this.$refs.scroller.loadingState === 2) {
          this.$refs.scroller.resetLoadingState()
          this.infiniteHandler(done)
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
      }, */
      fetchData(EmpID, MaterialNumber) {
        this.materialNumber = this.$route.params.number
        const empID = (this.$store.getters.employees[0] && this.$store.getters.employees[0].FID) || ''
        getPosition(empID, this.materialNumber).then(resp => {
          this.materialList = resp
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .customer_list{
    padding-bottom:55px;
    .customer_item{
      margin:0 0 10px 0;
      background-color: #fff;
      padding:10px 20px 5px;
      color:#666;
      p{
        font-size: 16px;
      }
    }
  }
</style>
