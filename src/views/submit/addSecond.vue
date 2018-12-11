<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header>添加商品</x-header>
      <div class="container" :style="'font-size: 14px;margin-top: 46px; width: 100%;height:' + screenHeight + 'px;'">
        <group class="group top_infor" label-width="6em;" title="成品信息">
          <flexbox :gutter="0">
            <flexbox-item>
              <x-input title="四位码" :disabled="parseInt(addType) === 3" :show-clear="false" @on-blur="doneBlurCp(0)" v-model="goodsList[0].FFOURNO"></x-input>
            </flexbox-item>
            <flexbox-item>
              <cell title="规格型号" :disabled="parseInt(addType) === 3" v-model="goodsList[0].MATELFSPECIFICATION" is-link :link="{path: '/submit/select', query: {type: 'WLCP'}}"  @click.native="clickType('WLCP', 0)"></cell>
            </flexbox-item>
          </flexbox>
          <hr>
          <flexbox :gutter="0">
            <flexbox-item><x-input :show-clear="false" disabled title="数量" type="number" v-model="goodsList[0].FQTY"></x-input></flexbox-item>
            <flexbox-item><x-input title="实际成交价" :disabled="parseInt(addType) === 3" :show-clear="false" type="number" @on-change="yskChange()" v-model="goodsList[0].FAMOUNT"></x-input></flexbox-item>
          </flexbox>
          <hr>
          <flexbox :gutter="0">
            <flexbox-item><x-input :show-clear="false" title="已收款" type="number" @on-change="yskChange()" v-model="goodsList[0].FREAMOUNTS"></x-input></flexbox-item>
            <flexbox-item><x-input title="未收款" :disabled="parseInt(addType) === 3" type="number" readonly v-model="goodsList[0].FNREAMOUNTS"></x-input></flexbox-item>
          </flexbox>
          <calendar title="预约送货日期" disable-past :display-format="displayFormat" v-model="goodsList[0].F_PBPB_DATE" ></calendar>
          <calendar title="预约安装日期" disable-past :display-format="displayFormat" v-model="goodsList[0].F_PBPB_DATE1"></calendar>
          <!-- <x-input style="display: none" title="明细备注"  v-model="goodsList[0].FNOTES"></x-input> -->
          <!--添加商场提单号字段 张浩 2018-08-10-->
          <x-input v-if="addType!=3" title="商场提单号" v-model="goodsList[0].FShopBillNo"></x-input>
        </group>
        <flexbox :gutter="0" id='add_del' :class="{'fix': isFix}">
          <flexbox-item :span="5" style="padding-left: 10px;">
            <x-button type="default" mini @click.native="checkAll">全选/取消</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary" mini @click.native="addGoods">添加赠品</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="warn" mini @click.native="delGoods">删除赠品</x-button>
          </flexbox-item>
        </flexbox>
        <div class="goods_list">
          <flexbox :gutter="0" class="goods_item" v-for="(item, index) in zpList" v-bind:key="index">
            <flexbox-item :span="1" class="list_left">
              <label><input type="checkbox" class="item_checkbox" @change="checkItem(index+1, item.checked)" :checked="item.checked"></label>
            </flexbox-item>
            <flexbox-item class="list_right">
              <group class="group">
                <flexbox :gutter="0">
                  <flexbox-item>
                    <x-input title="四位码" :show-clear="false" @on-blur="doneBlurZp(index+1)" v-model="item.FFOURNO"></x-input>
                  </flexbox-item>
                  <flexbox-item>
                    <cell title="物料编码" v-model="item.MATEFNUMBER" is-link :link="{path: '/submit/select', query: {type: 'WLZP'}}"  @click.native="clickType('WLZP', index+1)"></cell>
                  </flexbox-item>
                </flexbox>

                <x-input title="物料名称" readonly v-model="item.MATELFNAME"></x-input>
                <x-input title="规格型号" readonly v-model="item.MATELFSPECIFICATION"></x-input>

                <hr>
                <flexbox :gutter="0">
                  <flexbox-item><x-input :show-clear="false" readonly title="数量" v-model="item.FQTY"></x-input></flexbox-item>
                  <flexbox-item><cell title="赠品类型" v-model="item.ZPLXLFNAME"></cell></flexbox-item>
                </flexbox>
                <calendar disable-past title="预约送货日期" :display-format="displayFormat" v-model="item.F_PBPB_DATE"></calendar>
                <calendar disable-past title="预约安装日期" :display-format="displayFormat" v-model="item.F_PBPB_DATE1"></calendar>
                <x-input title="加价赠赠品" placeholder="请输入赠品金额" type="number" v-model="item.FPREMIUMAMOUNT"></x-input>
              </group>
            </flexbox-item>
          </flexbox>
        </div>
      </div>
      <flexbox :gutter="0" class="btn_box" id="btn_box">
        <flexbox-item class="box_center"  @click.native="confirmGoods">
          <p>确认</p>
        </flexbox-item>
         <flexbox-item class="box_right" @click.native="backPre">
          <p>返回</p>
        </flexbox-item>
      </flexbox>
    </view-box>
  </div>
