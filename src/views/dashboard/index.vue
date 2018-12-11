<template>
  <div>
    <x-header :left-options="{preventGoBack: true, showBack: false}" @on-click-back="back" :right-options="{showMore: true}" @on-click-more="showMenus = true">
      首页
    </x-header>
    <div class="container">
      <swiper loop auto :list="baseList"></swiper>
      <!--<swiper loop auto :aspect-ratio="300/800">-->
        <!--<swiper-item class="swiper-demo-img" v-for="(item, index) in imgList" :key="index">-->
          <!--<img :src="item">-->
        <!--</swiper-item>-->
      <!--</swiper>-->
      <div class="nav_menu">
        <flexbox wrap="wrap" :gutter="0">
          <flexbox-item class='flexItem' :span='3' align="center" v-if="isShow('001')">
            <div class="img_box" style="background-color: #89c47d" @click="goSystem({ path: '/customer',query:{ t: 0 } }, '001')">
              <img slot="icon" src="../../assets/icons/report.svg">
            </div>
            <span>报单系统</span>
          </flexbox-item>
          <flexbox-item class='flexItem' :span='3' align="center" v-if="isShow('010')">
            <div class="img_box" style="background-color: #16a085" @click="goSystem({ path: '/collection/workOrder', query:{ t: 4 } }, '010')">
              <img slot="icon" src="../../assets/icons/search.svg">
            </div>
            <span>服务收款</span>
          </flexbox-item>
          <flexbox-item class='flexItem' :span='3' align="center" v-if="isShow('007')">
            <div class="img_box" style="background-color: #f0a45d" @click="goSystem({ path: '/position', query:{ t: 6 } }, '007')">
              <img slot="icon" src="../../assets/icons/daily.svg">
            </div>
            <span>物料位置单</span>
          </flexbox-item>
          <flexbox-item class='flexItem' :span='3' align="center" v-if="isShow('011')">
            <div class="img_box" style="background-color: #f3bc33" @click="goSystem({ path: '/daily', query:{ t: 6 } }, '011')">
              <img slot="icon" src="../../assets/icons/document.svg">
            </div>
            <span>日报系统</span>
          </flexbox-item>
          <flexbox-item class='flexItem' :span='3' align="center" v-if="isShow('011')">
            <div class="img_box" style="background-color: #f3bc33" @click="goSystem({ path: '/report_chart/index' }, '007')">
              <img slot="icon" src="../../assets/icons/report_chart.svg">
            </div>
            <span>报表统计</span>
          </flexbox-item>
          <flexbox-item class='flexItem' :span='3' align="center" v-if="isShow('002')">
            <div class="img_box" style="background-color: #3498db" @click="goSystem({ path: '/borrow_material/record',query:{ t: 1 } }, '002')">
              <img slot="icon" src="../../assets/icons/report.svg">
            </div>
            <span>借料系统</span>
          </flexbox-item>
          <flexbox-item class='flexItem' :span='3' align="center" v-if="isShow('003')">
            <div class="img_box" style="background-color: #2c3e50" @click="goSystem({ path: '/return_material',query:{ t: 3 } }, '003')">
              <img slot="icon" src="../../assets/icons/document.svg">
            </div>
            <span>还料系统</span>
          </flexbox-item>
          <flexbox-item class='flexItem' :span='3' align="center" v-if="isShow('004')">
            <div class="img_box" style="background-color: #e86150" @click="goSystem({ path: '/verification_sheet',query:{ t: 5 } }, '003')">
              <img slot="icon" src="../../assets/icons/search.svg">
            </div>
            <span>使料系统</span>
          </flexbox-item>
          <flexbox-item class='flexItem' :span='3' align="center" v-if="isShow('005')">
            <div class="img_box" style="background-color: #95a5a6" @click="goSystem({ path: '/inventoryKeeper/inventoryKeeperRecord',query:{ t: 2 } }, '005')">
              <img slot="icon" src="../../assets/icons/daily.svg">
            </div>
            <span>库管审核</span>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <group style="display: none">
      <popup-picker :show.sync="showPopupPicker" popup-title="请选择门店" @on-change="shopChange" :data="shopsList"></popup-picker>
    </group>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenus" show-cancel @on-click-menu="clickMenuItem"></actionsheet>
    </div>
  </div>
