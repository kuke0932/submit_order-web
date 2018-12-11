<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">新增借料
        <router-link :to="{path: '/borrow_material/select', query: {from: 'add'}}" slot="right">选择物料</router-link>
        <router-link :to="{path: '/borrow_material/select', query: {from: 'add'}}" slot="right">
          <img src="../../assets/icons/qrcode.svg" style="vertical-align: middle" width="20">
        </router-link>
      </x-header>
      <div class="container" :style="'height:' + screenHeight + 'px'">
        <group>
          <calendar disable-past title="提货日期" placeholder="请选择时间" v-model="FDATE"></calendar>
        </group>
        <div class="infor_list" >
          <swipeout v-for="item in checkedMaterial" v-bind:key="item.MaterialId">
            <swipeout-item transition-mode="follow">
              <div slot="right-menu">
                <swipeout-button @click.native="deleteItem(item.MaterialId)" type="warn">删除</swipeout-button>
              </div>
              <div slot="content" class="demo-content vux-1px-tb">
                <div class="infor_item">
                  <flexbox class="details">
                    <flexbox-item :span="1" class="details_left">
                      <label><input type="checkbox" class="item_checkbox" :checked="item.checked"></label>
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
                          <img @click="minusCount(item.MaterialId)" src="../../assets/icons/minus.svg">
                          <input type="number" style="border-bottom: 1px solid #ccc" class="input_counts"  @blur="validInput(item.MaterialId)" v-model="item.Number" @change="checkCount">
                          <img @click="plusCount(item.MaterialId)" src="../../assets/icons/plus.svg">&nbsp;{{item.Unit}}
                        </flexbox-item>
                      </flexbox>
                    </flexbox-item>
                  </flexbox>
                </div>
              </div>
            </swipeout-item>
          </swipeout>
        </div>
        <button-tab class="btn_box">
          <button-tab-item @on-item-click="save()">保存</button-tab-item>
        </button-tab>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { Calendar, ViewBox, XHeader, Group, XInput, Cell, ButtonTab, ButtonTabItem, Flexbox, FlexboxItem, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
  import { materialDocumentsSave, submit } from '@/api/base'

  export default {
    components: {
      XHeader,
      ViewBox,
      Group,
      XInput,
      Calendar,
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
        screenHeight: document.documentElement.clientHeight,
        checkedMaterial: {},
        FDATE: ''
      }
    },
    activated() {
      this.checkedMaterial = this.$store.getters.checkedMaterial
    },
    created() {

    },
    mounted() {
      // this.checkedMaterial = this.$store.getters.checkedMaterial
    },
    methods: {
      plusCount: function(materialId) {
        let goods = this.checkedMaterial[materialId]
        goods.Number = Number.parseFloat(goods.Number || 0) + 1
        if (goods.Number > goods.StockQty) {
          goods.Number = goods.StockQty
        }
        const newObj = {}
        newObj[materialId] = goods
        this.checkedMaterial = Object.assign({}, this.checkedMaterial, newObj)
      },
      minusCount: function(materialId) {
        let goods = this.checkedMaterial[materialId]
        goods.Number = Number.parseFloat(goods.Number || 0)
        if (goods.Number >= 1) {
          goods.Number -= 1
          const newObj = {}
          newObj[materialId] = goods
          this.checkedMaterial = Object.assign({}, this.checkedMaterial, newObj)
        }
      },
      validInput(key) {
        if (this.checkedMaterial[key].Number > parseFloat(this.checkedMaterial[key].StockQty)) {
          this.checkedMaterial[key].Number = parseFloat(this.checkedMaterial[key].StockQty)
        }
        const ret = this.validNumber(this.checkedMaterial[key].Number)
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
      deleteItem(materialId) {
        delete this.checkedMaterial[materialId]
        this.checkedMaterial = Object.assign({}, this.checkedMaterial)
        this.$store.dispatch('setCheckedMaterial', this.checkedMaterial).then(() => {})
      },
      save(needAudit = false) {
        const orgID = this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID
        const employeeNumber = this.$store.getters.employees[0].FNUMBER
        const deptID = this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].DEPTFNUMBER
        if (!this.FDATE) {
          this.$vux.toast.text('请输入提货日期')
          return
        }
        if (JSON.stringify(this.checkedMaterial) === '{}') {
          this.$vux.toast.text('请选择物料')
          return
        }
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
              'FID': '0',
              'FBillNo': '',
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
              'FDATE': this.FDATE,
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
        for (let materialKey in this.checkedMaterial) {
          const material = this.checkedMaterial[materialKey]
          if (material.checked) {
            const ret = this.validNumber(material.Number)
            if (!ret.ok) {
              this.$vux.alert.show({
                title: '出错了!',
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
                'FNumber': this.$store.getters.mrStock[0].StockFNUMBER
              },
              'FSrcStockLocId': {
                'FSRCSTOCKLOCID__FF100017': {
                  'FNUMBER': this.$store.getters.mrStock[0].FLEXFNUMBER
                }
              },
              'FDestStockId': {
                'FNumber': this.$store.getters.grStock[0].StockFNUMBER
              },
              'FDestStockLocId': {
                'FDESTSTOCKLOCID__FF100017': {
                  'FNUMBER': this.$store.getters.grStock[0].FLEXFNUMBER
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
        data[0].Model[0].FBillEntry = billEntry

        return materialDocumentsSave(data).then(resp => {
          if (!needAudit) {
            if (resp.ret.Result.ResponseStatus.IsSuccess === 'True') {
              const _this = this
              this.$vux.toast.show({
                text: '保存成功!',
                onHide() {
                  _this.$store.dispatch('setCheckedMaterial', {}).then(() => {})
                  _this.checkedMaterial = Object.assign({}, {})
                  _this.$router.push({path: '/borrow_material/record', query: {t: 1}})
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
          } else {
            return Promise.resolve(resp)
          }
        })
      },
      submit() {
        this.materialDocumentsSave(true).then(resp => {
          if (resp.Result.ResponseStatus.IsSuccess) {
            const data = ['STK_TransferDirect', {
              'CreateOrgId': 0,
              'UseOrgId': 0,
              'Numbers': [
                resp.Result.Number
              ]
            }]
            submit(data).then(r => {
              const _this = this
              if (r.Result.ResponseStatus.IsSuccess) {
                this.$vux.toast.show({
                  text: '保存并提交成功!',
                  onHide() {
                    _this.$store.dispatch('setCheckedMaterial', {}).then(() => {})
                    _this.checkedMaterial = Object.assign({}, {})
                    _this.$router.push({path: '/borrow_material/record', query: {t: 1}})
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
                    _this.$store.dispatch('setCheckedMaterial', {}).then(() => {})
                    _this.checkedMaterial = Object.assign({}, {})
                  }
                })
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
        }).catch(e => {
          console.log(e)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .container {
    margin-bottom: 80px;
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
    color: #1AAD19
  }
</style>
