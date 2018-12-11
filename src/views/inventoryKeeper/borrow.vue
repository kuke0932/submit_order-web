<template>
  <div>
    <div style="position: fixed; top: 46px; width: 100%;z-index: 999">
      <group class="selector_box" >
        <x-input title="员工姓名" v-model="userName"></x-input>
        <calendar title="日期" v-model="date" @on-change="onCalendarChange" @on-hide="onCalendarHide"></calendar>
        <x-button style="margin: 5px;float: right" type="primary" mini text="查询" @click.native="onSubmit"></x-button>
      </group>
      <tab style="position: fixed; top: 170px; width: 100%;">
        <tab-item selected @on-item-click="tabOnItemClick">已保存</tab-item>
        <tab-item @on-item-click="tabOnItemClick">已提交</tab-item>
        <tab-item @on-item-click="tabOnItemClick">已审核</tab-item>
      </tab>
      <div class="select_all" style="position: fixed; top: 213px; width: 100%;">
        <x-button @click.native="checkAll" mini :type="isAllSel == true ? 'default' : 'default'">全选/取消</x-button>
        <x-button style="margin-top: 0;" v-if="currentTab == 0" mini @click.native="batchSubmit">提交</x-button>
        <x-button style="margin-top: 0;" v-if="currentTab == 0" mini @click.native="deleteBill">删除</x-button>
        <x-button style="margin-top: 0;" v-if="currentTab == 1" mini @click.native="batchUnAudit">撤回</x-button>
        <x-button style="margin-top: 0;" v-if="currentTab == 2" mini @click.native="batchUnAudit">反审核</x-button>
      </div>
    </div>
    <div :style="'margin-top: 250px; width: 100%;height:'+ (viewHeight - 303) + 'px'">
      <scroller ref="scroller" style="position:relative;" :on-refresh="refresh(currentTab)" :on-infinite="infinite">
        <div class="infor_list">
          <div class="infor_item" v-for="(item, index) in (isSearch ? searchList : dataList[currentTab])" v-bind:key="index">
            <flexbox class="details">
              <flexbox-item :span="1" class="details_left">
                <label><input type="checkbox" class="item_checkbox" @click="checkIt(item)" :checked="item.checked || false"></label>
              </flexbox-item>
              <flexbox-item class="details_right">
                <router-link :to="{name:'inventoryKeeperDetails', params: {borrowDetails: item, fromType: 0}}">
                  <span>规格型号：{{item.Specification}}</span>
                  <br>
                  <flexbox>
                    <flexbox-item>单据编号：{{item.BillNo}}</flexbox-item>
                    <flexbox-item>
                      <flexbox :gutter="0">
                        <flexbox-item :span="3.5">日期：</flexbox-item>
                        <flexbox-item>{{item.Date.substr(0,11)}}</flexbox-item>
                      </flexbox>
                    </flexbox-item>
                  </flexbox>
                  <flexbox>
                    <flexbox-item>提货人：{{item.ConsigName}}</flexbox-item>
                    <flexbox-item>物料数量：{{numberFixed2(item.MaterialNumber)}}</flexbox-item>
                  </flexbox>
                  <flexbox>
                    <flexbox-item>位置：{{item.MaterialPosition}}</flexbox-item>
                    <flexbox-item>状态：{{item.DocumentStatus == 'A' || item.DocumentStatus == 'D' ? "待提交" : item.DocumentStatus == 'B' ? '待审核' : '已审核'}}</flexbox-item>
                  </flexbox>
                </router-link>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
      </scroller>
    </div>
  </div>
