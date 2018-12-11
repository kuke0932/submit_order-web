<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header>业务收款
        <!--<a slot="right" @click="addBill" v-if="noPgd === false">新增</a>
        <a slot="right" @click="backToPgd" v-else>取消</a>-->
      </x-header>
      <div class="container" style="font-size: 14px">
        <group class="group">
          <popup-picker title="业务类型*" placeholder="点击选择业务类型" :data="businessList" v-model="business" @on-change="businessChange"></popup-picker>
          <popup-picker title="收款方式*" placeholder="点击选择收款方式" :data="collectionList" v-model="collection"  @on-change="collectionChange"></popup-picker>
          <x-input title="POS机号" placeholder="请输入POS机卡号" v-model="posNumber" :readonly="isReadOnly"></x-input>
          <x-input title="银行卡后四位" placeholder="请输入银行卡后四位" v-model="cardNumber" :readonly="isReadOnly"></x-input>
          <x-input title="顾户姓名"  placeholder="请输入顾客姓名" v-model="customerName" v-if="noPgd === true"></x-input>
          <x-input title="顾客手机" :max="11"  placeholder="请输入顾客手机" type="number" v-model="customerPhone" v-if="noPgd === true"></x-input>
          <x-input title="工单单号"  placeholder="请输入工单单号" v-model="orderNumber" v-if="noPgd === true"></x-input>
          <x-input title="机器型号" placeholder="请输入机器型号" v-model="machineType" v-if="noPgd === true"></x-input>
          <x-input title="合计金额" placeholder="请输入金额" type="number" v-model="totalMoney" :readonly="noPgd === false"></x-input>
          <x-textarea title="备注" :max="100" placeholder="请输入备注" autosize v-model="remark"></x-textarea>
        </group>

        <flexbox :gutter="0" id='add_del' :class="{'fix': isFix}" v-if="noPgd === false">
          <flexbox-item :span="5" style="padding-left: 10px">
            <x-button type="default" mini @click.native="checkAll">全选/取消</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary"  mini @click.native="addPgd">导入工单</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="warn" mini @click.native="delBill">删除</x-button>
          </flexbox-item>
        </flexbox>

        <div class="infor_list" v-if="noPgd === false">
          <div class="infor_item" v-for="(item, index) in pgdList" v-bind:key="index">
            <flexbox class="details">
              <flexbox-item :span="2" class="details_left">
                <label><input type="checkbox" class="item_checkbox" name='checkbox' @click="checkIt(index, item.checked)" :checked="item.checked || false"></label>
              </flexbox-item>
              <flexbox-item class="details_right">
                <flexbox>
                  <flexbox-item>{{item.WorkOrderNumber}}</flexbox-item>
                  <flexbox-item>{{item.Specifications}}</flexbox-item>
                </flexbox>
                <flexbox>
                  <flexbox-item>{{item.ClientName}}</flexbox-item>
                  <flexbox-item>{{item.ClientPhone}}</flexbox-item>
                </flexbox>
                <flexbox>
                  <flexbox-item>
                    &yen;<input v-model="item.money"
                                @blur="onBlur(index)"
                                @focus="onFoucs(index)"
                                @change="onChange"
                                placeholder="请输入金额"
                                style="color: #666;"
                                onkeyup="if(isNaN(value))execCommand('undo')"
                                onafterpaste="if(isNaN(value))execCommand('undo')">
                  </flexbox-item>
                </flexbox>
              </flexbox-item>
            </flexbox>
          </div>
        </div>

        <button-tab class="btn_box" v-if="showGoToPay">
          <button-tab-item @on-item-click="save">保存</button-tab-item>
          <button-tab-item @on-item-click="save" >去收款</button-tab-item>
        </button-tab>
        <button-tab class="btn_box"  v-else>
          <button-tab-item class="goToPayBtn" @on-item-click="save">保存</button-tab-item>
        </button-tab>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { addCollection, toCollection } from '@/api/collection'
  import { ViewBox, XHeader, Group, XInput, PopupPicker, XButton, ButtonTab, ButtonTabItem, Flexbox, FlexboxItem, XTextarea } from 'vux'
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
        isFix: false,
        isAllSel: true,
        isReadOnly: true,
        pgdListJson: {},
        pgdList: [],
        checkList: {},
        business: [],
        businessList: [['安装', '销售']],
        collection: [],
        collectionList: [['微信家用', '微信服务', '支付宝家用', '支付宝服务', '现金', 'POS机']],
        posNumber: null,
        cardNumber: null,
        customerName: '',
        customerPhone: '',
        orderNumber: '',
        machineType: '',
        totalMoney: 0,
        remark: '',
        today: '',
        fid: '',
        noPgd: false,
        showGoToPay: true
      }
    },
    deactivated() {
      window.removeEventListener('scroll', this.stickyTop)
    },
    activated() {
      this.noPgd = this.$route.query.noPgd
      window.addEventListener('scroll', this.stickyTop)
      const pgds = this.$route.params.pgds || {}
      const keys = Object.keys(pgds)
      const arr = []
      keys.forEach(v => {
        arr.push(pgds[v])
      })
      if (this.pgdList.length > 0) {
        for (let i = 0; i < this.pgdList.length; i++) {
          for (let j = 0; j < arr.length; j++) {
            if (this.pgdList[i].ClientPhone !== arr[j].ClientPhone) {
              this.$vux.toast.text('派工单手机号不一致！')
              return
            }
          }
        }
      }
      this.pgdListJson = Object.assign({}, pgds, this.pgdListJson)
      this.pgdList = Object.keys(this.pgdListJson).map((index) => {
        this.pgdListJson[index].money = this.pgdListJson[index].money || 0
        return this.pgdListJson[index]
      })
      if (this.totalMoney <= 0) {
        this.totalMoney = 0
      }
    },
    mounted() {
      this.reset()
      const date = new Date()
      this.today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
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
      addBill() {
        this.noPgd = true
        this.reset()
      },
      backToPgd() {
        this.noPgd = false
        this.reset()
      },
      reset() {
        this.pgdList = []
        this.pgdListJson = {}
        this.totalMoney = 0
        this.business = []
        this.collection = []
        this.posNumber = null
        this.cardNumber = null
        this.customerName = ''
        this.customerPhone = ''
        this.orderNumber = ''
        this.machineType = ''
        this.totalMoney = 0
        this.remark = ''
      },
      addPgd() {
        this.$router.push({name: 'workOrder', query: {t: 4}})
      },
      delBill() {
        const _this = this
        let checked = false
        for (let i = 0; i < _this.pgdList.length; i++) {
          if (_this.pgdList[i].checked) {
            checked = true
            break
          }
        }
        if (!checked) {
          _this.$vux.alert.show({
            title: '提示',
            content: '请至少选择一条数据！'
          })
        } else {
          _this.$vux.confirm.show({
            title: '警告',
            content: '确定删除吗？删除后无法恢复',
            onConfirm() {
              for (let i = 0; i < _this.pgdList.length;) {
                if (_this.pgdList[i].checked) {
                  _this.totalMoney = _this.totalMoney - _this.pgdList[i].money
                  delete _this.pgdListJson[_this.pgdList[i].WorkOrderNumber]
                  _this.pgdList.splice(i, 1)
                } else {
                  i++
                }
              }
              _this.$vux.toast.text('删除成功')
            }
          })
        }
      },
      /* 全选按钮 */
      checkAll() {
        if (this.isAllSel === false) {
          this.totalMoney = 0
          for (let i = 0; i < this.pgdList.length; i++) {
            this.pgdList[i].checked = true
            this.$set(this.pgdList, i, this.pgdList[i])
            this.checkList[i] = this.pgdList[i]
            this.totalMoney += Number.parseFloat(this.pgdList[i].money)
          }
          this.isAllSel = true
        } else {
          for (let i = 0; i < this.pgdList.length; i++) {
            this.pgdList[i].checked = false
            this.$set(this.pgdList, i, this.pgdList[i])
            delete this.checkList[i]
            this.totalMoney = 0
          }
          this.isAllSel = false
        }
      },
      checkIt(index, checked) {
        let list = this.pgdList[index]
        if (!checked) {
          list.checked = true
          this.checkList[index] = this.pgdList[index]
          this.totalMoney += Number.parseFloat(this.pgdList[index].money)
        } else {
          list.checked = false
          delete this.checkList[index]
          this.totalMoney -= Number.parseFloat(this.pgdList[index].money)
        }
      },
      onFoucs(index) {
        this.pgdList[index].lastMoney = this.pgdList[index].money
      },
      onChange(index) {
      },
      onBlur(index) {
        if (!this.pgdList[index].money) {
          this.pgdList[index].money = 0
        }
        this.pgdList[index].money = Number.parseFloat(this.pgdList[index].money)
        this.totalMoney = this.totalMoney - Number.parseFloat(this.pgdList[index].lastMoney) + Number.parseFloat(this.pgdList[index].money)
      },
      save(idx) {
//        let reg1 = new RegExp(/^[0-9]*$/) // 数字
//        let reg2 = new RegExp(/^[0-9a-zA-Z]{15}$/) // 15数字和字母
        let reg3 = new RegExp(/^[0-9]{4}$/) // 4位数字
        const telReg = /^[1][0-9]{10}$/
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
        if (this.totalMoney === 0) {
          this.$vux.toast.text('收款金额不能为0')
          return
        }
        if (this.noPgd === false) {
          let checked = false
          for (let i = 0; i < this.pgdList.length; i++) {
            if (this.pgdList[i].checked) {
              checked = true
              break
            }
          }
          if (!checked) {
            this.$vux.toast.text('请至少选择一条数据')
            return
          }
          for (let i = 0; i < this.pgdList.length; i++) {
            if (checked && this.pgdList[i].money === 0) {
              this.$vux.toast.text('明细金额不能为0')
              return
            }
          }
        }
        if (this.noPgd === true) {
          if (!this.customerName) {
            this.$vux.toast.text('请输入顾客姓名')
            return
          }
          if (!this.customerPhone) {
            this.$vux.toast.text('请输入顾客手机号')
            return
          }
          if (!telReg.test(this.customerPhone)) {
            this.$vux.toast.text('手机号格式错误')
            return
          }
          if (!this.machineType) {
            this.$vux.toast.text('请输入机器型号')
            return
          }
        }
        const deptID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].DEPTFID) || ''
        // const custID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].CUSTFID) || ''
        const empShop = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].EmpShop) || ''
        const empID = (this.$store.getters.employees[0] && this.$store.getters.employees[0].FID) || ''
        const orgID = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGNUMBER) || ''
        let jsonData = {}
        if (this.noPgd === false) {
          const clientName = this.pgdList[0].ClientName
          const clientPhone = this.pgdList[0].ClientPhone
          jsonData = {
            'F_PBPB_Combo': this.business[0],
            'F_PBPB_Text': clientName, // 顾客姓名
            'F_PBPB_Text1': clientPhone, // 顾客手机号
            'F_PBPB_Combo2': this.collection[0],
            'F_PBPB_Base': deptID,
            'F_PBPB_Base11': '',
            'F_PBPB_Base1': empShop,
            'F_PBPB_Remarks': this.remark,
            'F_PBPB_Combo3': '未收款',
            'F_PBPB_Base2': empID,
            'F_PBPB_OrgId': orgID,
            'F_PBPB_Decimal': '' + this.totalMoney,
            'F_PBPB_Text5': this.posNumber,
            'F_PBPB_Text6': this.cardNumber,
            'F_PBPB_CheckBox': 'false',
            'F_PBPB_Date2': this.today,
            'FEntity': []
          }
          const FEntity = []
          for (let i = 0; i < this.pgdList.length; i++) {
            const pgd = this.pgdList[i]
            if (pgd.checked) {
              FEntity.push({
                'FClientName': pgd.ClientName, // 顾客姓名
                'FClientPhone': pgd.ClientPhone, // 顾客手机号
                'F_PBPB_Text4': pgd.WorkOrderNumber, // 五联单号/工单单号
                'FSpecifications': pgd.Specifications, // 机器型号
                'F_PBPB_Amount': '' + pgd.money // 单据体金额
              })
            }
          }
          jsonData.FEntity = FEntity
        } else {
          jsonData = {
            'F_PBPB_Combo': this.business[0],
            'F_PBPB_Text': this.customerName, // 顾客姓名
            'F_PBPB_Text1': this.customerPhone, // 顾客手机号
            'F_PBPB_Combo2': this.collection[0],
            'F_PBPB_Base': deptID,
            'F_PBPB_Base11': '',
            'F_PBPB_Base1': empShop,
            'F_PBPB_Remarks': this.remark,
            'F_PBPB_Combo3': '未收款',
            'F_PBPB_Base2': empID,
            'F_PBPB_OrgId': orgID,
            'F_PBPB_Decimal': '' + this.totalMoney,
            'F_PBPB_Text5': this.posNumber,
            'F_PBPB_Text6': this.cardNumber,
            'F_PBPB_CheckBox': 'false',
            'F_PBPB_Date2': this.today,
            'FEntity': [
              {
                'FClientName': this.customerName, // 顾客姓名
                'FClientPhone': this.customerPhone, // 顾客手机号
                'F_PBPB_Text4': this.OrderNumber, // 五联单号/工单单号
                'FSpecifications': this.machineType, // 机器型号
                'F_PBPB_Amount': '' + this.totalMoney // 单据体金额
              }
            ]
          }
        }
        return addCollection(jsonData).then(resp => {
          const that = this
          if (resp[0].StatusCode) {
            if (idx === 0) {
              that.$vux.toast.show({
                text: '保存成功',
                onHide() {
                  that.reset()
                  that.$router.replace({path: '/collection?t=4'})
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
                  this.$vux.alert.show({
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
      stickyTop() {
        const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop
        const elementHeight = document.querySelector('.group').clientHeight
        if (scrollHeight >= elementHeight) {
          this.isFix = true
        } else {
          this.isFix = false
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .container{
    margin-top: 46px;
    margin-bottom: 50px;
    #add_del{
      margin-top: 10px;
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
            padding-left: 20px;
            text-align: left;
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
