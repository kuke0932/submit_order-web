<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">报单收款单
      </x-header>
      <div class="container">
        <search
          v-model="searchContent"
          placeholder="请输入顾客姓名/手机号"
          position="fixed"
          top="46px"
          @on-submit="onSubmit"
          style="position:fixed;z-index: 10; top: 46px"
          ref="search"></search>
        <div :style="'margin-top: 90px; width: 100%; height:' + viewHeight + 'px'">
          <scroller ref="scroller" :on-refresh="refresh" :on-infinite="infinite"
                    style="position: relative;">
            <div class="infor_list" >
              <div class="infor_item" v-for="(item, index) in collectionList" v-bind:key="index">
                <flexbox class="details">
                  <flexbox-item :span="2" class="details_left">
                    <label><input type="checkbox" class="item_checkbox" name='checkbox' @click="checkIt(index, item.checked)" :checked="item.checked || false"></label>
                  </flexbox-item>
                  <flexbox-item class="details_right">
                    <flexbox>
                      <flexbox-item>{{item.CustomerName}}</flexbox-item>
                      <flexbox-item>{{item.CustomerPhone}}</flexbox-item>
                    </flexbox>
                    <flexbox>
                      <flexbox-item>{{item.F_PBPB_COMBO3}}</flexbox-item>
                      <flexbox-item>&yen;{{numberFixed2(item.F_PBPB_DECIMAL)}}</flexbox-item>
                    </flexbox>
                  </flexbox-item>
                </flexbox>
              </div>
            </div>
          </scroller>
        </div>
        <button-tab class="btn_box">
          <button-tab-item @on-item-click="toCollection()">收款</button-tab-item>
        </button-tab>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { Search, ViewBox, XHeader, Group, XInput, Cell, XButton, ButtonTab, ButtonTabItem, Flexbox, FlexboxItem } from 'vux'
  import { getList, toCollection } from '@/api/collection'
  import Vue from 'vue'
  import VueScroller from 'vue-scroller'
  Vue.use(VueScroller)

  export default {
    components: {
      Search,
      XHeader,
      ViewBox,
      Group,
      XInput,
      Cell,
      XButton,
      ButtonTab,
      ButtonTabItem,
      Flexbox,
      FlexboxItem
    },
    data() {
      return {
        viewHeight: document.documentElement.clientHeight - 143,
        collectionList: [],
        pageIndex: 1,
        pageSize: 10,
        searchContent: '',
        isSearch: false,
        checkList: {}
      }
    },
    mounted() {
    },
    methods: {
      refresh(done) {
        this.pageIndex = 1
        this.pageSize = 10
        this.collectionList = []
        this.checkList = {}
        if (this.$refs.scroller.loadingState === 2) {
//          this.$refs.scroller.resetLoadingState()
//          this.infiniteHandler(done)
          this.$refs.scroller.loadingState = 0
          done && done(false)
        } else {
          done && done(false)
        }
      },
      infinite(done) {
        this.infiniteHandler(done)
      },
      infiniteHandler($state) {
        this.fetchData().then(resp => {
          this.collectionList = this.collectionList.concat(resp)
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
      fetchData() {
        const orgId = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || ''
        const empId = (this.$store.getters.employees[0] && this.$store.getters.employees[0].FID) || ''
        return getList(orgId, empId, this.searchContent, this.pageIndex, this.pageSize)
      },
      onSubmit() {
        this.refresh()
      },
      /* 点击单选框 */
      checkIt(index, checked) {
        let list = this.collectionList[index]
        if (!checked) {
          list.checked = true
          this.checkList[index] = this.collectionList[index]
        } else {
          list.checked = false
          delete this.checkList[index]
        }
      },
      toCollection() {
        const keys = Object.keys(this.checkList)
        if (keys.length !== 1) {
          this.$vux.alert.show({
            title: '提示!',
            content: '只能选择一条数据!'
          })
        } else {
          const fid = this.checkList[keys[0]].fid
          const orgID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || ''
          toCollection(fid, orgID).then(resp => {
            const data = resp[0]
            if (data.StatusCode) {
              window.location.href = data.Url
            } else {
              this.$vux.alert.show({
                title: '提示!',
                content: data.Msg
              })
            }
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    /*margin-bottom: 20px;*/
    .select_all {
      padding: 5px 10px;
      background-color: #fff;
      border-bottom: 1px solid #eee;
    }
    .infor_list{
      .infor_item{
        margin:0 0 10px 0;
        background-color: #fff;
        .details{
          padding:10px 0;
          color:#666;
          font-size: 14px;
          .details_left{
            padding-left: 20px;
            text-align: left;
            label {
              input {
                width: 18px;
                height: 18px;
              }
            }
          }
        }
      }
    }
  }
  .btn_box {
    position: fixed;
    bottom: 54px;
    right: 2px;
    width: 100px;
  }
</style>