</template>

 <script>
  import {
    ViewBox,
    XHeader,
    Actionsheet,
    TransferDom,
    Search,
    ButtonTab,
    ButtonTabItem,
    Tab,
    TabItem,
    Group,
    Flexbox,
    FlexboxItem,
    XButton,
    Selector,
    Calendar,
    XInput
  } from 'vux'
  import { retBorrowMaterialList as retMainList } from '@/api/borrow'
  import { unAudit, submit, remove } from '@/api/base'
  import Vue from 'vue'
  import VueScroller from 'vue-scroller'
  Vue.use(VueScroller)

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Actionsheet,
      ViewBox,
      Search,
      ButtonTab,
      ButtonTabItem,
      Tab,
      TabItem,
      Group,
      Flexbox,
      FlexboxItem,
      XButton,
      Selector,
      Calendar,
      XInput
    },
    data() {
      return {
        viewHeight: document.documentElement.clientHeight,
        pageIndex: [1, 1, 1],
        pageSize: [10, 10, 10],
        dataList: [[], [], []],
        searchPageIndex: 1,
        searchPageSize: 10,
        searchList: [],
        searchContent: '',
        isSearch: false,
        count: 1,
        allSel: '',
        isAllSel: false,
        results: [],
        selectAll: false,
        currentTab: 0,
        inputCount: 0,
        checkedMaterialList: {},
        infiniteType: 0,  // 0 搜索上拉加载更多, 1 普通上拉加载更多,
        typeSelector: 1,
        typeOptions: [{key: 0, value: '单据编号'}, {key: 1, value: '员工姓名'}],
        userName: '', // 搜索条件 用户名
        date: []      // 搜索条件 日期
      }
    },
    created() {
      // this.fetchData(0, '', 1, 10)
    },
    methods: {
      refresh(currentTab) {
        const that = this
        return (done) => {
          that.tabOnItemClick(currentTab, done)
        }
      },
      infinite(done) {
        this.infiniteHandler(done)
      },
      infiniteHandler($state) {
        let pageIndex, pageSize
        if (this.isSearch) {
          pageIndex = this.searchPageIndex
          pageSize = this.searchPageSize
        } else {
          pageIndex = this.pageIndex[this.currentTab]
          pageSize = this.pageSize[this.currentTab]
        }
        this.fetchData(this.currentTab, this.userName, this.date[0] || '', this.date[1] || '', '', pageIndex, pageSize).then(resp => {
          if (resp && resp.length) {
            if (this.isSearch) {
              this.searchList = this.searchList.concat(resp)
              if (resp.length < pageSize) {
                $state && $state(true)
              } else {
                $state && $state()
              }
              this.searchPageIndex ++
            } else {
              const list = this.dataList[this.currentTab].concat(resp)
              console.log(this.dataList)
              this.$set(this.dataList, this.currentTab, list)
              if (resp.length < pageSize) {
                $state && $state(true)
              } else {
                $state && $state()
              }
              this.pageIndex[this.currentTab]++
            }
          } else {
            $state && $state(true)
          }
        }).catch((e) => {
          $state && $state(true)
        })
      },
      fetchData(currentTab, userName, beginDate, endDate, billNo, pageIndex, pageSize) {
        const deptID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].DEPTFID) || ''
        const organizationID = this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID
        const userId = this.$store.getters.employees[0].FID
        let status = currentTab === 0 ? [{Status0: 'A', Status1: 'D'}] : currentTab === 1 ? [{Status0: 'B'}] : [{Status0: 'C'}]
        const billTypeID = '5a9ddf31999992'
        return retMainList(deptID, organizationID, userId, userName, status, beginDate, endDate, billNo, billTypeID, pageIndex, pageSize)
      },
      onCalendarChange() {
        if (this.date.length > 2) {
          this.$vux.toast.show('最多输入两个日期！')
          this.date.splice(2, this.date.length - 1)
          return false
        }
      },
      onCalendarHide() {
        return false
      },
      typeSelectorChange(val) {
        this.typeSelector = val
      },
      onSubmit() {
        this.isSearch = true
        this.searchPageIndex = 1
        this.searchPageSize = 10
        this.searchList = []
        this.checkedMaterialList = {}
        const scroller = this.$refs.scroller
        if (scroller.loadingState === 2) {
          scroller.loadingState = 0
          scroller.finishInfinite(false)
        } else {
          scroller.finishInfinite(false)
        }
      },
      checkIt(item) {
        const checked = item.checked || false
        item.checked = !checked
        if (!checked) {
          this.checkedMaterialList[item.BillNo] = item
        } else {
          delete this.checkedMaterialList[item.BillNo]
        }
        console.log(this.checkedMaterialList)
      },
      tabOnItemClick(index, done) {
        this.isSearch = false
        this.currentTab = index
        if (this.isSearch) {
          this.searchPageIndex = 1
          this.searchList = []
        } else {
          this.$set(this.pageIndex, index, 1)
          this.$set(this.dataList, index, [])
        }
        this.checkedMaterialList = {}
        const scroller = this.$refs.scroller
        if (scroller.loadingState === 2) {
          scroller.loadingState = 0
          done && done(false)
        } else {
          done && done(false)
        }
      },
      /* 全选按钮 */
      checkAll() {
        if (this.isAllSel === false) {
          for (let i = 0; i < this.dataList[this.currentTab].length; i++) {
            this.dataList[this.currentTab][i].checked = true
            this.checkedMaterialList[this.dataList[this.currentTab][i].BillNo] = this.dataList[this.currentTab][i]
          }
          this.isAllSel = true
        } else {
          for (let i = 0; i < this.dataList[this.currentTab].length; i++) {
            this.dataList[this.currentTab][i].checked = false
            delete this.checkedMaterialList[this.dataList[this.currentTab][i].BillNo]
          }
          this.isAllSel = false
        }
      },
      deleteBill() {
        const keys = Object.keys(this.checkedMaterialList)
        if (keys.length === 0) {
          this.$vux.alert.show({
            title: '至少选择一条数据',
            content: '请至少选择一条数据!'
          })
        } else {
          const data = ['STK_TransferDirect', {
            'CreateOrgId': 0,
            'Numbers': keys
          }]
          remove(data).then(r => {
            const _this = this
            if (r.Result.ResponseStatus.IsSuccess) {
              this.$vux.toast.show({
                text: '删除成功!',
                onHide() {
                  const index = _this.currentTab
                  _this.$set(_this.pageIndex, index, 1)
                  _this.$set(_this.dataList, index, [])
                  _this.$refs.scroller.resetLoadingState()
                  _this.checkedMaterialList = {}
                }
              })
            } else {
              const errors = r.Result.ResponseStatus.Errors
              let errorMessage = ''
              errors.forEach(e => {
                errorMessage += e.Message + '\r\n'
              })
              this.$vux.alert.show({
                title: '删除出错!',
                content: errorMessage,
                onHide() {
                }
              })
            }
          })
        }
      },
      batchSubmit() {
        const keys = Object.keys(this.checkedMaterialList)
        if (keys.length === 0) {
          this.$vux.alert.show({
            title: '至少选择一条数据',
            content: '请至少选择一条数据!'
          })
        } else {
          const data = ['STK_TransferDirect', {
            'CreateOrgId': 0,
            'UseOrgId': 0,
            'Numbers': keys
          }]
          submit(data).then(r => {
            const _this = this
            if (r.Result.ResponseStatus.IsSuccess) {
              this.$vux.toast.show({
                text: '提交成功!',
                onHide() {
                  const index = _this.currentTab
                  _this.$set(_this.pageIndex, index, 1)
                  _this.$set(_this.dataList, index, [])
                  _this.$refs.scroller.resetLoadingState()
                  _this.checkedMaterialList = {}
                }
              })
            } else {
              const errors = r.Result.ResponseStatus.Errors
              let errorMessage = ''
              errors.forEach(e => {
                errorMessage += e.Message + '\r\n'
              })

              this.$vux.alert.show({
                title: '提交单据出错!',
                content: errorMessage,
                onHide() {
                }
              })
            }
          })
        }
      },
      /* 打回 */
      batchUnAudit() {
        const keys = Object.keys(this.checkedMaterialList)
        if (keys.length === 0) {
          this.$vux.alert.show({
            title: '至少选择一条数据',
            content: '请至少选择一条数据!'
          })
        } else {
          const data = ['STK_TransferDirect', {
            'CreateOrgId': 0,
            'Numbers': keys
          }]
          unAudit(data).then(r => {
            const _this = this
            if (r.Result.ResponseStatus.IsSuccess) {
              this.$vux.toast.show({
                text: '打回成功!',
                onHide() {
                  const index = _this.currentTab
                  _this.$set(_this.pageIndex, index, 1)
                  _this.$set(_this.dataList, index, [])
                  _this.$refs.scroller.resetLoadingState()
                  _this.checkedMaterialList = {}
                }
              })
            } else {
              const errors = r.Result.ResponseStatus.Errors
              let errorMessage = ''
              errors.forEach(e => {
                errorMessage += e.Message + '\r\n'
              })

              this.$vux.alert.show({
                title: '打回出错!',
                content: errorMessage,
                onHide() {
                }
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
    .select_all {
      padding: 5px 10px;
      background-color: #fff;
      border-bottom: 1px solid #eee;
      label {
        line-height: 20px;
        height: 20px;
        .all_checkbox {
          width: 20px;
          height: 20px;
        }
      }
    }
    .infor_list {
      .infor_item {
        margin: 0 0 10px 0;
        padding-bottom: 5px;
        background-color: #fff;
        .details {
          padding: 10px 0 0 0;
          color: #666;
          font-size: 14px;
          .details_left {
            padding-left: 10px;
            text-align: center;
            label {
              input {
                width: 18px;
                height: 18px;
              }
            }
          }
          .details_right {
            .count {
              .input_counts {
                border: 0;
                width: 20px;
                text-align: center;
                font-size: 1em;
                color: #666;
              }
              img {
                width: 18px;
                vertical-align: middle;
              }
            }
          }
        }
      }
      .btns {
        text-align: center;
        button {
          font-size: 12px;
          padding: 2px 5px;
          border: 0;
          border-radius: 4px;
          box-sizing: border-box;
          background: #04BE02;
          color: #fff;
        }
      }
    }
  }

</style>
