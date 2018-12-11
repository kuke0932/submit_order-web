<template>
  <div style="  height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">
        <template v-if="currentType == 1">
          还料详情
        </template>
        <template v-else>
          编辑还料
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
          <div class="infor_item">
            <flexbox class="details">
              <flexbox-item class="details_right">
                <flexbox :gutter="0" align="left">
                  <flexbox-item :span="3">&nbsp;&nbsp;单据编号：</flexbox-item>
                  <flexbox-item>{{details.BillNo}}</flexbox-item>
                </flexbox>
                <flexbox :gutter="0" align="left">
                  <flexbox-item :span="3">&nbsp;&nbsp;提货日期：</flexbox-item>
                  <flexbox-item>{{details.Date}}</flexbox-item>
                </flexbox>
                <flexbox :gutter="0" align="left">
                  <flexbox-item :span="3">&nbsp;&nbsp;规格型号：</flexbox-item>
                  <flexbox-item>{{details.Specification}}</flexbox-item>
                </flexbox>
                <flexbox :gutter="0" align="left" class="count">
                  <flexbox-item :span="3">&nbsp;&nbsp;数量：</flexbox-item>
                  <flexbox-item>
                    &lt;!&ndash;<img @click="minusCount()" src="../../assets/icons/minus.svg">&ndash;&gt;
                    <input class="input_counts" style="border-bottom: 1px solid #ccc;" type="number" readonly @blur="validInput(index)" :value="numberFixed2(details.MaterialNumber)" @change="checkCount">
                    &lt;!&ndash;<img @click="plusCount()" src="../../assets/icons/plus.svg">&ndash;&gt;
                  </flexbox-item>
                </flexbox>
              </flexbox-item>
            </flexbox>
          </div>
        </div>-->
        <!--<flexbox :gutter="0" class="btn_box" id="btn_box">
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
  import { getIsReturnMaterial } from '@/api/return'
  import { materialDocumentsSave } from '@/api/base'

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
    mounted() {
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
     /* plusCount: function() {
        let goods = this.details
        console.log(goods)
        goods.MaterialNumber = Number.parseFloat(goods.MaterialNumber || 0) + 1
      },
      minusCount: function() {
        let goods = this.details
        goods.MaterialNumber = Number.parseFloat(goods.MaterialNumber || 0)
        if (goods.MaterialNumber >= 1) {
          goods.MaterialNumber -= 1
          if (goods.MaterialNumber <= 0) {
            goods.MaterialNumber = 1
          }
        }
      }, */
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
      onButtonClick(type) {
        alert('on button click ' + type)
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
      save(needAudit = false) {
        const that = this
        const orgID = this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID
        const employeeNumber = this.$store.getters.employees[0].FNUMBER
        const deptID = this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].DEPTFNUMBER
        const data = [{
          'Creator': '',
          'NeedUpDateFields': [ ],
          'NeedReturnFields': [ ],
          'IsDeleteEntry': 'True',
          'SubSystemId': '',
          'IsVerifyBaseDataField': 'false',
          'IsEntryBatchFill': 'True',
          'Model': [
            {
              'FID': this.details.BorrowMaterialFid,
              'FBillNo': this.details.BillNo,
              'FBillTypeID': {
                'FNumber': 'JLDBD01_SYS'
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
              'FDATE': this.details.Date,
              'F_PBPB_Base3': {
                'FNumber': deptID
              },
              'F_PBPB_Base4': {
                'FStaffNumber': employeeNumber
              },
              'FBillEntry': []
            }
          ]
        }]
        const billEntry = []
        const ret = this.validNumber(this.details.MaterialNumber)
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
            'FNumber': this.details.MaterialNumber
          },
          'FUnitID': {
            'FNumber': this.details.MaterialNumber
          },
          'FQty': '',
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

        data[0].Model[0].FBillEntry = billEntry

        return materialDocumentsSave(data).then(resp => {
          if (!needAudit) {
            if (resp.Result.ResponseStatus.IsSuccess) {
              this.$vux.toast.show({
                text: '保存成功!',
                onHide() {
                  that.$router.replace({path: './isReturn?t=3'})
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
