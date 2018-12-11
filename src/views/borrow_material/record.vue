<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}"
                @on-click-back="back" slot="header" >借料记录
      </x-header>
      <div class="container">
        <div class="borrow_record" style="position: fixed; top: 46px; width: 100%;z-index:999">
          <search
            v-model="searchContent"
            position="fixed"
            top="46px"
            placeholder="请输入开始日期及结束日期"
            :readonly="searchFocus"
            @on-focus="onFocus"
            @on-cancel="onCancel"
            @on-submit="onSubmit"
            style="position:fixed;z-index: 10; top: 46px;width: 100%;"
            ref="search"></search>
          <inline-calendar
            style="position: fixed;top: 90px;width: 100%;z-index: 10;"
            v-show="searchFocus" @on-change="onCalendarChange" v-model="date"></inline-calendar>
          <tab style="position: fixed; top: 90px; width: 100%;">
            <tab-item selected @on-item-click="tabOnItemClick">申请借料</tab-item>
            <tab-item @on-item-click="tabOnItemClick">已备货</tab-item>
            <tab-item @on-item-click="tabOnItemClick">已审核</tab-item>
          </tab>
          <div class="select_all" v-if="currentTab != 2" style="position: fixed; top: 134px; width: 100%;">
            <x-button @click.native="checkAll" mini :type="isAllSel == true ? 'default' : 'default'">全选/取消</x-button>
            <x-button style="margin-top: 0;" v-if="currentTab == 0" mini @click.native="edit">编辑</x-button>
            <x-button style="margin-top: 0;" v-if="currentTab == 0" mini @click.native="batchRemove">删除</x-button>
            <x-button style="margin-top: 0;" v-if="currentTab == 1" mini @click.native="batchAudit">确认</x-button>
          </div>
        </div>
        <div :style="currentTab == 2 ? 'margin-top: 143px; width: 100%;height:' + (viewHeight - 193) + 'px' :
             'margin-top: 180px; width: 100%;height:' + (viewHeight - 230) + 'px'">
          <scroller ref="scroller" style="position: relative;" :on-refresh="refresh(currentTab)" :on-infinite="infinite" >
            <div class="infor_list">
              <div class="infor_item" v-for="(item, index) in (isSearch ? searchList : dataList[currentTab])" v-bind:key="index">
                <flexbox class="details">
                  <flexbox-item :span="1" class="details_left">
                    <label v-if="currentTab != 2"><input type="checkbox" class="item_checkbox" @click="checkIt(item)" :checked="item.checked || false"></label>
                  </flexbox-item>
                  <flexbox-item class="details_right">
                    <router-link :to="{name:'borrowDetails', params: {details: item, currentTab: currentTab}}">
                      <flexbox :gutter="0" align="left">
                        <flexbox-item >
                          <flexbox :gutter="0" align="left">
                            <flexbox-item :span="5.5">单据编号：</flexbox-item>
                            <flexbox-item>{{item.BillNo}}</flexbox-item>
                          </flexbox>
                        </flexbox-item>
                        <flexbox-item>
                          <flexbox :gutter="0" align="left">
                            <flexbox-item :span="3.5">日期：</flexbox-item>
                            <flexbox-item>{{item.Date.substr(0,11)}}</flexbox-item>
                          </flexbox>
                        </flexbox-item>
                      </flexbox>
                      <flexbox :gutter="0" align="left">
                        <flexbox-item>
                          <flexbox :gutter="0" align="left">
                            <flexbox-item :span="2.75">规格型号：</flexbox-item>
                            <flexbox-item>{{item.MaterialDetail[0].SpecifiCation}}</flexbox-item>
                          </flexbox>
                        </flexbox-item>
                      </flexbox>
                      <flexbox :gutter="0" align="left">
                        <flexbox-item>
                          <flexbox :gutter="0" align="left">
                            <flexbox-item :span="5.5">物料数量：</flexbox-item>
                            <flexbox-item>{{numberFixed2(item.MaterialNumber)}}</flexbox-item>
                          </flexbox>
                        </flexbox-item>
                        <flexbox-item class="count">
                          <flexbox :gutter="0" align="left">
                            <flexbox-item :span="3.5">状态：</flexbox-item>
                            <flexbox-item >{{item.Status == 'A' || item.Status == 'D' ? "待提交" : item.Status == 'B' ? '待审核' : '已收货'}}</flexbox-item>
                          </flexbox>
                        </flexbox-item>
                      </flexbox>
                    </router-link>
                  </flexbox-item>
                </flexbox>
            </div>
            </div>
          </scroller>
        </div>
      </div>
    </view-box>
  </div>
</template>

