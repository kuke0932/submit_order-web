<template>
    <div style="height:100%;">
        <view-box ref="viewBox">
            <x-header :left-options="{preventGoBack: true}" @on-click-back="back">销售订单详情</x-header>
        </view-box>
        <div class="container" style="font-size: 14px;margin-top:5px">
            <template v-if="data.FBillNo">
                <group title="流程进度" title-color="#09BB07">
                  <div>
                    <flow orientation="vertical" style="height:250px;">
                      <!--销售订单新增-->
                      <flow-state state="1" :title="flowInfo.new" :is-done="flowInfo.new_done"></flow-state>
                      <flow-line :is-done="flowInfo.new_line_done" :tip="flowInfo.new_line_state"></flow-line>
                      <!--是否已经传递到MOA-->
                      <flow-state state="2" :is-done="flowInfo.new_line_done" :title="flowInfo.moa"></flow-state>
                      <flow-line :tip="flowInfo.moa_line_state" :is-done="flowInfo.moa_line_done"></flow-line>
                      <!--是否已回传五联单号-->
                      <flow-state state="3" :is-done="flowInfo.five_code_done" :title="flowInfo.five_code"></flow-state>
                      <flow-line :tip="flowInfo.five_code_line_state" :is-done="flowInfo.five_code_line_done"></flow-line>
                      <!--是否动销修改-->
                      <flow-state state="4" :is-done="flowInfo.change_done" :title="flowInfo.change"></flow-state>
                      <flow-line :tip="flowInfo.change_line_state" :is-done="flowInfo.change_line_done"></flow-line>
                      <!--是否动销删除-->
                      <flow-state state="5" :is-done="flowInfo.return_done" :title="flowInfo.return"></flow-state>
                    </flow>
                  </div>
                </group>
                <group title="单据头信息" title-color="#2E64FE">
                    <div class="total_info">
                    <p><span>单据编码：</span>{{data.FBillNo}}</p>
                    <p><span>MOA是否已传递：</span>{{data.MoaSend}}</p>
                    <p><span>MOA传递时间：</span>{{data.MoaSendDate}}</p>
                    <!-- <p><span>MOA五联单号返回时间：</span>{{data.MoaReturnTime}}</p> -->
                    
                    </div>
                </group>
                <group title="明细信息" title-color="#2E64FE" v-if="data.entry.length > 0">
                    <div class="item_info" v-for="item in data.entry">
                        <p><span>物料规格型号：</span>{{item.Fspecification}}</p>
                        <p><span>五联单号：</span>{{item.FiveCode}}</p>
                        <p><span>明细MOA是否退货：</span>{{item.ReturnState}}</p>
                    </div>
                </group>
                <group title="回传信息" style="color:red">
                  <x-textarea :max="2000"  :show-counter="false" :height="200" :rows="8" :cols="30" v-model="data.ErrorNote"></x-textarea>
                </group>
            </template>
        </div>
    </div>
</template>
<script>
import { ViewBox, XHeader, Group, XTextarea, Flow, FlowState, FlowLine } from 'vux'
import {GetInfoOfSalOrder, GetFlowInfo} from '@/api/submit_order'
export default {
  components: {
    ViewBox,
    XHeader,
    Group,
    XTextarea,
    Flow,
    FlowState,
    FlowLine
  },
  data() {
    return {
      detail: {},
      data: {
        'FBillNo': '',
        'MoaSend': '',
        'MoaSendDate': '',
        'MoaReturnTime': '',
        'ChangeBillNo': '',
        'IsHaveBBC': '',
        'ErrorNote': '',
        'entry': [
          {
            'Fspecification': '',
            'FiveCode': '',
            'ReturnState': ''
          }
        ]
      },
      flowInfo: {
        'new': '订单新增',
        'new_done': false,
        'new_line_done': false,
        'new_line_state': '',
        'moa': 'MOA已传递',
        'moa_done': false,
        'moa_line_done': false,
        'moa_line_state': '',
        'five_code': '五联单号',
        'five_code_done': false,
        'five_code_line_done': false,
        'five_code_line_state': '',
        'change': '动销修改',
        'change_done': false,
        'change_line_done': false,
        'change_line_state': '',
        'return': '动销退货',
        'return_done': false,
        'return_line_done': false,
        'return_line_state': ''
      },
      retData: {
        'count': 0
      }
    }
  },
  mounted() {
    this.detail = this.$route.params.item
    this.GetInfo(this.detail.FID)
    this.GetFlow(this.detail.FID)
    // console.log(this.detail.FID)
  },
  methods: {
    GetInfo() {
    //   const that = this
      GetInfoOfSalOrder(this.detail.FID).then(resp => {
        this.data = resp
        console.log(resp)
      })
    },
    GetFlow() {
      GetFlowInfo(this.detail.FID).then(resp => {
        this.retData.count = resp
        console.log(resp)
        if (this.retData.count === 1) {
          this.flowInfo.new_done = true
          this.flowInfo.new_line_state = '正在传递MOA'
        } else if (this.retData.count === 2) {
          this.flowInfo.new_done = true
          this.flowInfo.new_line_done = true
          this.flowInfo.moa_done = true
          this.flowInfo.moa_line_state = '等待回传五联单号'
        } else if (this.retData.count === 3) {
          this.flowInfo.new_done = true
          this.flowInfo.new_line_done = true
          this.flowInfo.moa_done = true
          this.flowInfo.moa_line_done = true
          this.flowInfo.five_code_done = true
        } else if (this.retData.count === 4) {
          this.flowInfo.new_done = true
          this.flowInfo.new_line_done = true
          this.flowInfo.moa_done = true
          this.flowInfo.moa_line_done = true
          this.flowInfo.five_code_done = true
          this.flowInfo.five_code_line_done = true
          this.flowInfo.change_done = true
        } else if (this.retData.count === 5) {
          this.flowInfo.new_done = true
          this.flowInfo.new_line_done = true
          this.flowInfo.moa_done = true
          this.flowInfo.moa_line_done = true
          this.flowInfo.five_code_done = true
          this.flowInfo.five_code_line_done = true
          this.flowInfo.change_done = true
          this.flowInfo.change_line_done = true
          this.flowInfo.return_done = true
        }
      })
    }
  }
}
</script>
<style scoped lang="less">
  .item_info, .total_info {
    padding:20px 20px;
    color:#666;
    p{
      font-size: 16px;
      span{
        display: inline-block;
        width:10em;
      }
    }
  }
  .item_info{
    border-bottom: 1px solid #ccc
  }
</style>