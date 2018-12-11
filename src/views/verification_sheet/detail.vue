<template>
  <div style="  height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">
        <template v-if="currentType == 1">
          核销详情
        </template>
        <template v-else>
          编辑核销
        </template>
      </x-header>
      <div class="container">
        <group class="bill_header">
          <cell title="单据编号" :value="details.BillNo"></cell>
          <cell title="物料总数" :value="numberFixed2(details.MaterialNumber)"></cell>
          <cell title="提货日期" :value="details.Date"></cell>
          <cell title="规格型号" :value="details.Specification"></cell>
        </group>
        <!--<div class="infor_list" >
          <div class="infor_item" v-for="(item, index) in materialDetail" v-bind:key="index">
            <flexbox class="details" :style="currentType == 1 ? 'padding-left: 20px; align-items: flex-start' : 'padding-left:0; align-items: flex-start'">
              <flexbox-item :span="1" class="details_left" v-if="currentType != 1">
                <label><input type="checkbox" class="item_checkbox" :checked="item.checked || true"></label>
              </flexbox-item>
              <flexbox-item class="details_right">
                <span>物料编码：{{item.MaterialNumber}}</span>
                <flexbox>
                  <flexbox-item>物料名称：{{item.MaterialName}}</flexbox-item>
                  <flexbox-item>规格型号：{{item.SpecifiCation}}</flexbox-item>
                </flexbox>
                <flexbox>
                  <flexbox-item>计量单位：{{item.Unit}}</flexbox-item>
                  <flexbox-item class="count">数量：
                    <input class="input_counts" style="border-bottom: 1px solid;" type="number" :readonly="!(detail.DocumentStatus == 'A' || detail.DocumentStatus == 'D')" @blur="validInput(index)" v-model="item.Number" @change="checkCount">
                  </flexbox-item>
                </flexbox>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
        <flexbox :gutter="0" class="btn_box" id="btn_box" v-if="detail.DocumentStatus == 'A' || detail.DocumentStatus == 'D'">
          <flexbox-item class="box_right" @click.native="save(false)">
            <p>保存</p>
          </flexbox-item>
        </flexbox>-->
      </div>
    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader, Group, XInput, Cell, Flexbox, FlexboxItem, XButton, Swipeout, SwipeoutItem, SwipeoutButton, Datetime } from 'vux'
  import { getIsReturnMaterial } from '@/api/verification_sheet'
  import { save } from '@/api/base'

  export default {
    components: {
      XHeader,
      ViewBox,
      Group,
      XInput,
      Cell,
      Flexbox,
      FlexboxItem,
      XButton,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      Datetime
    },
    data() {
      return {
        currentType: 0,
        details: {},
        department: '',
        materialDetail: [],
        originDate: '',
        selectedDate: '',
        checkedMaterial: {}
      }
    },
    /* beforeRouteEnter(to, from, next) {
      const _back = window.historyStack.peek().fullPath === from.fullPath
      gBack = _back
      next(vm => {
      })
    }, */
    mounted() {
      /* this.detail = {}
      this.department = ''
      this.materialDetail = []
      this.billNo = this.$route.query.billNo
      console.log(this.billNo)
      this.currentType = this.$route.query.currentType
      this.fetchData(this.billNo).then(resp => {
        console.log(resp)
        this.detail = (resp && resp[0]) || {}
        this.detail.Date = this.detail.Date.substr(0, 11)
        this.originDate = this.detail.Date
        this.department = (this.detail.BorrowMaterialDetailsList && this.detail.BorrowMaterialDetailsList[0] && this.detail.BorrowMaterialDetailsList[0].Department) || ''
        const materialDetail = (this.detail.BorrowMaterialDetailsList && this.detail.BorrowMaterialDetailsList[0] && this.detail.BorrowMaterialDetailsList[0].MaterialDetail) || []
        this.materialDetail = materialDetail.map((t) => {
          t.Number = this.numberFixed2(t.Number)
          return t
        })
      })
      const checkedMaterial = this.$store.getters.checkedMaterial
      for (let material in checkedMaterial) {
        this.materialDetail.push(checkedMaterial[material])
      }
      this.$store.dispatch('setCheckedMaterial', {}).then(() => {}) */
      this.details = {}
      this.department = ''
      this.materialDetail = []
      this.billNo = this.$route.query.billNo
      this.currentType = this.$route.query.currentType
      this.fetchData(this.billNo).then(resp => {
        console.log(resp)
        this.details = (resp && resp[0]) || {}
        this.details.Date = this.details.Date.substr(0, 11)
        this.originDate = this.details.Date
      })
    },
    methods: {
      fetchData(billNo) {
        const userId = this.$store.getters.employees[0].FNUMBER
        const organizationID = this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID
        return getIsReturnMaterial(organizationID, userId, [{Status: ''}], '', '', billNo, 1, 1)
      },
      checkCount: function(e) {
        if (e.path[0].value <= 0) {
          e.path[0].value = 0
        }
      },
      validInput(index) {
        const ret = this.validNumber(this.materialDetail[index].Number)
        if (!ret.ok) {
          this.$vux.alert.show({
            title: '出错了!',
            content: ret.message,
            onHide() {
              document.querySelectorAll('.input_counts')[index].focus()
            }
          })
        }
      },
      validNumber(number) {
        if (!number) {
          return {
            ok: false,
            message: '数量不能为空'
          }
        }
        const regex = /(^[0-9]\d*$)|(^[0-9]\d*\.\d{0,2}$)/
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
      save(needAudit = false) {
        const orgID = this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID
        const employeeNumber = this.$store.getters.employees[0].FNUMBER
//        const userID = this.$store.getters.userID
        const deptID = this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].DEPTFNUMBER
        const data = ['STK_TransferDirect', {
          'Creator': '',
          'NeedUpDateFields': [ ],
          'NeedReturnFields': [ ],
          'IsDeleteEntry': 'True',
          'SubSystemId': '',
          'IsVerifyBaseDataField': 'false',
          'IsEntryBatchFill': 'True',
          'Model': {
            'FID': this.detail.BorrowMaterialFid,
            'FBillNo': this.detail.BillNo,
            'FBillTypeID': {
              'FNumber': 'HLDBD01_SYS'
            },
            'FTRANSFERDIRECT': 'RETURN',
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
            'FDATE': this.detail.CareateDate,
            'F_PBPB_Base3': {
              'FNumber': deptID
            },
            'F_PBPB_Base4': {
              'FStaffNumber': employeeNumber
            },
            'FBillEntry': []
          }
        }]
        const billEntry = []
        for (let materialIndex in this.materialDetail) {
          const material = this.materialDetail[materialIndex]
          console.log(materialIndex, material)
          if (material.checked === undefined || material.checked === true) {
            const ret = this.validNumber(material.Number)
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
                'FNumber': material.MaterialNumber
              },
              'FUnitID': {
                'FNumber': material.UnitNumber
              },
              'FQty': material.Number,
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
              }
            })
          }
        }
        data[1].Model.FBillEntry = billEntry

        return save(data).then(resp => {
          if (!needAudit) {
            if (resp.Result.ResponseStatus.IsSuccess) {
              this.$vux.toast.show({
                text: '保存成功!',
                onHide() {
                }
              })
            } else {
              const errors = resp.Result.ResponseStatus.Errors
              let errorMessage = ''
              errors.forEach(e => {
                errorMessage += e.Message + '\r\n'
              })

              this.$vux.alert.show({
                title: '保存单据出错!',
                content: errorMessage
              })
            }
          } else {
            return Promise.resolve(resp)
          }
        })
      },
      dateTimeChange(val) {
        this.detail.CareateDate = val.replace(/:ss/g, ':00')
      }
    }
  }
</script>

<style lang="less" scoped>
  .container{
    .bill_header{
    }
    .infor_list{
      margin-top: 20px;
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
                width: 80px;
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
    .save{
      padding: 20px;
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
