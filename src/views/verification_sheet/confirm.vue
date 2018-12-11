<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">新增核销
      </x-header>
      <div class="container">
        <div class="infor_list" :style="'height:' + (viewHeight - 90) + 'px'">
          <swipeout v-for="(material, index) in materialList" v-bind:key="material.BillId">
            <swipeout-item transition-mode="follow">
              <div slot="right-menu">
                <swipeout-button @click.native="deleteItem(index)" type="warn">删除</swipeout-button>
              </div>
              <div slot="content" class="demo-content vux-1px-tb">
                <div class="infor_item">
                  <flexbox class="details">
                    <flexbox-item :span="1">
                    </flexbox-item>
                    <flexbox-item class="details_right">
                      <flexbox>
                        <flexbox-item>{{material.MaterialCode}}</flexbox-item>
                        <flexbox-item>{{material.MaterialName}}</flexbox-item>
                      </flexbox>
                      <flexbox>
                        <flexbox-item>{{material.Specification}}</flexbox-item>
                        <flexbox-item class="count">
                          <img @click="minusCount(index)" src="../../assets/icons/minus.svg">
                          <input type="number" style="border-bottom: 1px solid #ccc" class="input_counts"  @blur="validInput(index)" v-model="material.MaterialNumber" @change="checkCount">
                          <img @click="plusCount(index)" src="../../assets/icons/plus.svg">
                        </flexbox-item>
                      </flexbox>
                    </flexbox-item>
                  </flexbox>
                </div>
              </div>
            </swipeout-item>
          </swipeout>
        </div>
      </div>
      <flexbox :gutter="0" class="btn_box" id="btn_box">
        <flexbox-item class="box_center" @click.native="pre">
          <p>上一步</p>
        </flexbox-item>
        <flexbox-item class="box_right" @click.native="save()">
          <p>确认</p>
        </flexbox-item>
      </flexbox>
    </view-box>
  </div>
</template>

