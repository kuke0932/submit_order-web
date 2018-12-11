<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">日报</x-header>
      <div class="container">
        <group>
          <calendar v-model="currentDate" @on-change="onChange" title="查询" placeholder="输入开始日期和结束日期" popup-header-title="请选择" disable-future></calendar>
        </group>
        <template v-if="data.CustName">
          <group title="汇总信息">
            <div class="total_info">
              <p><span>门店名称：</span>{{data.CustName}}</p>
              <p><span>总台数：</span>{{data.AllQty}}</p>
              <p><span>总金额：</span>&yen;{{data.AllAmount}}</p>
            </div>
          </group>
          <group title="明细信息" v-if="data.entry.length > 0">
            <!--<router-link to="/daily/second">-->
            <div class="item_info" v-for="item in data.entry">
              <p><span>物料名称：</span>{{item.MaterialName}}</p>
              <p><span>规则型号：</span>{{item.MaterialSpecification}}</p>
              <p><span>总台数：</span>{{item.Qty}}</p>
              <p><span>总金额：</span>&yen;{{item.Amount}}</p>
            </div>
            <!--</router-link>-->
          </group>
        </template>
        <!--<template v-else>请选择开始和结束日期！</template>-->
      </div>
    </view-box>
  </div>
</template>

<script>
  import { getRB } from '@/api/daily'
  import { ViewBox, XHeader, XButton, Search, Group, Calendar, dateFormat } from 'vux'
  export default {
    components: {
      XHeader,
      XButton,
      Search,
      ViewBox,
      Group,
      Calendar
    },
    data() {
      const date = new Date()
      const today = dateFormat(date, 'YYYY-MM-DD')
      return {
        custNumber: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].CUSTNUMBER) || '',
        results: [],
        value: '',
        currentDate: [today],
        data: {
          'CustName': '',
          'AllQty': 0,
          'AllAmount': 0,
          'entry': [
            {
              'MaterialName': '',
              'MaterialSpecification': '',
              'Qty': 0,
              'Amount': 0
            }
          ]
        }
      }
    },
    mounted() {
      this.fetchData()
    },
    methods: {
      onChange() {
        const that = this
        console.log(1)
        if (that.currentDate.length > 2) {
          that.currentDate.splice(0, that.currentDate.length - 2)
          that.$vux.toast.text('日期最多选两个')
        } else if (that.currentDate.length < 1) {
          that.$vux.toast.show({
            text: '请选择开始和结束日期',
            type: 'warn'
          })
          return
        }
        console.log(2)
        this.currentDate.sort()
        this.fetchData()
        console.log(3)
      },
      fetchData() {
        getRB(this.currentDate[0], this.currentDate[1] || this.currentDate[0], this.custNumber).then(resp => {
          this.data = resp[0]
        })
      },
      onFocus() {
        console.log('on focus')
      },
      onCancel() {
        console.log('on cancel')
      }
    }
  }
</script>
<style scoped lang="less">
  .item_info, .total_info {
    padding:10px 20px;
    color:#666;
    p{
      font-size: 16px;
      span{
        display: inline-block;
        width:6em;
      }
    }
  }
  .item_info{
    border-bottom: 1px solid #ccc
  }
</style>
