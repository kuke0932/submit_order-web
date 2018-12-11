<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header>生成BBC</x-header>
      <div class="container" style="font-size: 14px">
        <group class="group groupBBC" label-width="80px" title="生成BBC信息" >
          <cell title="业务类型" v-model="YWLX.FNAME" is-link :link="{path: '/submit/select', query: {type: 'YWLX'}}"></cell>
          <cell title="配送方式" v-model="PSFS.FNAME" is-link :link="{path: '/submit/select', query: {type: 'PSFS'}}"></cell>
          <cell title="支付方式" v-model="ZFFS.FNAME" is-link :link="{path: '/submit/select', query: {type: 'ZFFS'}}"></cell>
          <cell title="收货地址" align-items="" v-model="SHDZ.FullAddress" is-link :link="{path: '/submit/select', query: {type: 'SHDZ'}}"></cell>
        </group>
      </div>
      <flexbox :gutter="0" class="btn_box" id="btn_box">
        <flexbox-item class="box_center"  @click.native="confirm">
          <p>确认</p>
        </flexbox-item>
        <flexbox-item class="box_right" @click.native="back">
          <p>返回</p>
        </flexbox-item>
      </flexbox>
    </view-box>
  </div>
</template>

<script>
  import Uploader from 'vux-uploader'
  import { SaveBBCORDER } from '@/api/submit_order'
  import {
    ViewBox,
    XHeader,
    Group,
    Cell,
    XInput,
    PopupPicker,
    XButton,
    Flexbox,
    FlexboxItem,
    XTextarea,
    Calendar
  } from 'vux'
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
      XTextarea,
      Calendar,
      Uploader
    },
    data() {
      return {
        FID: '',
        YWLX: { FNAME: '点击选择业务类型' },
        PSFS: { FNAME: '点击选择配送方式' },
        ZFFS: { FNAME: '点击选择支付方式' },
        SHDZ: { FullAddress: '点击选择收货地址' }
      }
    },
    deactivated() {

    },
    activated() {
      this.YWLX = (this.$store.getters.submitDetails && this.$store.getters.submitDetails['YWLX']) || { FNAME: '点击选择业务类型' }
      this.PSFS = (this.$store.getters.submitDetails && this.$store.getters.submitDetails['PSFS']) || { FNAME: '点击选择配送方式' }
      this.ZFFS = (this.$store.getters.submitDetails && this.$store.getters.submitDetails['ZFFS']) || { FNAME: '点击选择支付方式' }
      this.SHDZ = (this.$store.getters.submitDetails && this.$store.getters.submitDetails['SHDZ']) || { FullAddress: '点击选择收货地址' }
    },
    mounted() {

    },
    methods: {
      // 返回
      back() {
        history.go(-1)
      },
      // 确认
      confirm() {
        if (!this.YWLX.FENTRYID) {
          this.$vux.toast.text('请选择业务类型')
          return
        }
        if (!this.PSFS.ID) {
          this.$vux.toast.text('请选择配送方式')
          return
        }
        if (!this.ZFFS.ID) {
          this.$vux.toast.text('请选择支付方式')
          return
        }
        if (!this.SHDZ.FullAddressId) {
          this.$vux.toast.text('请选择收货地址')
          return
        }
        this.FID = this.$route.query.FID
        const jsonData = {
          'Fid': this.FID, // 销售订单FID
          'FBusinessTypeID': this.YWLX.FENTRYID, // 业务类型ID
          'FBusinessTypeName': this.YWLX.FNAME, // 业务类型名称
          'PostWay': this.PSFS.ID, // 配送方式ID
          'PayWay': this.ZFFS.ID, // 付款方式ID
          'FullAddressId': this.SHDZ.FullAddressId, // 收货地址ID
          'FullAddress': this.SHDZ.FullAddress // 收货地址名称
        }
        const that = this
        SaveBBCORDER(jsonData).then(resp => {
          if (resp[0].IsSuccess) {
            that.$vux.toast.show({
              text: 'BBC上传成功',
              onHide() {
                that.$store.dispatch('setSubmitDetails', {}).then(() => {})
                that.$router.replace({ path: '/submit/sellBill', query: {t: 0} })
              }
            })
          } else {
            const errorMessage = resp[0].Message
            that.$vux.alert.show({
              title: 'BBC上传失败',
              content: errorMessage
            })
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .container{
    margin-top: 50px;
    padding-bottom: 40px;
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
