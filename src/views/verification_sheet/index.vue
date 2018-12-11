<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">未使用
      </x-header>
      <div class="container">
        <div :style="'margin-top: 46; width: 100%;height:' + (viewHeight - 100) + 'px'">
          <scroller style="position: relative;"  ref="scroller" :on-refresh="refresh" :on-infinite="infinite">
            <div class="infor_list" >
              <div class="infor_item" v-for="(item,index) in unReturnList" v-bind:key="index">
                <flexbox class="details">
                  <flexbox-item :span="1" class="details_left">
                    <label><input type="checkbox" class="item_checkbox" name='checkbox' @click="checkIt(item)" :checked="item.checked || false"></label>
                  </flexbox-item>
                  <flexbox-item class="details_right">
                    <flexbox>
                      <flexbox-item>{{item.BillNo}}</flexbox-item>
                      <flexbox-item>{{item.Date}}</flexbox-item>
                    </flexbox>
                    <flexbox>
                      <flexbox-item>{{item.Specification}}</flexbox-item>
                      <flexbox-item>{{numberFixed2(item.MaterialNumber)}}</flexbox-item>
                    </flexbox>
                  </flexbox-item>
                </flexbox>
              </div>
            </div>
          </scroller>
        </div>
        <button-tab class="btn_box">
          <button-tab-item @on-item-click="returnMaterials()">使用</button-tab-item>
        </button-tab>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader, Group, XInput, Cell, XButton, ButtonTab, ButtonTabItem, Flexbox, FlexboxItem } from 'vux'
  import InfiniteLoading from 'vue-infinite-loading'
  import { getUnReturnMaterial } from '@/api/verification_sheet'
  import Vue from 'vue'
  import VueScroller from 'vue-scroller'
  Vue.use(VueScroller)

  export default {
    components: {
      XHeader,
      ViewBox,
      Group,
      XInput,
      Cell,
      XButton,
      ButtonTab,
      ButtonTabItem,
      Flexbox,
      FlexboxItem,
      InfiniteLoading
    },
    data() {
      return {
        viewHeight: document.documentElement.clientHeight,
        orgID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || '',
        userID: (this.$store.getters.employees[0] && this.$store.getters.employees[0].FNUMBER) || '',
        isAllSel: false,
        unReturnList: [],
        pageIndex: 1,
        pageSize: 10,
        checkedMaterialList: {}
      }
    },
    mounted() {
//      this.fetchData()
    },
    methods: {
      refresh(done) {
        this.pageIndex = 1
        this.pageSize = 10
        this.unReturnList = []
        this.isAllSel = false
        this.checkedMaterialList = {}
        const scroller = this.$refs.scroller
        if (scroller.loadingState === 2) {
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
        this.fetchData(this.orgID, this.userID, this.pageIndex, this.pageSize).then(resp => {
          this.unReturnList = this.unReturnList.concat(resp)
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
      fetchData(orgID, userID, pageIndex, pageSize) {
        return getUnReturnMaterial(this.orgID, this.userID, this.pageIndex, this.pageSize)
      },
      /* 点击单选框 */
      checkIt(item) {
        const checked = item.checked || false
        item.checked = !checked
        if (!checked) {
          this.checkedMaterialList[item.BillNo] = item
        } else {
          delete this.checkedMaterialList[item.BillNo]
        }
      },
      /* 全选按钮 */
      checkAll() {
        if (this.isAllSel === false) {
          for (let i = 0; i < this.unReturnList.length; i++) {
            this.unReturnList[i].checked = true
            this.checkedMaterialList[this.unReturnList[i].BillNo] = this.unReturnList[i]
          }
          this.isAllSel = true
        } else {
          for (let i = 0; i < this.unReturnList.length; i++) {
            this.unReturnList[i].checked = false
            delete this.checkedMaterialList[this.unReturnList[i].BillNo]
          }
          this.isAllSel = false
        }
      },
      returnMaterials() {
        const keys = Object.keys(this.checkedMaterialList)
        if (keys.length === 0) {
          this.$vux.alert.show({
            title: '提示!',
            content: '请至少选择一条数据!'
          })
        } else {
          const params = []
          for (let i = 0; i < keys.length; i++) {
            params.push({
              BillNo: this.checkedMaterialList[keys[i]].BillNo,
              BillId: this.checkedMaterialList[keys[i]].BillId,
              EntryId: this.checkedMaterialList[keys[i]].EntryId,
              MaterialName: this.checkedMaterialList[keys[i]].MaterialName,
              MaterialCode: this.checkedMaterialList[keys[i]].MaterialCode,
              Specification: this.checkedMaterialList[keys[i]].Specification,
              MaterialNumber: this.checkedMaterialList[keys[i]].MaterialNumber,
              UnitNumber: this.checkedMaterialList[keys[i]].UnitNumber,
              SrcStockStatusId: this.checkedMaterialList[keys[i]].SrcStockStatusId,
              DestStockStatusId: this.checkedMaterialList[keys[i]].DestStockStatusId
            })
          }
          this.$router.push({
            name: 'sheetConfirm',
            params
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
