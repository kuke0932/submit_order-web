<template>
  <div class="container">
    <div class="logo_box">
      <img class="logo" src="../../assets/nanhua.png">
    </div>
    <x-form ref="form" >
      <x-form-item prop="mobile" :wrapGroup="true" class="login_input">
        <popup-picker title="选择门店" :data="storeList" v-model="currentStore" placeholder="请选择门店"></popup-picker>
      </x-form-item>
      <x-button type="primary" @click.native="login" style="margin-top: 20px;">登录</x-button>
    </x-form>
  </div>
</template>

<script>
  import { XButton, XNumber, PopupPicker, Flexbox, FlexboxItem } from 'vux'
  import XForm from '@/components/XForm'
  import XFormItem from '@/components/XFormItem'

  export default {
    components: {
      PopupPicker,
      XButton,
      XForm,
      XFormItem,
      Flexbox,
      FlexboxItem,
      XNumber
    },
    data() {
      return {
        currentStore: ['国美'],
        storeList: [['国美', '苏宁', '北国']]
      }
    },
    mounted() {
    },
    methods: {
      login() {
      }
    }
  }
</script>

<style scoped>
.container{
  padding:0 30px;
}
.logo_box {
  text-align: center;
  margin-top: 80px;
}
.logo {
  width: 150px;
  height: 150px
}
</style>