<script>
  import {
    ViewBox,
    XHeader,
    Search,
    ButtonTab,
    ButtonTabItem,
    Tab,
    TabItem,
    Group,
    Flexbox,
    FlexboxItem,
    XButton,
    InlineCalendar
  } from 'vux'
  import { retMainList } from '@/api/borrow'
  import { remove, audit } from '@/api/base'
  import Vue from 'vue'
  import VueScroller from 'vue-scroller'
  Vue.use(VueScroller)

  export default {
    components: {
      XHeader,
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
      InlineCalendar
    },
    data() {
      return {
        viewHeight: document.documentElement.clientHeight,
        pageIndex: [1, 1, 1],
        pageSize: [10, 10, 10],
        dataList: [[], [], []], // 三个标签页面
        searchPageIndex: 1,
        searchPageSize: 10,
        searchList: [],
        searchContent: '',
        isSearch: false,
        count: 1,
        allSel: '',
        isAllSel: false,
        currentTab: 0,
        inputCount: 0,
        checkedMaterialList: {},
        searchFocus: false,
        date: []
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
        this.fetchData(this.currentTab, pageIndex, pageSize).then(resp => {
          console.log(resp)
          if (resp && resp.length) {
            // this.dataList[this.currentTab] = this.dataList[this.currentTab].concat(resp)
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
          console.log(e)
          $state && $state(true)
        })
      },
      fetchData(currentTab, pageIndex, pageSize) {
        const userId = this.$store.getters.employees[0].FNUMBER
        const organizationID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || ''
        let status = currentTab === 0 ? [{Status0: 'A', Status1: 'D'}] : currentTab === 1 ? [{Status0: 'B'}] : [{Status0: 'C'}]
        return retMainList(organizationID, userId, status, this.date[0] || '', this.date[1] || this.date[0] || '', pageIndex, pageSize)
      },
      onSubmit() {
        if (this.date.length > 2) {
          this.$vux.toast.show('最多输入两个日期')
          return
        }
        this.$refs.search.setBlur()
        this.searchFocus = false
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
      onFocus() {
        this.searchFocus = true
        console.log('on focus')
      },
      onCancel() {
        this.searchFocus = false
        this.date = []
        console.log('on cancel')
      },
      onCalendarChange() {
        if (this.date.length !== 0) {
          this.$refs.search.setFocus()
        }
        if (this.date.length > 2) {
          this.$vux.toast.show('最多输入两个日期！')
          this.date.splice(2, this.date.length - 1)
          this.searchContent = this.date[0] + '     ' + this.date[1]
        } else {
          const begin = this.date[0] || ''
          const end = this.date[1] || ''
          if (begin) {
            if (begin < end) {
              this.searchContent = begin + '    ' + end
            } else {
              this.searchContent = end ? (end + '    ' + begin) : begin
            }
          } else {
            this.searchContent = ''
          }
        }
      },
      tabOnItemClick(index, done) {
        this.searchFocus = false
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
      edit() {
        const keys = Object.keys(this.checkedMaterialList)
        if (keys.length === 0) {
          this.$vux.alert.show({
            title: '至少选择一条数据!',
            content: '请至少选择一条数据'
          })
        } else if (keys.length > 1) {
          this.$vux.alert.show({
            title: '最多选择一条数据',
            content: '请最多选择一条数据!'
          })
        } else {
          this.$router.push({
            name: 'borrowDetails',
            params: {details: this.checkedMaterialList[keys[0]], currentTab: 0}
          })
        }
      },
      /* 审核 */
      batchAudit(e) {
        const keys = Object.keys(this.checkedMaterialList)
        console.log(keys)
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
          audit(data).then(r => {
            const _this = this
            if (r.Result.ResponseStatus.IsSuccess) {
              this.$vux.toast.show({
                text: '审核成功!',
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
      remove(billNo, index) {
        const _this = this
        this.$vux.confirm.show({
          title: '删除',
          content: '确定删除吗？',
          onConfirm() {
            const data = ['STK_TransferDirect', {
              CreateOrgId: 0,
              Numbers: [
                billNo
              ]
            }]
            remove(data).then(() => {
              _this.$vux.toast.show({
                text: '删除成功',
                onHide() {
                  _this.dataList[_this.currentTab].splice(index, 1)
                }
              })
            })
          }
        })
      },
      batchRemove() {
        const keys = Object.keys(this.checkedMaterialList)
        if (keys.length === 0) {
          this.$vux.alert.show({
            title: '至少选择一条数据',
            content: '请至少选择一条数据!'
          })
        } else {
          const _this = this
          this.$vux.confirm.show({
            title: '删除',
            content: '确定删除吗？',
            onConfirm() {
              const data = ['STK_TransferDirect', {
                CreateOrgId: 0,
                Numbers: keys
              }]
              remove(data).then(() => {
                _this.$vux.toast.show({
                  text: '删除成功',
                  onHide() {
                    const index = _this.currentTab
                    _this.$set(_this.pageIndex, index, 1)
                    _this.$set(_this.dataList, index, [])
                    _this.$refs.scroller.resetLoadingState()
                    _this.checkedMaterialList = {}
                  }
                })
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
            flex: 0 0 0.5% !important;
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
