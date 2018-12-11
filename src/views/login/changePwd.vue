<template>
  <div>
    <x-header>修改密码</x-header>
    <div class="container" :style="'height:' + (screenHeight - 88) + 'px'">
      <group>
        <x-input title="手机号" mask="99999999999" :max="11" placeholder="请输入手机号" v-model="phone"></x-input>
        <x-input title="原密码" type="password" placeholder="请输入原密码" v-model="oldPwd"></x-input>
        <x-input title="新密码" type="password" placeholder="请输入新密码" v-model="newPwd"></x-input>
      </group>
      <flexbox :gutter="0" id="btn_box">
        <flexbox-item class="box_left"  @click.native="confirmChange">
          <p>确认修改</p>
        </flexbox-item>
        <flexbox-item class="box_right" @click.native="backToLogin">
          <p>返回</p>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
  import { changePwd } from '@/api/login'
  import { XHeader, XButton, XNumber, Flexbox, FlexboxItem, Group, XInput } from 'vux'

  export default {
    components: {
      XHeader,
      XButton,
      Flexbox,
      FlexboxItem,
      Group,
      XInput,
      XNumber
    },
    data() {
      return {
        screenHeight: document.documentElement.clientHeight,
        phone: '',
        oldPwd: '',
        newPwd: ''
      }
    },
    mounted() {
    },
    methods: {
      confirmChange() {
        const telReg = /^[1][0-9]{10}$/
        if (!this.phone) {
          this.$vux.toast.text('请输入手机号')
          return
        }
        if (!telReg.test(this.phone)) {
          this.$vux.toast.text('手机号格式错误')
          return
        }
        if (!this.oldPwd) {
          this.$vux.toast.text('请输入原密码')
          return
        }
        if (!this.newPwd) {
          this.$vux.toast.text('请输入新密码')
          return
        }
        changePwd(this.phone, this.oldPwd, this.newPwd).then(resp => {
          const that = this
          if (resp[0].IsSuccess) {
            that.$vux.toast.show({
              text: '修改成功',
              onHide() {
                that.$store.dispatch('setSubmitDetails', {}).then(() => {})
                that.$store.dispatch('setCheckedMaterial', {}).then(() => {})
                that.$store.dispatch('setGoodsList', {}).then(() => {})
                that.$store.dispatch('LogOut', {}).then(() => {
                  that.$router.replace({ path: '/login' })
                }).catch(() => {})
              }
            })
          } else {
            const errorMessage = resp[0].Message
            that.$vux.alert.show({
              title: '修改出错',
              content: errorMessage
            })
          }
        })
      },
      backToLogin() {
        history.go(-1)
      }
    }
  }
</script>

<style scoped lang="less">
.container{
}
#btn_box{
  position:fixed;
  bottom:0;
  width:100%;
  color: #fff;
  font-size: 14px;
  z-index: 100;
  text-align: center;
  font-weight: bold;
  .box_left{
    background: #5BB75B;
    padding: 10px;
  }
  .box_center{
    background-color: #FCFAF2;
    color:#666;
    padding: 10px;
  }
  .box_right{
    background-color: #999;
    padding: 10px;
    text-align: center;
  }
}
</style>
