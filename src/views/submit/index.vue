<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">
        动销订单
      </x-header>
      <div class="container">
        <search
          v-model="searchContent"
          placeholder="请输入手机号/姓名"
          position="fixed"
          @on-submit="onSubmit"
          style="position:fixed;z-index: 10; top: 46px;width: 100%;"
          ref="search"></search>
        <div class="select_all" style="position: fixed; top: 90px; width: 100%;">
          <!--<x-button @click.native="checkAll" mini :type="isAllSel == true ? 'default' : 'default'">全选/取消</x-button>-->
          <x-button type="primary" style="margin-top: 0;" mini @click.native="editBill">修改</x-button>
          <x-button type="primary" style="margin-top: 0;" mini @click.native="xsddSubmit">上报MOA</x-button>
          <x-button type="warn" style="margin-top: 0;" mini @click.native="deleteBill">删除</x-button>
        </div>
        <div :style="'margin-top: 130px; width: 100%;height:'+ (viewHeight - 183) + 'px'">
          <scroller ref="scroller" style="position:relative;" :on-refresh="refresh" :on-infinite="infinite">
            <div class="infor_list">
              <div class="infor_item" v-for="(item, index) in dataList" v-bind:key="index">
                <flexbox class="details">
                  <flexbox-item :span="2" class="details_left">
                    <label><input type="checkbox" class="item_checkbox" @click="checkIt(item)" :checked="item.checked || false"></label>
                  </flexbox-item>
                  <flexbox-item class="details_right">
                      <flexbox>
                        <flexbox-item>{{item.CustName}}</flexbox-item>
                        <flexbox-item>{{item.CustPhone}}</flexbox-item>
                      </flexbox>
                      <flexbox>
                        <flexbox-item>{{item.Amount}}</flexbox-item>
                        <flexbox-item>{{item.SubmitStatus}}</flexbox-item>
                      </flexbox>
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
  import { Search, ViewBox, XHeader, XButton, Flexbox, FlexboxItem } from 'vux'
  import Tabbar from '@/components/tabbar'
  import { getSimpleDXDDList, submitNew, deleteDXDD } from '@/api/submit_order'
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
        viewHeight: document.documentElement.clientHeight,
        merchID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].MERCFID) || '',
        pageIndex: 1,
        pageSize: 10,
        searchContent: '',
        isSearch: false,
        isAllSel: false,
        dataList: [],
        checkList: {}
      }
    },
    activated(done) {
      this.refresh(done)
    },
    methods: {
      refresh(done) {
        this.pageIndex = 1
        this.pageSize = 10
        this.dataList = []
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
        this.fetchData('', this.searchContent, this.pageIndex, this.pageSize).then(resp => {
          this.dataList = this.dataList.concat(resp)
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
      fetchData(merchID, search, pageIndex, pageSize) {
        return getSimpleDXDDList(this.merchID, this.searchContent, this.pageIndex, this.pageSize)
      },
      onSubmit() {
        this.refresh()
      },
      editBill() {
        const keys = Object.keys(this.checkList)
        if (keys.length !== 1) {
          this.$vux.alert.show({
            title: '只能选择一条数据!',
            content: '请选择一条数据进行操作'
          })
        } else {
          this.$router.push({
            name: 'detailsSubmit',
            query: {from: 1, FID: keys[0]}
          })
        }
      },
      // 提交
      xsddSubmit() {
        const keys = Object.keys(this.checkList)
        if (keys.length !== 1) {
          this.$vux.alert.show({
            title: '只能选择一条数据!',
            content: '请选择一条数据进行操作'
          })
        } else {
          const number = []
          for (let key in this.checkList) {
            number.push(this.checkList[key].FBILLNO)
          }
          submitNew(number).then(resp => {
            if (resp.Result.ResponseStatus.IsSuccess) {
              const that = this
              this.$vux.toast.show({
                text: '提交成功',
                onHide() {
                  that.refresh()
                }
              })
            } else {
              let errorMessage = resp.Result.ResponseStatus.Errors[0].Message
              this.$vux.alert.show({
                title: '提交出错',
                content: errorMessage
              })
            }
          })
        }
      },
      deleteBill() {
        const keys = Object.keys(this.checkList)
        if (keys.length !== 1) {
          this.$vux.alert.show({
            title: '只能选择一条数据',
            content: '请选择一条数据进行操作'
          })
        } else {
          const that = this
          that.$vux.confirm.show({
            title: '删除',
            content: '确定删除吗？',
            onConfirm() {
              deleteDXDD(keys).then(resp => {
                if (resp[0].IsSuccess) {
                  that.$vux.toast.show({
                    text: '删除成功',
                    onHide() {
                      that.refresh()
                    }
                  })
                } else {
                  const errorMessage = resp[0].Message
                  that.$vux.alert.show({
                    title: '删除失败!',
                    content: errorMessage,
                    onHide() {
                    }
                  })
                }
              })
            }
          })
        }
      },
      checkIt(item) {
        const checked = item.checked || false
        item.checked = !checked
        if (!checked) {
          this.checkList[item.FID] = item
        } else {
          delete this.checkList[item.FID]
        }
      }
      /* 全选按钮 */
      /* checkAll() {
        if (this.isAllSel === false) {
          for (let i = 0; i < this.dataList.length; i++) {
            this.dataList[i].checked = true
            this.checkList[this.dataList[i].FID] = this.dataList[i]
          }
          this.isAllSel = true
        } else {
          for (let i = 0; i < this.dataList.length; i++) {
            this.dataList[i].checked = false
            delete this.checkList[this.dataList[i].FID]
          }
          this.isAllSel = false
        }
      } */
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
            padding-left: 20px;
            text-align: left;
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
