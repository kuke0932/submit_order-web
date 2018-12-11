<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header>业务收款明细</x-header>
      <div class="container" style="font-size: 14px">
        <group class="group">
          <x-input title="单据编号" readonly v-model="billNo"></x-input>
          <x-input title="业务类型" readonly v-model="business"></x-input>
          <x-input title="收款方式" readonly v-model="collection"></x-input>
          <x-input title="POS机号" readonly v-model="posNumber"></x-input>
          <x-input title="银行卡后四位" readonly v-model="cardNumber"></x-input>
          <x-input title="合计金额" readonly v-model="totalMoney"></x-input>
          <x-input title="收款状态" readonly v-model="status"></x-input>
          <x-textarea title="备注"  readonly autosize v-model="remark"></x-textarea>
        </group>

        <div class="infor_list" >
          <div class="infor_item" v-for="(item, index) in pgdList" v-bind:key="index">
            <flexbox class="details">
              <flexbox-item :span="1"></flexbox-item>
              <flexbox-item class="details_right">
                <flexbox>
                  <flexbox-item>{{item.F_PBPB_TEXT4}}</flexbox-item>
                </flexbox>
                <flexbox>
                  <flexbox-item>{{item.FCLIENTNAME}}</flexbox-item>
                  <flexbox-item>{{item.FCLIENTPHONE}}</flexbox-item>
                </flexbox>
                <flexbox>
                  <flexbox-item>{{item.FSPECIFICATIONS}}</flexbox-item>
                  <flexbox-item>&yen;{{numberFixed2(item.F_PBPB_AMOUNT)}}</flexbox-item>
                </flexbox>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
        <button-tab class="btn_box">
          <button-tab-item @on-item-click="goToCollection">收款</button-tab-item>
        </button-tab>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader, Group, XInput, PopupPicker, XButton, ButtonTab, ButtonTabItem, Flexbox, FlexboxItem, XTextarea } from 'vux'
  import { getListByfid, toCollection } from '@/api/collection'
  export default {
    components: {
      ViewBox,
      XHeader,
      Group,
      XInput,
      PopupPicker,
      XButton,
      Flexbox,
      FlexboxItem,
      ButtonTab,
      ButtonTabItem,
      XTextarea
    },
    data() {
      return {
        isAllSel: false,
        pgdList: [],
        billNo: '',
        business: '',
        collection: '',
        posNumber: '',
        cardNumber: '',
        totalMoney: '',
        status: '',
        remark: '',
        fid: null
      }
    },
    mounted() {
      window.addEventListener('scroll', this.stickyTop)
      this.fid = this.$route.query.fid
      this.fetchData()
    },
    methods: {
      fetchData() {
        getListByfid(this.fid).then(resp => {
          console.log(resp[0])
          this.billNo = resp[0].fbillno
          this.business = resp[0].F_PBPB_COMBO
          this.collection = resp[0].F_PBPB_COMBO2
          this.posNumber = resp[0].F_PBPB_TEXT5
          this.cardNumber = resp[0].F_PBPB_TEXT6
          this.totalMoney = this.numberFixed2(resp[0].F_PBPB_DECIMAL)
          this.status = resp[0].F_PBPB_COMBO3
          this.remark = resp[0].F_PBPBREMARKS
          this.pgdList = resp[0].entity
        })
      },
      goToCollection() {
        const orgID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || ''
        toCollection(this.fid, orgID).then(resp => {
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
</script>

<style scoped lang="less">
  .container{
    margin-top: 46px;
    #add_del{
      margin: 10px 0;
      padding: 10px 0;
      background: #fff;
    }
    .infor_list{
      margin-top: 10px;
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