<script>
  import { dateFormat, ViewBox, XHeader, Group, XInput, Cell, ButtonTab, ButtonTabItem, Flexbox, FlexboxItem, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
  import { materialDocumentsSave, submit, audit, batchSave } from '@/api/base'

  export default {
    components: {
      XHeader,
      ViewBox,
      Group,
      XInput,
      Cell,
      ButtonTab,
      ButtonTabItem,
      Flexbox,
      FlexboxItem,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton
    },
    data() {
      return {
        viewHeight: document.documentElement.clientHeight,
        materialList: [],
        material: {},
        originNumber: []
      }
    },
    activated() {
//      this.checkedMaterial = this.$store.getters.checkedMaterial
    },

    mounted() {
      this.materialList = this.$route.params
      console.log(this.$route.params)
      for (let i = 0; i < this.materialList.length; i++) {
        this.originNumber[i] = this.materialList[i].MaterialNumber
        this.materialList[i].MaterialNumber = Math.floor(this.materialList[i].MaterialNumber)
      }
      console.log(this.materialList)
    },
    methods: {
      minusCount: function(index) {
        let goods = this.materialList[index]
        goods.MaterialNumber = Number.parseFloat(goods.MaterialNumber || 0)
        console.log(goods.MaterialNumber)
        if (goods.MaterialNumber >= 1) {
          goods.MaterialNumber -= 1
        }
        if (goods.MaterialNumber <= 0) {
          goods.MaterialNumber = 1
        }
        this.$set(this.materialList, index, goods)
      },
      plusCount: function(index) {
        let goods = this.materialList[index]
        goods.MaterialNumber = Number.parseFloat(goods.MaterialNumber || 0)
        if (goods.MaterialNumber <= (this.originNumber - 1)) {
          goods.MaterialNumber += 1
        }
        this.$set(this.materialList, index, goods)
      },
      validInput(index) {
        let v = this.materialList[index].MaterialNumber
        const ret = this.validNumber(v)
        if (!ret.ok) {
          this.$vux.alert.show({
            title: '出错了!',
            content: ret.message,
            onHide() {
            }
          })
          return false
        }
        return true
      },
      validNumber(number) {
        if (!number) {
          return {
            ok: false,
            message: '数量不能为空'
          }
        }
        const regex = /(^[1-9]\d*$)|(^[0-9]\d*\.\d{0,2}$)/
        if (!regex.test(number)) {
          return {
            ok: false,
            message: '数字格式不对,请检查'
          }
        }
        return {
          ok: true,
          message: ''
        }
      },
      checkCount: function(e) {
        if (e.path[0].value <= 0) {
          e.path[0].value = 0
        }
      },
      deleteItem(index) {
       /* delete this.checkedMaterial[materialId]
        this.checkedMaterial = Object.assign({}, this.checkedMaterial)
        this.$store.dispatch('setCheckedMaterial', this.checkedMaterial).then(() => {}) */
        console.log(index)
        for (let i = 0; i < this.materialList.length; i++) {
          if (index === i) {
            this.materialList.splice(i, 1)
          }
        }
      },
      pre() {
        this.back()
      },
      save() {
        const orgID = this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID
        const employeeNumber = this.$store.getters.employees[0].FNUMBER
        const deptFNumber = this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].DEPTFNUMBER
        const data = [{
          'Creator': '',
          'NeedUpDateFields': [ ],
          'NeedReturnFields': [ ],
          'IsDeleteEntry': 'True',
          'SubSystemId': '',
          'IsVerifyBaseDataField': 'false',
          'IsEntryBatchFill': 'True',
          'Model': [{
            'FID': '0',
            'FBillNo': '',
            'FBillTypeID': {
              'FNumber': 'HXDBD01_SYS'
            },
            'FTRANSFERDIRECT': 'GENERAL',
            'FTRANSFERBIZTYPE': 'InnerOrgTransfer',
            'FSTOCKOUTORGID': {
              'FORGID': orgID
            },
            'FOwnerTypeOutIdHead': 'BD_OwnerOrg',
            'FOwnerOutIdHead': {
              'FORGID': orgID
            },
            'FSTOCKORGID': {
              'FORGID': orgID
            },
            'FOwnerTypeIdHead': 'BD_OwnerOrg',
            'FOwnerIdHead': {
              'FORGID': orgID
            },
            'F_PBPB_Base3': {
              'FNumber': deptFNumber
            },
            'FDATE': dateFormat(new Date(), 'YYYY-MM-DD'),
            'F_PBPB_Base4': {
              'FStaffNumber': employeeNumber
            },
            'FBillEntry': []
          }]
        }]
        const billEntry = []
        for (let i = 0; i < this.materialList.length; i++) {
          const ret = this.validNumber(this.materialList[i].MaterialNumber)
          if (!ret.ok) {
            this.$vux.alert.show({
              title: '格式不正确',
              content: ret.message
            })
            return
          }
          billEntry.push({
            'FEntryID': '0',
            'FMaterialId': {
              'FNumber': this.materialList[i].MaterialCode
            },
            'FUnitID': {
              'FNumber': this.materialList[i].UnitNumber
            },
            'FQty': Number.parseFloat(this.materialList[i].MaterialNumber),
            'FSrcStockId': {
              'FNumber': this.$store.getters.grStock[0].StockFNUMBER
            },
            'FSrcStockLocId': {
              'FSRCSTOCKLOCID__FF100017': {
                'FNUMBER': this.$store.getters.grStock[0].FLEXFNUMBER
              }
            },
            'FDestStockId': {
              'FNumber': this.$store.getters.mrStock[0].StockFNUMBER
            },
            'FDestStockLocId': {
              'FDESTSTOCKLOCID__FF100017': {
                'FNUMBER': this.$store.getters.mrStock[0].FLEXFNUMBER
              }
            },
            'FSrcStockStatusId': {
              'FNumber': 'KCZT01_SYS'
            },
            'FDestStockStatusId': {
              'FNumber': 'KCZT01_SYS'
            },
            'FSrcBillNo': this.materialList[i].BillId
          })
        }
        data[0].Model[0].FBillEntry = billEntry
        return materialDocumentsSave(data).then(resp => {
          if (resp.ret.Result.ResponseStatus.IsSuccess === 'True') {
            Promise.all([this.updateBorrow(), this.submit(resp.ret.Result.ResponseStatus.SuccessEntitys[0].Number), this.audit(resp.ret.Result.ResponseStatus.SuccessEntitys[0].Number)]).then(resps => {
              console.log(resp)
              if (resps[0].Result.ResponseStatus.IsSuccess && resps[1].Result.ResponseStatus.IsSuccess && resps[2].Result.ResponseStatus.IsSuccess) {
                const _this = this
                this.$vux.toast.show({
                  text: '保存成功!',
                  onHide() {
                    _this.$router.push({path: '/verification_sheet/list', query: {t: 5}})
                  }
                })
              } else {
                /* const errors0 = resps[0].Result.ResponseStatus.Errors
                const errors1 = resps[1].Result.ResponseStatus.Errors
                let errorMessage = ''
                errors0.forEach(e => {
                  errorMessage += e.Message + '\r\n'
                })
                errors1.forEach(e => {
                  errorMessage += e.Message + '\r\n'
                }) */
                this.$vux.alert.show({
                  title: '保存单据出错!'
//                  content: errorMessage
                })
              }
            })
          } else {
            const errors = resp.ret.Result.ResponseStatus.Errors
            let errorMessage = ''
            errors.forEach(e => {
              errorMessage += e.Message + '\r\n'
            })

            this.$vux.alert.show({
              title: '保存单据出错!',
              content: errorMessage
            })
          }
        })
      },
      updateBorrow() {
        const data = {
          NumberSearch: 'True',
          ValidateFlag: 'True',
          IsDeleteEntry: 'True',
          IsEntryBatchFill: 'True',
          NeedUpDateFields: [],
          NeedReturnFields: [],
          SubSystemId: '',
          Model: [],
          BatchCount: '0'
        }
        for (let i = 0; i < this.materialList.length; i++) {
          const ret = this.validNumber(this.materialList[i].MaterialNumber)
          if (!ret.ok) {
            this.$vux.alert.show({
              title: '第' + i + '行数字格式不正确',
              content: ret.message
            })
            return
          }
        }
        const model = []
        for (let i = 0; i < this.materialList.length; i++) {
          model.push({
            'FID': this.materialList[i].BillId,
            'FBillNo': this.materialList[i].BillNo,
            'FBillEntry': [{
              'FEntryID': this.materialList[i].EntryId,
              FBASEJOINQTY: this.originNumber[i] + Number.parseFloat(this.materialList[i].MaterialNumber),
              'FRECEIVEQTY': this.originNumber[i] + Number.parseFloat(this.materialList[i].MaterialNumber)
            }]
          })
        }
        data.Model = model
        return batchSave(['STK_TransferDirect', data]).then(resp => {
          return Promise.resolve(resp)
        })
      },
      submit(Number) {
        const data = ['STK_TransferDirect', {
          'CreateOrgId': 0,
          'UseOrgId': 0,
          'Numbers': [
            Number
          ]
        }]
        return submit(data).then(r => {
          return Promise.resolve(r)
        })
      },
      audit(Number) {
        const data = ['STK_TransferDirect', {
          'CreateOrgId': 0,
          'UseOrgId': 0,
          'Numbers': [
            Number
          ]
        }]
        return audit(data).then(r => {
          return Promise.resolve(r)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
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
  .btn_box{
    position:fixed;
    bottom:0;
    width:100%;
    color: #fff;
    font-size: 14px;
    z-index: 100;
    text-align: center;
    font-weight: bold;
    .box_left{
      background: #999;
      padding: 10px;
    }
    .box_center{
      background-color: #FCFAF2;
      color:#666;
      padding: 10px;
    }
    .box_right{
      background-color: #5BB75B;
      padding: 10px;
      text-align: center;
    }
  }
</style>
