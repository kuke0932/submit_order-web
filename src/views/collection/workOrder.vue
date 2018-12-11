<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">派工单
        <!--<a slot="right" @click="addBill">新增</a>-->
      </x-header>
      <div class="container">
        <search
          v-model="searchContent"
          placeholder="请输入顾客姓名/手机号/派工单单号"
          position="fixed"
          top="46px"
          @on-submit="onSubmit"
          style="position:fixed;z-index: 10; top: 46px"
          ref="search"></search>
        <div :style="'margin-top: 90px; width: 100%;height:' + viewHeight + 'px;'">
          <scroller ref="scroller" style="position: relative;" :on-refresh="refresh" :on-infinite="infinite" >
            <div class="infor_list" >
              <div class="infor_item" v-for="(item, index) in pgdList" v-bind:key="index">
                <flexbox class="details">
                  <flexbox-item :span="1" class="details_left">
                    <label><input type="checkbox" class="item_checkbox" name='checkbox' @click="checkIt(index, item.checked, item)" :checked="item.checked || false"></label>
                  </flexbox-item>
                  <flexbox-item class="details_right">
                    <flexbox>
                      <flexbox-item>{{item.ClientName}}</flexbox-item>
                      <flexbox-item>{{item.ClientPhone}}</flexbox-item>
                    </flexbox>
                    <flexbox>
                      <flexbox-item>{{item.WorkOrderNumber}}</flexbox-item>
                      <flexbox-item>{{item.Specifications}}</flexbox-item>
                    </flexbox>
                  </flexbox-item>
                </flexbox>
              </div>
            </div>
          </scroller>
        </div>
        <button-tab class="btn_box">
          <button-tab-item @on-item-click="addPgd">添加收款</button-tab-item>
        </button-tab>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { Search, ViewBox, XHeader, Group, XInput, Cell, XButton, ButtonTab, ButtonTabItem, Flexbox, FlexboxItem } from 'vux'
  import { getPgdList } from '@/api/collection'
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
        pgdList: [],
        pageIndex: 1,
        pageSize: 10,
        searchContent: '',
        isTriggerFirstLoad: true,
        checkList: {}
      }
    },
    activated() {
      this.checkList = {}
    },
    mounted() {
//      this.fetchData()
    },
    methods: {
      /* addBill() {
        this.$router.push({ name: 'collectionBill', query: { t: 4, noPgd: false } })
      }, */
      refresh(done) {
        this.pageIndex = 1
        this.pageSize = 10
        this.pgdList = []
        this.checkList = {}
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
        this.fetchData(this.searchContent, this.pageIndex, this.pageSize).then(resp => {
          this.pgdList = this.pgdList.concat(resp)
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
      fetchData(search, pageIndex, pageSize) {
        const orgID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || ''
        const deptID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].DEPTFID) || ''
        const workerName = (this.$store.getters.employees[0] && this.$store.getters.employees[0].FNAME) || ''
        const workerID = (this.$store.getters.employees[0] && this.$store.getters.employees[0].FWORKERID) || ''
        return getPgdList(orgID, deptID, workerName, workerID, this.searchContent, this.pageIndex, this.pageSize)
      },
      onSubmit() {
        this.refresh()
      },
      /* 全选按钮 */
      /* checkAll() {
        if (this.isAllSel === false) {
          for (let i = 0; i < this.pgdList.length; i++) {
            this.pgdList[i].checked = true
            this.checkList[i] = this.pgdList[i]
          }
          this.isAllSel = true
        } else {
          for (let i = 0; i < this.pgdList.length; i++) {
            this.pgdList[i].checked = false
            delete this.checkList[i]
          }
          this.isAllSel = false
        }
      }, */
      /* 点击单选框 */
      checkIt(index, checked, item) {
        let list = this.pgdList[index]
        if (!checked) {
          list.checked = true
          this.checkList[this.pgdList[index].WorkOrderNumber] = this.pgdList[index]
        } else {
          list.checked = false
          delete this.checkList[this.pgdList[index].WorkOrderNumber]
        }
      },
      addPgd() {
        const keys = Object.keys(this.checkList)
        const that = this
        if (keys.length === 0) {
          this.$vux.alert.show({
            title: '提示!',
            content: '请至少选择一条数据!'
          })
        } else {
          const Arr = []
          keys.forEach((v, e) => {
            Arr.push(this.checkList[v])
          })
          for (let i = 1; i < Arr.length; i++) {
            if (Arr[i - 1].ClientPhone !== Arr[i].ClientPhone) {
              that.$vux.toast.text('派工单手机号不一致！')
              return
            }
          }
          this.$router.replace({ name: 'collectionBill', query: { t: 4, noPgd: false }, params: {pgds: this.checkList} })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    margin-bottom: 20px;
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
            padding-left: 10px;
            label {
              input {
                width: 18px;
                height: 18px;
              }
            }
          }
          .details_right{
            .count{
              .input_counts {
                border: 0;
                width: 40px;
                text-align: center;
                font-size: 1em;
                color: #666;
              }
              img{
                width:18px;
                vertical-align: middle;
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
