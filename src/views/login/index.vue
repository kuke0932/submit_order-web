<template>
  <div class="container">
    <!--
      如果发布到正式系统需要把这行注释掉
    -->
    <!-- <div>
      <H1 class="info">测试系统</H1>
    </div> -->
    <div class="logo_box">
      <img class="logo" src="../../assets/nanhua.png">
    </div>
    <x-form ref="form" >
      <x-form-item prop="mobile" :wrapGroup="true" class="login_input">
        <x-input mask="99999999999" v-model="form.mobile" :max="11"  placeholder="请输入您的手机号">
          <img slot="label" style="padding-right:10px;display:block;" src="../../assets/icons/phone.svg" width="22" height="22">
        </x-input>
      </x-form-item>
      <x-form-item prop="password" :wrapGroup="true" class="login_input">
        <x-input type="password" v-model="form.password" :min="1" :max="12" is-type="password" placeholder="请输入您的密码">
          <img slot="label" style="padding-right:10px;display:block;" src="../../assets/icons/lock.svg" width="22" height="22">
        </x-input>
      </x-form-item>
      <flexbox :gutter="0" style="padding-left: 10px;">
        <flexbox-item>
          <label for="rememberPwd" style="font-size: 14px;color: #666;">
          <input type="checkbox" id="rememberPwd" name="rememberPwd" v-model="savePassword" @change="judgeCheck" :checked="savePassword" style="width: 14px;height: 14px;vertical-align: middle">
          记住密码
          </label>
        </flexbox-item>
        <flexbox-item>
          <p style="color:#e64340;float:right;margin: 10px;font-size: 14px" @click="forgotPwd">忘记密码？</p>
        </flexbox-item>
      </flexbox>
      <x-button type="primary" @click.native="login" style="margin-top: 20px;">登录</x-button>
    </x-form>
  </div>
</template>

<script>
  import { Group, Cell, XInput, XButton, XNumber, PopupPicker, Flexbox, FlexboxItem } from 'vux'
  import XForm from '@/components/XForm'
  import XFormItem from '@/components/XFormItem'
  import { init } from '@/api/login'
  import Vue from 'vue'
  import Cookies from 'js-cookie'
  export default {
    components: {
      PopupPicker,
      Group,
      Cell,
      XInput,
      XButton,
      XForm,
      XFormItem,
      Flexbox,
      FlexboxItem,
      XNumber
    },
    data() {
      return {
        form: {
          mobile: '',
          password: '',
          appNumber: ''
        },
        savePassword: false
      }
    },
    mounted() {
      if (!URL.createObjectURL) {
        Vue.$vux.alert.show({
          content: '您的系统版本太低，会导致系统部分功能不可用，请升级操作系统后，重新登录！'
        })
      }
      this.savePassword = Cookies.get('savePassword') || false
      this.form.mobile = Cookies.get('mobile') || ''
      this.form.password = Cookies.get('password') || ''
    },
    methods: {
      judgeCheck() {
        console.log(this.savePassword)
      },
      login() {
        const that = this
        if (that.savePassword === true || that.savePassword === 'true') {
          Cookies.set('mobile', that.form.mobile, { expires: 30 })
          Cookies.set('password', that.form.password, { expires: 30 })
          Cookies.set('savePassword', that.savePassword, { expires: 30 })
        } else {
          Cookies.remove('mobile')
          Cookies.remove('password')
          Cookies.remove('savePassword')
        }
        init().then((resp) => {
          this.$store.dispatch('LoginByUsername', this.form).then(() => {
            window.sessionStorage.setItem('login', JSON.stringify(this.form))
            this.$router.push({ path: '/' })
          }).catch((e) => {
            if (e.Result === 0) {
              Vue.$vux.alert.show({
                title: '登录错误！',
                content: e.Message
              })
            }
          })
        })
        /* this.$refs.form.valid().then(() => {
          init().then((resp) => {
            console.log(resp, 1)
            this.$store.dispatch('LoginByUsername', this.form).then(() => {
              this.$router.push({ path: '/' })
            }).catch(() => {
            })
          })
        }).catch(() => {
          console.log('error')
        }) */
      },
      forgotPwd() {
        this.$vux.toast.text('请联系内勤，修改密码！')
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
  /* margin-top: 80px; 2018-08-10 张浩注释*/
  margin-top: 40px;
}
.logo {
  width: 150px;
  height: 150px
}
.info{
  text-align: center;
  color: red;
}
</style>
