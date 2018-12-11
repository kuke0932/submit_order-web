<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">
        销售订单
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
          <x-button type="primary" class="btn" mini @click.native="editBill">动销修改</x-button>
          <!--<x-button style="margin-top: 0;" mini @click.native="goMOA">上传MOA</x-button>-->
          <x-button type="warn" class="btn" mini @click.native="openDialog">整单退货</x-button>
          <x-button type="warn" class="btn" mini @click.native="openDialog1">赠品退货</x-button>
          <x-button :gradients="['#1D62F0', '#19D5FD']" class="btn" mini @click.native="goBBC" v-if="billType === 1">生成BBC</x-button>
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
                      <flexbox-item>&yen; {{item.Amount}}</flexbox-item>
                      <flexbox-item>{{item.BuyDate.split(' ')[0]}}</flexbox-item>
                    </flexbox>
                    <flexbox>
                      <flexbox-item>{{item.Fspecification}}</flexbox-item>
                      <flexbox-item>{{item.FiveNumber}}</flexbox-item>
                    </flexbox>
                    <flexbox>
                      <flexbox-item>{{item.SendStatus}}</flexbox-item>
                      <flexbox-item>{{item.OutStatus}}</flexbox-item>
                      <flexbox-item>{{item.FinishStatus}}</flexbox-item>
                      <flexbox-item>{{item.ReturnStatus}}</flexbox-item>
                      <flexbox-item><label for="" @click="moreInfo(item)" style="color:blue">详情</label></flexbox-item>
                    </flexbox>
                  </flexbox-item>
                </flexbox>
              </div>
            </div>
          </scroller>
        </div>
      </div>
      <div v-transfer-dom>
        <x-dialog v-model="showDialog">
          <div class="dialogDiv">
            <group title="退货信息">
              <cell title="五联单号" v-model="fiveNumber" style="text-align: left"></cell>
              <cell title="规格型号" v-model="fspecification" style="text-align: left"></cell>
              <popup-picker title="退货类型" placeholder="请选择退货类型" :data="returnStyleList" v-model="returnStyle"></popup-picker>
              <popup-picker title="选择退货原因" placeholder="请选择退货原因" :data="returnReasonList" v-model="returnReasonForChoose"></popup-picker>
              <calendar disable-past title="退货日期" v-model="thDate"></calendar>
              <x-textarea placeholder="退货备注" v-model="returnReason" :autosize="true" :max="150"></x-textarea>
            </group>
            <flexbox :gutter="0" class="btn_box">
              <flexbox-item class="box_left" @click.native="returnGoods">
                <p>确认</p>
              </flexbox-item>
              <flexbox-item class="box_right" @click.native="closeDialog">
                <p>取消</p>
              </flexbox-item>
            </flexbox>
          </div>
        </x-dialog>
      </div>
      <div v-transfer-dom>
        <x-dialog v-model="showDialog1">
          <div class="dialogDiv">
            <p style="padding-top: 5px">安装类赠品退货</p>
            <div class="infor_list">
              <div class="infor_item" v-for="(item, index) in zpList" v-bind:key="index">
                <flexbox :gutter="0" class="details" >
                  <flexbox-item :span="2" class="details_left">
                    <label><input type="checkbox" class="item_checkbox" @change="checkItem(item)" :checked="item.checked || false"></label>
                  </flexbox-item>
                  <flexbox-item class="details_right">
                    <flexbox :gutter="0" align="left">
                      <flexbox-item>&nbsp;&nbsp;{{item.FNAME}}</flexbox-item>
                      <flexbox-item>{{item.FSPECIFICATION}}</flexbox-item>
                    </flexbox>
                  </flexbox-item>
                </flexbox>
              </div>
            </div>
            <flexbox :gutter="0" class="btn_box">
              <flexbox-item class="box_left"  @click.native="partReturn">
                <p>确认</p>
              </flexbox-item>
              <flexbox-item class="box_right"  @click.native="closeDialog1">
                <p>取消</p>
              </flexbox-item>
            </flexbox>
          </div>
        </x-dialog>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { Search, ViewBox, XHeader, XButton, XInput, XTextarea, Flexbox, FlexboxItem, XDialog, Calendar, TransferDomDirective as TransferDom, Group, Cell, PopupPicker } from 'vux'
  import Tabbar from '@/components/tabbar'
  import { getSimpleXSDDList, ReturnForPhoneTax, getPartDeleteList, SalePartReturn, SaveBBCORDER } from '@/api/submit_order'
  import Vue from 'vue'
  import VueScroller from 'vue-scroller'
  Vue.use(VueScroller)
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      XButton,
      XInput,
      XTextarea,
      Search,
      Tabbar,
      Flexbox,
      FlexboxItem,
      ViewBox,
      XDialog,
      Calendar,
      Group,
      Cell,
      PopupPicker
    },
    data() {
      return {
        FID: '',
        viewHeight: document.documentElement.clientHeight,
        merchID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].MERCFID) || '',
        billType: this.$store.getters.billType || '',
        pageIndex: 1,
        pageSize: 10,
        searchContent: '',
        isSearch: false,
        isAllSel: false,
        dataList: [],
        checkList: {},
        fiveNumber: '',
        fspecification: '',
        showDialog: false,
        returnStyleList: [['退货删单', '其它删单']],
        returnStyle: [],
        returnReasonList: [['安装受限', '材料费贵', '购买竞品', '价格原因或者活动力度原因', '线上购机', '暂时无需求', '其他原因（具体可写）']],
        returnReasonForChoose: [],
        thDate: 'TODAY',
        returnReason: '',
        showDialog1: false,
        zpList: [],
        checkDialogList: {}
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
        return getSimpleXSDDList(this.merchID, this.searchContent, this.pageIndex, this.pageSize)
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
            query: {from: 2, FID: keys[0]}
          })
        }
      },
      // 打开退货
      openDialog() {
        const keys = Object.keys(this.checkList)
        this.fiveNumber = this.checkList[keys].FiveNumber
        this.fspecification = this.checkList[keys].Fspecification
        console.log(this.checkList[keys])
        if (keys.length !== 1) {
          this.$vux.alert.show({
            title: '只能选择一条数据!',
            content: '请选择一条数据进行操作'
          })
        } else {
          this.returnStyle = []
          this.returnReason = ''
          this.showDialog = true
        }
      },
      closeDialog() {
        this.showDialog = false
      },
      // 退货
      returnGoods() {
        if (!this.returnStyle[0]) {
          this.$vux.toast.text('请选择退货类型')
          return
        }
        if (!this.returnStyle[0]) {
          this.$vux.toast.text('请选择退货日期')
          return
        }
        if (!this.returnReasonForChoose[0] && this.returnStyle[0] === '退货删单') {
          this.$vux.toast.text('请选择退货原因')
          return
        }
        /**
         * 退货备注在什么情况下都是必填项
         */
        if (this.returnReason === '') {
          this.$vux.toast.text('请输入退货备注')
          return
        }
        this.showDialog = false
        const keys = Object.keys(this.checkList)
        const jsonData = {
          'FID': keys[0],
          'ReturnType': this.returnStyle[0],
          'ReturnDate': this.thDate,
          'ReturnReason': this.returnReason,
          'RetrunReasonForChoose': this.returnReasonForChoose[0]
        }
        console.log(jsonData)
        ReturnForPhoneTax(jsonData).then(resp => {
          if (resp[0].IsSuccess) {
            const that = this
            this.$vux.toast.show({
              text: '退货成功',
              onHide() {
                that.refresh()
              }
            })
          } else {
            let errorMessage = resp[0].Message
            this.$vux.alert.show({
              title: '退货出错',
              content: errorMessage
            })
          }
        })
      },
      // 分录退货
      openDialog1() {
        const keys = Object.keys(this.checkList)
        if (keys.length !== 1) {
          this.$vux.alert.show({
            title: '只能选择一条数据!',
            content: '请选择一条数据进行操作'
          })
        } else {
          const jsonData = {
            'FID': keys[0]
          }
          getPartDeleteList(jsonData).then(resp => {
            if (resp.length > 0) {
              this.showDialog1 = true
              this.zpList = resp
              this.checkDialogList = {}
            } else {
              this.$vux.toast.text('此单据中没有赠品！')
            }
          })
        }
      },
      closeDialog1() {
        this.showDialog1 = false
      },
      partReturn() {
        console.log(this.checkDialogList)
        const keys = Object.keys(this.checkDialogList)
        if (keys.length !== 1) {
          this.$vux.toast.text('请选择一条数据！')
        } else {
          this.showDialog1 = false
          const jsonData = {
            'FENTRYID': keys[0]
          }
          SalePartReturn(jsonData).then(resp => {
            if (resp[0].IsSuccess) {
              const that = this
              that.showDialog1 = false
              that.$vux.toast.show({
                text: '退货成功',
                onHide() {
                  that.refresh()
                }
              })
            } else {
              let errorMessage = resp[0].Message
              this.$vux.alert.show({
                title: '退货出错',
                content: errorMessage
              })
            }
          })
        }
      },
      checkItem(item) {
        const checked = item.checked || false
        item.checked = !checked
        if (!checked) {
          this.checkDialogList[item.FENTRYID] = item
        } else {
          delete this.checkDialogList[item.FENTRYID]
        }
      },
      goBBC() {
        const keys = Object.keys(this.checkList)
        if (keys.length !== 1) {
          this.$vux.alert.show({
            title: '只能选择一条数据!',
            content: '请选择一条数据进行操作'
          })
        } else {
          // this.$router.push({
          //   name: 'goBBC',
          //   query: {FID: keys[0]}
          // })
          const jsonData = {
            'Fid': keys[0] // 销售订单FID
          }
          const that = this
          SaveBBCORDER(jsonData).then(resp => {
            if (resp[0].IsSuccess) {
              that.$vux.toast.show({
                text: 'BBC上传成功',
                onHide() {
                }
              })
            } else {
              const errorMessage = resp[0].Message
              that.$vux.alert.show({
                title: 'BBC上传失败',
                content: errorMessage
              })
            }
          })
        }
      },
      /* deleteBill() {
        const keys = Object.keys(this.checkList)
        if (keys.length < 1) {
          this.$vux.alert.show({
            title: '至少选择一条数据',
            content: '请选择一条数据进行操作'
          })
        } else {
          const that = this
          that.$vux.confirm.show({
            title: '删除',
            content: '确定删除吗？',
            onConfirm() {
              deleteDXDD(keys).then(resp => {
                if (resp[0].IsSuccess === 'true') {
                  that.$vux.toast.show({
                    text: '删除成功',
                    onHide() {
                      this.refresh()
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
      }, */
      checkIt(item) {
        const checked = item.checked || false
        item.checked = !checked
        if (!checked) {
          this.checkList[item.FID] = item
        } else {
          delete this.checkList[item.FID]
        }
      },
      moreInfo(item) {
        // console.log(item)
        this.$router.push({name: 'detailInfo', params: {item: item}})
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
      .btn {
        margin-top: 0;
        padding:0 0.4rem;
      }
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
    }
  }
  .dialogDiv{
    width:100%;
    min-height: 200px;
    padding-bottom: 42px;
    .infor_list {
      .infor_item {
        margin-top: 5px;
        padding: 5px 0;
        background-color: #fff;
        .details {
          color: #666;
          font-size: 14px;
          .details_left {
            padding-left: 10px;
            text-align: left;
            label {
              input {
                width: 18px;
                height: 18px;
                vertical-align: sub;
              }
            }
          }
          .details_right {
            height: 60px;
            line-height:60px;
          }
        }
      }
    }
    .btn_box{
      position: absolute;
      bottom: 0;
      width:100%;
      color: #fff;
      font-size: 14px;
      z-index: 100;
      text-align: center;
      font-weight: bold;
      .box_left{
        background: #5BB75B;
        padding: 10px;
      }
      .box_center{
        background-color: #FCFAF2;
        color:#666;
        padding: 10px;
      }
      .box_right{
        background-color: #ccc;
        padding: 10px;
        text-align: center;
      }
    }
  }

</style>
