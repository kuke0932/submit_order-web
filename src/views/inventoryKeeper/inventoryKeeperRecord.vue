<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}"
                :right-options="{showMore: true}"
                @on-click-more="showMenus = true"
                @on-click-back="back"
                slot="header" >{{ headerType == 'menu1' ? '借料' : headerType == 'menu2' ? '还料' : '核销' }}记录
      </x-header>
      <div class="container">
        <borrow v-if="headerType == 'menu1'"></borrow>
        <return v-if="headerType == 'menu2'"></return>
        <verification v-if="headerType == 'menu3'"></verification>
      </div>
      <div v-transfer-dom>
        <actionsheet :menus="menus" v-model="showMenus" @on-click-menu="clickItemMenu" @on-click-menu-cancel="clickItemCancel"></actionsheet>
      </div>
    </view-box>
  </div>
</template>

<script>
  import {
    ViewBox,
    XHeader,
    Actionsheet,
    TransferDom,
    Search,
    ButtonTab,
    ButtonTabItem,
    Tab,
    TabItem,
    Group,
    Flexbox,
    FlexboxItem,
    XButton,
    Scroller,
    Selector,
    Calendar,
    XInput
  } from 'vux'
  import Borrow from '@/views/inventoryKeeper/borrow'
  import Return from '@/views/inventoryKeeper/return'
  import Verification from '@/views/inventoryKeeper/verification'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Actionsheet,
      ViewBox,
      Search,
      ButtonTab,
      ButtonTabItem,
      Tab,
      TabItem,
      Group,
      Flexbox,
      FlexboxItem,
      XButton,
      Scroller,
      Selector,
      Calendar,
      XInput,
      Borrow,
      Return,
      Verification
    },
    data() {
      return {
        headerType: 'menu1',
        showMenus: false,
        menus: {
          menu1: '借料',
          menu2: '还料',
          menu3: '核销'
        },
        toType: 1
      }
    },
    created() {
    },
    methods: {
      /* 点击菜单 */
      clickItemMenu(menuKey, menuName) {
        this.headerType = menuKey
        /* this.isSearch = false
        this.pageIndex = [1, 1]
        this.dataList = [[], []]
        this.checkedMaterialList = {} */
      },
      /* 点击取消 */
      clickItemCancel() {
        console.log(this.headerType)
      }
    }
  }
</script>

<style lang="less">
  .vux-calendar{
    border-bottom: 1px solid #eee;
  }
</style>