</template>

<script>
  import Uploader from 'vux-uploader'
  import { FourbitcodeForCp, FourbitcodeForZp, getJLDW, ValidShopBillCount } from '@/api/submit_order'
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
        screenWidth: window.screen.width,
        screenHeight: document.documentElement.clientHeight - 88,
        isFix: false,
        scrollHeight: '',
        orgNumber: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGNUMBER) || '',
        orgID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || '',
        custID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].CUSTFID) || '',
        deptID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].DEPTFID) || '',
        custNumber: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].CUSTNUMBER) || '',
        merchant: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].MERCFID) || '',
        empID: (this.$store.getters.employees[0] && this.$store.getters.employees[0].FID) || '',
        userID: this.$store.getters.userID || '',
        billType: this.$store.getters.billType || '',
        isAllSel: false,
        toPageType: '',
        goodsList: [
          {
            checked: false,
            FFOURNO: '',
            FICITEM: '',
            MATEFNUMBER: '',
            MATELFNAME: '',
            MATELFSPECIFICATION: '',
            FUNITID: '',
            UNITFNUMBER: '',
            UNITLFNAME: '',
            FQTY: 1,
            FPRICE: 0,
            FDISCOUNT: '',
            FAMOUNT: '',
            FISDIS: '',
            FDISTYPE: '',
            ZPLXFNUMBER: '',
            ZPLXLFNAME: '',
            FGIFTSIGN: '',
            JZBZFNUMBER: '',
            JZBZLFNAME: '',
            FDISNAME: '',
            F_PBPB_DATE: this.today,
            FDELIVERYDATES: '',
            F_PBPB_DATE1: this.today,
            FINSTALLATIONDATES: '',
            FREAMOUNTS: '',
            FNREAMOUNTS: '',
            FWAIVERAMOUNT: '',
            FNOTES: '',
            FACTIVITYTYPES: '',
            SalesTypeFNUMBER: '',
            SalesTypeLFNAME: '',
            FDisAmount: '',
            FPREMIUMAMOUNT: 0,
            FShopBillNo: ''
          }
        ],
        zpList: [],
        goodsIndex: 0,
        checkedGoods: {}, // key是顺序index  value是goods
        today: '',
        addType: 0,
        shopBillNoCount: 0
      }
    },
    deactivated() {
      // 移除监听事件
      window.removeEventListener('scroll', this.stickyTop)
      this.showImgPre = false
    },
    activated() {
      // 监听屏幕滚动事件 判断吸顶效果
      window.addEventListener('scroll', this.stickyTop)
      this.addType = this.$route.query.addType
      if (this.addType === 4 || this.addType === 5) {
        this.goodsList = [
          {
            checked: false,
            FFOURNO: '',
            FICITEM: '',
            MATEFNUMBER: '',
            MATELFNAME: '',
            MATELFSPECIFICATION: '',
            FUNITID: '',
            UNITFNUMBER: '',
            UNITLFNAME: '',
            FQTY: 1,
            FPRICE: 0,
            FDISCOUNT: '',
            FAMOUNT: '',
            FISDIS: '',
            FDISTYPE: '',
            ZPLXFNUMBER: '',
            ZPLXLFNAME: '',
            FGIFTSIGN: '',
            JZBZFNUMBER: '',
            JZBZLFNAME: '',
            FDISNAME: '',
            F_PBPB_DATE: this.today,
            FDELIVERYDATES: '',
            F_PBPB_DATE1: this.today,
            FINSTALLATIONDATES: '',
            FREAMOUNTS: '',
            FNREAMOUNTS: '',
            FWAIVERAMOUNT: '',
            FNOTES: '',
            FACTIVITYTYPES: '',
            SalesTypeFNUMBER: '',
            SalesTypeLFNAME: '',
            FDisAmount: '',
            FPREMIUMAMOUNT: 0,
            FShopBillNo: ''
          }
        ]
        this.zpList = []
      }
      if (this.addType === 1) {
        this.goodsList = this.$route.params.data
        this.zpList = this.goodsList.slice(1)
      }
      if (this.addType === 2 || this.addType === 3) {
        this.goodsList = this.$route.params.data
        this.zpList = this.goodsList.slice(1)
      }
      const submitDetails = this.$store.getters.submitDetails
      if (this.toPageType === 'WLCP') {
        this.WLCP = (submitDetails && submitDetails['WLCP']) || {}
        if (Object.keys(this.WLCP).length !== 0) {
          delete submitDetails['WLCP']
          this.$store.dispatch('setSubmitDetails', submitDetails)
          let goods = this.goodsList[this.goodsIndex]
          goods.MATELFNAME = this.WLCP.FNAME
          goods.MATELFSPECIFICATION = this.WLCP.FSPECIFICATION
          goods.MATEFNUMBER = this.WLCP.FNUMBER
          if (this.billType === 1) {
            goods.FAMOUNT = 0
          } else {
            goods.FAMOUNT = this.WLCP.FPRICE
          }
          goods.FICITEM = this.WLCP.FID
          goods.FISDIS = false
          goods.FFOURNO = this.WLCP.FOURCODE
          getJLDW(this.orgID, goods.MATEFNUMBER).then(resp => {
            goods.FUNITID = resp[0].unitid
            goods.UNITFNUMBER = resp[0].unitnumber
            goods.UNITLFNAME = resp[0].unitname
          })
        }
      }
      if (this.toPageType === 'WLZP') {
        this.WLZP = (submitDetails && submitDetails['WLZP']) || {}
        if (Object.keys(this.WLZP).length !== 0) {
          delete submitDetails['WLZP']
          this.$store.dispatch('setSubmitDetails', submitDetails)
          let goods = this.goodsList[this.goodsIndex]
          goods.MATELFNAME = this.WLZP.FNAME
          goods.MATELFSPECIFICATION = this.WLZP.FSPECIFICATION
          goods.MATEFNUMBER = this.WLZP.FNUMBER
          goods.FICITEM = this.WLZP.FID
          goods.FISDIS = true
          goods.FDISTYPE = this.WLZP.GIFTTYPEID
          goods.ZPLXLFNAME = this.WLZP.GIFTTYPENAME
          goods.FFOURNO = this.WLZP.FOURCODE
          getJLDW(this.orgID, goods.MATEFNUMBER).then(resp => {
            goods.FUNITID = resp[0].unitid
            goods.UNITFNUMBER = resp[0].unitnumber
            goods.UNITLFNAME = resp[0].unitname
          })
        } else {
          this.goodsList.splice(this.goodsList.length - 1, 1)
        }
      }
      this.toPageType = ''
      this.zpList = this.goodsList.slice(1)
    },
    mounted() {
      const date = new Date()
      this.today = date.getFullYear() + '-' + this.dateAdd0(date.getMonth() + 1) + '-' + this.dateAdd0(date.getDate())
    },
    methods: {
      // 吸顶
      stickyTop() {
        this.scrollHeight = document.documentElement.scrollTop || document.body.scrollTop
        const elementHeight = document.querySelector('.group').clientHeight
        if (this.scrollHeight >= elementHeight) {
          this.isFix = true
        } else {
          this.isFix = false
        }
      },
      /* qtyChange(index) {
        let goods = this.goodsList[index]
        goods.FAMOUNT = (goods.FQTY * goods.FPRICE) - goods.FDisAmount
        this.$set(this.goodsList, index, goods)
      }, */
      yskChange() {
        let goods = this.goodsList[0]
        goods.FAMOUNT = Number(goods.FAMOUNT)
        goods.FREAMOUNTS = Number(goods.FREAMOUNTS)
        goods.FNREAMOUNTS = Number(goods.FNREAMOUNTS)
        if (goods.FAMOUNT < 0) {
          goods.FAMOUNT = 0
        }
        if (goods.FREAMOUNTS > goods.FAMOUNT) {
          this.$vux.toast.text('已收款不能大于实际成交价！')
          goods.FREAMOUNTS = 0
        }
        goods.FNREAMOUNTS = goods.FAMOUNT - goods.FREAMOUNTS
        if (goods.FNREAMOUNTS < 0) {
          goods.FNREAMOUNTS = 0
        }
        this.$set(this.goodsList, 0, goods)
      },
      displayFormat(value, type) {
        value = value.replace(/-/g, '')
        return value
      },
      clickType(type, index) {
        this.toPageType = type
        this.goodsIndex = index || 0
      },
      doneBlurCp(index) {
        FourbitcodeForCp(this.billType, this.goodsList[index].FFOURNO, this.custNumber, this.orgNumber).then(resp => {
          this.goodsList[index].FISDIS = false
          if (this.billType === 1) {
            this.goodsList[index].FAMOUNT = 0
          } else {
            this.goodsList[index].FAMOUNT = resp[0].FPRICE
          }
          this.$set(this.goodsList, index, Object.assign({}, this.goodsList[index], resp[0]))
        })
      },
      doneBlurZp(index) {
        FourbitcodeForZp(this.orgID, this.goodsList[index].FFOURNO).then(resp => {
          this.goodsList[index].FISDIS = true
          this.$set(this.goodsList, index, Object.assign({}, this.goodsList[index], resp[0]))
          this.zpList = this.goodsList.slice(1)
        })
      },
      // 返回
      backPre() {
        this.$vux.confirm.show({
          title: '警告',
          content: '未保存！返回后数据消失',
          onConfirm() {
            history.go(-1)
          }
        })
      },
      // 确认
      confirmGoods() {
        if (!this.goodsList[0].MATEFNUMBER) {
          this.$vux.alert.show({
            title: '提示',
            content: '请选择成品!'
          })
          return
        }
        if (this.goodsList[0].FShopBillNo === '') {
          this.$vux.alert.show({
            title: '提示',
            content: '商场提单号不能为空!'
          })
          return
        }

        /* if (this.shopBillNoCount !== 0) {
          this.$vux.alert.show({
            title: '提示',
            content: '商场提单号重复，请检查!'
          })
          return
        } */
        /* if (!this.goodsList[0].FREAMOUNTS) {
          this.$vux.alert.show({
            title: '提示',
            content: '已收款不能为空!'
          })
          return
        } */
        if (!this.goodsList[0].FAMOUNT) {
          this.$vux.alert.show({
            title: '提示',
            content: '实际成交价不能为空!'
          })
          return
        }
        for (let i = 0; i < this.goodsList.length; i++) {
          const e = this.goodsList[i]
          if (this.days(e.F_PBPB_DATE1, e.F_PBPB_DATE) > 180) {
            this.$vux.alert.show({
              title: '提示',
              content: i === 0 ? '成品的预约送货日期和预约安装日期不能大于180天' : ('第' + i + '个赠品的预约送货日期和预约安装日期不能大于180天')
            })
            return
          }
        }
        const jsonData = {
          'MarchantID': this.merchant,
          'OrgID': this.orgID,
          'ShopBillNo': this.goodsList[0].FShopBillNo
        }
        if (parseInt(this.addType) === 4) {
          ValidShopBillCount(jsonData).then(resp => {
            if (resp > 0) {
              this.$vux.alert.show({
                title: '提示',
                content: '商场提单号重复，请检查!'
              })
            } else {
              this.$router.replace({name: 'addSubmit', params: {data: this.goodsList}})
              this.toPageType = ''
            }
          })
        }
        if (parseInt(this.addType) === 1) {
          ValidShopBillCount(jsonData).then(resp => {
            if (resp > 0) {
              this.$vux.alert.show({
                title: '提示',
                content: '商场提单号重复，请检查!'
              })
            } else {
              this.$router.replace({name: 'addSubmit', params: {data: this.goodsList, idx: this.$route.query.idx}})
              this.toPageType = ''
            }
          })
        }
        if (parseInt(this.addType) === 2) {
          this.$router.replace({name: 'detailsSubmit', query: {from: 1, FID: this.$route.query.fid}, params: {data: this.goodsList, idx: this.$route.query.idx}})
          this.toPageType = ''
        }
        if (parseInt(this.addType) === 3) {
          this.$router.replace({name: 'detailsSubmit', query: {from: 2, FID: this.$route.query.fid}, params: {data: this.goodsList, idx: this.$route.query.idx}})
          this.toPageType = ''
        }
        if (parseInt(this.addType) === 5) {
          this.$router.replace({name: 'detailsSubmit', query: {from: 1, FID: this.$route.query.fid}, params: {data: this.goodsList}})
          this.toPageType = ''
        }
      },
      checkAll() {
        if (this.isAllSel === false) {
          for (let i = 0; i < this.zpList.length; i++) {
            this.zpList[i].checked = true
            this.checkedGoods[i] = this.zpList[i]
          }
          this.isAllSel = true
        } else {
          for (let i = 0; i < this.zpList.length; i++) {
            this.zpList[i].checked = false
            delete this.checkedGoods[i]
          }
          this.isAllSel = false
        }
      },
      addGoods() {
        let goods = {
          checked: true,
          FFOURNO: '',
          FICITEM: '',
          MATEFNUMBER: '',
          MATELFNAME: '',
          MATELFSPECIFICATION: '',
          FUNITID: '',
          UNITFNUMBER: '',
          UNITLFNAME: '',
          FQTY: 1,
          FPRICE: '0',
          FDISCOUNT: '0',
          FAMOUNT: '0',
          FISDIS: '0',
          FDISTYPE: '',
          ZPLXFNUMBER: '',
          ZPLXLFNAME: '',
          FGIFTSIGN: '',
          JZBZFNUMBER: '',
          JZBZLFNAME: '',
          FDISNAME: '',
          F_PBPB_DATE: this.today,
          FDELIVERYDATES: '',
          F_PBPB_DATE1: this.today,
          FINSTALLATIONDATES: '',
          FREAMOUNTS: '0',
          FNREAMOUNTS: '0',
          FWAIVERAMOUNT: '',
          FNOTES: '',
          FACTIVITYTYPES: '',
          SalesTypeFNUMBER: '',
          SalesTypeLFNAME: '',
          FDisAmount: '',
          FPREMIUMAMOUNT: 0,
          FShopBillNo: ''

        }
        this.goodsList.push(goods)
        this.zpList = this.goodsList.slice(1)
        this.checkedGoods[this.goodsList.length - 1] = goods
        /* this.$router.push({path: '/submit/select', query: {type: 'WLZP'}})
        this.clickType('WLZP', (this.goodsList.length - 1)) */
      },
      checkItem(index, checked) {
        let goods = this.goodsList[index]
        if (checked) {
          goods.checked = false
          delete this.checkedGoods[index]
        } else {
          goods.checked = true
          this.checkedGoods[index] = this.goodsList[index]
        }
      },
      delGoods() {
        const _this = this
        const keys = Object.keys(this.checkedGoods)
        if (keys.length === 0) {
          _this.$vux.alert.show({
            title: '提示',
            content: '请至少选择一条数据!'
          })
        } else {
          _this.$vux.confirm.show({
            title: '警告',
            content: '确定删除吗？删除后无法恢复！',
            onConfirm() {
              let goodsArray = []
              for (let goodsKey in _this.checkedGoods) {
                goodsArray.push({ key: goodsKey, value: _this.checkedGoods[goodsKey] })
              }
              goodsArray = goodsArray.sort((a, b) => b.key - a.key)
              for (let i = 0; i < goodsArray.length; i++) {
                _this.checkedGoods = {}
                _this.goodsList.splice(goodsArray[i].key, 1)
                _this.zpList = _this.goodsList.slice(1)
                delete _this.checkedGoods[i]
              }
              _this.$vux.toast.text('删除成功')
            }
          })
        }
      },
      days(date1, date) {
        const convertDateFromString = function(dateString) {
          return new Date(parseInt(dateString.substring(0, 4)), parseInt(dateString.substring(6, 7)), parseInt(dateString.substring(9, 10)), 0, 0, 0, 0)
        }
        const _date1 = convertDateFromString(date1)
        const _date = convertDateFromString(date)
        return Math.abs((_date1 - _date) / 1000 / 3600 / 24)
      }
    }
  }
</script>

<style scoped lang="less">
  .container{
    margin-top: 50px;
    #add_del{
      margin-top: 10px;
      padding: 10px 0;
      background: #fff;
    }
    .top_infor{
      hr{
        margin-left: 15px;
        border: 0;
        border-top: 1px solid #eee;
      }
    }
    .goods_list{
      padding-bottom: 50px;
      .goods_item {
        .list_left {
          padding-left: 10px;
          text-align: center;
          label {
            input {
              width: 18px;
              height: 18px;
            }
          }
        }
        .list_right {
          hr{
            margin-left: 15px;
            border: 0;
            border-top: 1px solid #eee;
          }
        }
      }
    }
  }
  .fix{
    position:fixed;
    top:36px;
    left:0;
    z-index: 100;
  }
  .img_preview{
    position: fixed;
    top: 0;
    z-index: 100;
    text-align: center;
    background: #000;
    img{
      vertical-align: middle;
      width:100%;
    }
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