</template>

<script>
  import { XHeader, Swiper, SwiperItem, Grid, GridItem, Flexbox, FlexboxItem, Group, PopupPicker, Actionsheet, TransferDom } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Swiper,
      SwiperItem,
      Grid,
      GridItem,
      Flexbox,
      FlexboxItem,
      Group,
      PopupPicker,
      Actionsheet,
      TransferDom
    },
    data() {
      const baseList = [{
        url: 'javascript:',
        img: '/static/img/bannerOne.jpg',
        title: ''
      }, {
        url: 'javascript:',
        img: '/static/img/bannerTwo.jpg',
        title: ''
      }, {
        url: 'javascript:',
        img: '/static/img/bannerThree.jpg',
        title: '',
        fallbackImg: '/static/img/bannerOne.jpg'
      }]

      const urlList = baseList.map((item, index) => ({
        url: item.url,
        img: item.img,
        fallbackImg: item.fallbackImg,
        title: `${item.title}`
      }))

      return {
        imgList: [
          '/static/img/bannerOne.jpg',
          '/static/img/bannerTwo.jpg',
          '/static/img/bannerThree.jpg'
        ],
        baseList: baseList,
        img_list: urlList,
        index: 0,
        localAppNumbers: [],
        shopsList: [['']],
        shop: [],
        showPopupPicker: false,
        currentPath: '',
        menus: {
          menu1: '修改密码',
          menu2: '退出登陆'
        },
        showMenus: false
      }
    },
    mounted() {
      const arr = this.$store.getters.organizationsAndAppModel
      for (let i = 0; i < arr.length; i++) {
        this.localAppNumbers.push(arr[i].FNumber)
      }
    },
    methods: {
      shopChange(e) {
        this.shopsList[0].forEach((val, idx) => {
          if (val === e[0]) {
            this.$store.dispatch('setDeptMercCustModelIndex', idx)
            this.$router.push(this.currentPath)
          }
        })
      },
      goSystem(path, appNumber) {
        this.currentPath = path
        let login = window.sessionStorage.getItem('login') || '{}'
        login = JSON.parse(login)
        login.appNumber = appNumber
        this.$store.dispatch('LoginByUsername', login).then(resp => {
          if (this.$store.getters.deptMercCustModel.length > 1) {
            const deptMercCustModel = this.$store.getters.deptMercCustModel
            const shopsList = []
            deptMercCustModel.forEach((val, idx) => {
              shopsList.push(val.MERCFNAME)
            })
            this.$set(this.shopsList, 0, shopsList)
            // this.$vux.toast.text('请选择门店')
            this.showPopupPicker = true
          } else {
            this.$router.push(path)
          }
        }).catch((e) => {
          if (e.Result === 0) {
            this.$vux.alert.show({
              title: '进入模块出错！',
              content: e.Message
            })
          }
        })
      },
      loginOut() {
        const self = this
        self.$vux.confirm.show({
          title: '警告',
          content: '您确定要退出吗',
          onConfirm() {
            self.$store.dispatch('setSubmitDetails', {}).then(() => {})
            self.$store.dispatch('setCheckedMaterial', {}).then(() => {})
            self.$store.dispatch('setGoodsList', {}).then(() => {})
            self.$store.dispatch('LogOut', {}).then(() => {
              self.$router.replace({ path: '/login' })
            }).catch(() => {})
          }
        })
      },
      clickMenuItem(key, val) {
        if (key === 'menu2') {
          this.loginOut()
        } else if (key === 'menu1') {
          this.$router.replace({path: '/login/changePwd'})
        }
      },
      isShow(appNumber) {
        return this.isAuthority(appNumber, this.localAppNumbers)
//        return true
      }
    }
  }
</script>

<style scoped lang="less">
  .nav_menu{
    padding:20px 10px 10px 10px;
    background-color: #fff;
    .flexItem{
      margin-bottom: 10px;
    }
    span{
      font-size: 12px;
      display: block;
    }
    .img_box{
      width:3.4em;
      height:3.4em;
      display: table-cell;
      vertical-align: middle;
      text-align: center;
      border-radius: 50%;
      img{
        width:2em;
        height:2em;
      }
    }
  }
  .swiper-demo-img img {
    width: 100%;
  }
</style>
