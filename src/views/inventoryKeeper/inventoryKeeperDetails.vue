<template>
  <div style="  height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">
          {{ fromType == 0 ? '借料' : fromType == 1 ? '还料' : '核销'}}详请
      </x-header>
      <div class="container">
        <group class="bill_header">
          <cell title="单据编号" :value="detail.BillNo"></cell>
          <cell title="物料总数" :value="numberFixed2(detail.MaterialNumber)"></cell>
          <cell title="提货日期" :value="detail.Date"></cell>
          <cell title="物料位置" :value="detail.MaterialPosition"></cell>
          <cell title="规格型号" :value="detail.Specification"></cell>
          <cell title="提货人" :value="detail.ConsigName"></cell>
        </group>
        <!--<div class="infor_list" >
          <div class="infor_item" style="padding-left: 20px " v-for="(item, index) in materialDetail" v-bind:key="index">
            <flexbox class="details">
              <flexbox-item class="details_right">
                <span>物料编码：{{item.MaterialNumber}}</span>
                <flexbox>
                  <flexbox-item>物料名称：{{item.MaterialName}}</flexbox-item>
                  <flexbox-item>规格型号：{{item.SpecifiCation}}</flexbox-item>
                </flexbox>
                <flexbox>               &lt;!&ndash;item.MeasurementCompany &ndash;&gt;
                  <flexbox-item>计量单位：{{item.Unit}}</flexbox-item>
                  <flexbox-item class="count">
                    数量：{{numberFixed2(item.Number)}}
                  </flexbox-item>
                </flexbox>
              </flexbox-item>
            </flexbox>
          </div>
        </div>-->
      </div>
    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader, Group, XInput, Cell, Flexbox, FlexboxItem, XButton } from 'vux'
//  import { retMainList } from '@/api/borrow'
//  import { retMainList as retReturnList } from '@/api/return'

  export default {
    components: {
      XHeader,
      ViewBox,
      Group,
      XInput,
      Cell,
      Flexbox,
      FlexboxItem,
      XButton
    },
    data() {
      return {
        fromType: 0,
        detail: {},
        department: '',
        materialDetail: []
      }
    },
    mounted() {
      this.detail = this.$route.params.borrowDetails
      this.fromType = this.$route.params.fromType
      /* this.department = ''
      this.materialDetail = []
      this.fromType = this.$route.params.fromType
      this.fetchData(this.billNo).then(resp => {
        console.log(resp)
        this.detail = (resp && resp[0]) || {}
        this.detail.Date = this.detail.Date.substr(0, 11)
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
      this.$store.dispatch('setCheckedMaterial', {}).then(() => {})
      console.log(this.materialDetail) */
    },
    methods: {
      /* fetchData(billNo) {
        const userId = this.$store.getters.employees[0].FNUMBER
        const organizationID = this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID
        if (this.fromType === 0) {
          return retMainList(organizationID, userId, [{Status: ''}], '', '', billNo, 1, 1)
        } else {
          return retReturnList(organizationID, userId, [{Status: ''}], billNo, 1, 1)
        }
      } */
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
                width: 20px;
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
    bottom:54px;
    right:2px;
    width:200px;
  }
</style>
