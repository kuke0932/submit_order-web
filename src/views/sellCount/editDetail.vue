<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header>动销修改详情</x-header>
      <div class="container" style="font-size: 14px">
        <group class="group">
          <x-input readonly title="顾客姓名"></x-input>
          <x-input readonly title="顾客电话" :max="11" ></x-input>
          <x-input readonly title="申请时间"></x-input>
          <x-input readonly title="审批时间"></x-input>
          <x-input readonly title="审批结果"></x-input>
          <x-textarea readonly title="审批意见" :max="100"></x-textarea>
          <x-textarea readonly title="修改内容" :max="100"></x-textarea>
        </group>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader, Group, XInput, XTextarea } from 'vux'
  export default {
    components: {
      ViewBox,
      XHeader,
      Group,
      XInput,
      XTextarea
    },
    data() {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="less">
  .container{
    margin-top: 50px;
  }
</style>
