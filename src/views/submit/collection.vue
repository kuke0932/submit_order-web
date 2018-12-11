<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header>报单收款</x-header>
      <div class="container" :style="'font-size: 14px;height:' + (screenHeight - 99) + 'px'">
        <group class="group">
          <cell title="顾客手机号" v-model="customerInfor.FCUSTPHONE"></cell>
          <cell title="顾客姓名" v-model="customerInfor.FNAME"></cell>
          <popup-picker title="业务类型" placeholder="点击选择业务类型" :data="businessList" v-model="business" @on-change="businessChange"></popup-picker>
          <popup-picker title="收款方式" placeholder="点击选择收款方式" :data="collectionList" v-model="collection"  @on-change="collectionChange"></popup-picker>
          <x-input title="POS机号" placeholder="请输入POS机卡号" v-model="posNumber" :readonly="isReadOnly"></x-input>
          <x-input title="银行卡后四位" type="number" placeholder="请输入银行卡后四位" v-model="cardNumber" :readonly="isReadOnly"></x-input>
          <!--<x-input title="五联单号" placeholder="请输入五联单号" v-model="fiveNumer"></x-input>-->
          <x-input title="收款金额" type="number" placeholder="请输入收款金额" v-model="totalMoney"></x-input>
          <x-textarea title="备注" :max="100" placeholder="请输入备注" autosize v-model="remark"></x-textarea>
        </group>

        <button-tab class="btn_box" v-if="showGoToPay">
          <button-tab-item @on-item-click="save">保存</button-tab-item>
          <button-tab-item @on-item-click="save" >去收款</button-tab-item>
        </button-tab>
        <button-tab class="btn_box" v-else>
          <button-tab-item class="goToPayBtn" @on-item-click="save">保存</button-tab-item>
        </button-tab>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { addCollection, toCollection } from '@/api/collection'
  import { ViewBox, XHeader, Group, Cell, XInput, PopupPicker, XButton, ButtonTab, ButtonTabItem, Flexbox, FlexboxItem, XTextarea } from 'vux'
  export default {
    components: {
      ViewBox,
      XHeader,
      Group,
      Cell,
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
        screenHeight: document.documentElement.clientHeight,
        isReadOnly: true,
        customerInfor: {},
        business: [],
        businessList: [['销售']],
        collection: [],
        collectionList: [['微信', '支付宝', '现金', 'POS机']],
        posNumber: null,
        cardNumber: null,
        fiveNumer: '',
        totalMoney: '',
        remark: '',
        today: '',
        fid: '',
        showGoToPay: true
      }
    },
    deactivated() {
    },
    activated() {
      this.customerInfor = this.$route.params.customerInfor
      if (Number(this.totalMoney) < 0) {
        this.totalMoney = 0
      }
      const date = new Date()
      this.today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    },
    mounted() {
    },
    methods: {
      businessChange(val) {
        this.business = val
      },
      collectionChange(val) {
        this.collection = val
        if (this.collection[0] === 'POS机') {
          this.isReadOnly = false
        } else {
          this.isReadOnly = true
        }
        if (this.collection[0] === 'POS机' || this.collection[0] === '现金') {
          this.showGoToPay = false
        } else {
          this.showGoToPay = true
        }
      },
      save(idx) {
//        let reg1 = new RegExp(/^[0-9]*$/) // 数字
//        let reg2 = new RegExp(/^[0-9a-zA-Z]{15}$/) // 15数字和字母
        let reg3 = new RegExp(/^[0-9]{4}$/) // 4位数字
        if (!this.business[0]) {
          this.$vux.toast.text('业务类型不能为空')
          return
        }
        if (!this.collection[0]) {
          this.$vux.toast.text('收款方式不能为空')
          return
        }
        if (this.collection[0] === 'POS机') {
          if (!this.posNumber) {
            this.$vux.toast.text('请输入正确的POS机号')
            return
          }
          if (!this.cardNumber || !reg3.test(this.cardNumber)) {
            this.$vux.toast.text('请输入正确的银行卡号后四位')
            return
          }
        }
        /* if (!this.fiveNumer) {
          this.$vux.toast.text('五联单号不能为空')
          return
        } */
        if (parseInt(this.totalMoney) === 0) {
          this.$vux.toast.text('收款金额不能为0')
          return
        }
        const deptID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].DEPTFID) || ''
        const custID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].CUSTFID) || ''
        const empID = (this.$store.getters.employees[0] && this.$store.getters.employees[0].FID) || ''
        const orgID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGNUMBER) || ''
        const jsonData = {
          'F_PBPB_Combo': this.business[0],
          'F_PBPB_Text': this.customerInfor.FNAME, // 顾客姓名
          'F_PBPB_Text1': this.customerInfor.FCUSTPHONE, // 顾客手机号
          'F_PBPB_Combo2': this.collection[0] === '微信' ? '微信家用' : this.collection[0] === '支付宝' ? '支付宝家用' : this.collection[0],
          'F_PBPB_Base': deptID,
          'F_PBPB_Base11': '',
          'F_PBPB_Base1': custID,
          'F_PBPB_Remarks': this.remark,
          'F_PBPB_Combo3': '未收款',
          'F_PBPB_Base2': empID,
          'F_PBPB_OrgId': orgID,
          'F_PBPB_Decimal': '' + this.totalMoney,
          'F_PBPB_Text5': this.posNumber,
          'F_PBPB_Text6': this.cardNumber,
          'F_PBPB_CheckBox': 'false',
          'F_PBPB_Date2': this.today,
          'FEntity': [{
            'FClientName': this.customerInfor.FNAME, // 顾客姓名
            'FClientPhone': this.customerInfor.FCUSTPHONE, // 顾客手机号
            'F_PBPB_Text4': this.fiveNumer, // 五联单号/工单单号
            'FSpecifications': '', // 机器型号
            'F_PBPB_Amount': '' + this.totalMoney // 单据体金额
          }]
        }

        return addCollection(jsonData).then(resp => {
          const that = this
          if (resp[0].StatusCode) {
            if (idx === 0) {
              that.$vux.toast.show({
                text: '保存成功',
                onHide() {
                  that.reset()
                  that.$router.replace({path: '/submit/collectionList?t=0'})
                }
              })
            } else if (idx === 1) {
              that.fid = '' + resp[0].fid
              const orgID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || ''
              toCollection(that.fid, orgID).then(resp => {
                const data = resp[0]
                if (data.StatusCode) {
                  that.reset()
                  window.location.href = data.Url
                } else {
                  that.$vux.alert.show({
                    title: '提示!',
                    content: data.Msg
                  })
                }
              })
            }
          } else {
            const msg = JSON.parse(resp[0].Msg)
            const errors = msg.Result.ResponseStatus.Errors
            let errorMessage = errors[0].FieldName
            /* errors.forEach(e => {
              errorMessage += e.Message + '\r\n'
            }) */
            this.$vux.alert.show({
              title: '保存出错!',
              content: errorMessage
            })
          }
        })
      },
      reset() {
        this.business = []
        this.collection = []
        this.posNumber = null
        this.cardNumber = null
        this.fiveNumer = ''
        this.totalMoney = 0
        this.remark = ''
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
            input{
              border: 0;
              border-bottom: 1px solid #ccc;
              width:100px;
              text-align: center;
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
    width: 150px;
  }
  .fix{
    position:fixed;
    top:36px;
    left:0;
    z-index: 100;
  }
  .goToPayBtn {
    -webkit-border-radius: 32px;
    -moz-border-radius: 32px;
    border-radius: 32px;
  }
  .goToPayBtn:after {
    -webkit-border-radius: 32px;
    -moz-border-radius: 32px;
    border-radius: 32px;
  }
</style>
