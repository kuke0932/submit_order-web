<template>
  <div id="app">
    <keep-alive >
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <tabbar slot="bottom" v-if="$route.meta.showTabbar"></tabbar>
  </div>
</template>

<script>
import Tabbar from '@/components/tabbar'
export default {
  components: {
    Tabbar
  },
  name: 'app',
  data() {
    return {
    }
  },
  created() {
    // this.toggleKeyBoard()
  },
  methods: {
    /* 输入框获取焦点 底部按钮消失 失去焦点按钮显示 */
    toggleKeyBoard() {
      const h0 = window.innerHeight
      window.onresize = function() {
        const h1 = window.innerHeight
        const btn = document.getElementById('btn_box')
        if (h1 < h0) {
          btn && (btn.style.display = 'none')
        } else {
          btn && (btn.style.display = 'flex')
        }
      }
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
html, body {
  width: 100%;
}
body {
  background-color: #F5F5F5;
}
a{
  color:#666;
}
a:visited{
  color:#666;
}
/* 登录输入框边框 */
.login_input .vux-no-group-title{
  border:1px solid #ccc;
  border-radius: 30px;
}
/* 导航条固定 */
.vux-header{
  position: fixed!important;
  top:0;
  width: 100%;
  z-index: 100
}
/* 内容margin-top */
.container{
  margin-top: 46px;
}
/* tabber固定底部 */
.weui-tabbar{
  position:fixed!important;
}
/* input 文字右对齐 */
.group .weui-input, .group .weui-textarea{
  text-align: right;
}

/* 二维码大小 */
.code_img img{
  width:13em!important;
  height:13em!important;
}
/* 物料编码 */
.selector_box{
  .vux-no-group-title{
    margin-top: 0;
  }
}
/* cell字体大小 */
.weui-cells{
  font-size: 15px!important;
}
.goods_item .weui-cells{
  font-size: 12px!important;
  .weui-cell{
    padding:7px 15px!important;
  }
}
.goods_list .vux-no-group-title{
  margin-right: 10px!important;
}
/* 搜索框定位 */
.weui-search-bar{
  position: fixed!important;
  width: 100%;
  z-index: 100;
}
/* 借料记录搜索框宽度 */
.borrow_record .weui-search-bar{
  width: 100%!important;
}
.vux-popup-dialog{
  z-index: 9999!important;
}
.groupBBC .weui-cell__ft{
  display: -webkit-box;
  overflow: hidden;
  white-space: normal !important;
  text-overflow: ellipsis;
  word-wrap: break-word;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
</style>
