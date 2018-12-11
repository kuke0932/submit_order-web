<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="backCustomer">新增报单</x-header>
      <div class="container" style="font-size: 14px">
        <group class="group" label-width="6em;">
          <cell title="报单门店" v-model="BDMD.FNAME" is-link :link="{path: '/submit/select', query: {type: 'BDMD'}}" @click.native="clickType('BDMD')"></cell>
          <cell title="顾客手机号*" v-model="customerInfor.FCUSTPHONE"></cell>
          <cell title="顾客姓名*" v-model="customerInfor.FNAME"></cell>
          <cell title="报单区县*" v-model="customerInfor.FCounty"></cell>
          <cell title="街道地址*" v-model="customerInfor.FADDRESS"></cell>

          <cell title="促销方案" v-model="CXFA.FNAME" is-link :link="{path: '/submit/select', query: {type: 'CXFA'}}" @click.native="clickType('CXFA')" disabled></cell>
          <cell title="活动类型" v-model="HDLX.FNAME" is-link :link="{path: '/submit/select', query: {type: 'HDLX'}}" @click.native="clickType('HDLX')"></cell>
          <x-input title="以旧换新卡号" v-model="cardNumber" placeholder="请输入7位字母、数字" :readonly="isOldChangeNew === 0"></x-input>

          <cell title="合作客户" v-model="HZKH.FNAME" is-link :link="{path: '/submit/select', query: {type: 'HZKH'}}" @click.native="clickType('HZKH')"></cell>
          <!-- <x-input title="商家单据号" v-model="merchantCode" placeholder="请输入商家单据号"></x-input> -->
          <cell title="应收金额" v-model="ysMoney" disabled></cell>
          <cell title="已收款" v-model="yMoney" disabled></cell>
          <cell title="未收款" v-model="wMoney" disabled></cell>
          <x-textarea title="整单备注" placeholder="请输入整单备注" v-model="comment"></x-textarea>

          <calendar disable-past title="商场开票日期" placeholder="请选择时间" v-model="kpDate"></calendar>

          <uploader
            class="imgUploader"
            :max="varmax"
            :images="imagesList"
            :handle-click="false"
            :show-header="true"
            :readonly="false"
            :upload-url="uploadUrl"
            :autoUpload="false"
            name="img"
            :params="params"
            size="small"
            ref="uploader"
            @preview="previewMethod"
            @add-image="addImageMethod"
            @remove-image="removeImageMethod"
            @upload-image="uploadImage"
          ></uploader>

        </group>
        <flexbox :gutter="0" id='add_del' :class="{'fix': isFix}">
          <flexbox-item :span="5" style="padding-left: 10px;">
            <!--<x-button type="default" mini @click.native="checkAll">全选/取消</x-button>-->
          </flexbox-item>
          <flexbox-item>
            <x-button type="primary" mini @click.native="addGoods">添加成品</x-button>
          </flexbox-item>
          <flexbox-item>
            <x-button type="warn" mini @click.native="delGoods">删除成品</x-button>
          </flexbox-item>
        </flexbox>
        <div class="infor_list">
          <div class="infor_item" v-for="(item, index) in goodsList" v-bind:key="index">
            <flexbox :gutter="0" class="details" >
              <flexbox-item :span="2" class="details_left">
                <label><input type="checkbox" class="item_checkbox" @change="checkItem(index, item.checked)" :checked="item.checked"></label>
              </flexbox-item>
              <flexbox-item class="details_right">
                <router-link :to="{ name: 'addSecond', query: {addType: 1, idx: index}, params: {data: item}}">
                  <flexbox :gutter="0" align="left">
                    <flexbox-item>&nbsp;&nbsp;{{item[0].MATELFSPECIFICATION}}</flexbox-item>
                    <flexbox-item>金额：{{item[0].FAMOUNT}}</flexbox-item>
                  </flexbox>
                </router-link>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
      </div>
      <flexbox :gutter="0" id="btn_box">
        <flexbox-item class="box_left"  @click.native="saveBill">
          <p>保存</p>
        </flexbox-item>
        <flexbox-item class="box_right" @click.native="saveSubmit">
          <p>上报MOA</p>
        </flexbox-item>
      </flexbox>
      <div @click="cancelPreview" class="img_preview"
           :style="showImgPre ? {width:screenWidth + 'px', height:screenHeight + 'px',lineHeight:screenHeight + 'px',display: 'block'}: 'display:none'">
        <img :src="imgUrl" alt="">
      </div>
    </view-box>
  </div>
</template>

<script>
  import { save, submitNew, UploadImage } from '@/api/submit_order'
  import Uploader from 'vux-uploader'
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
    Calendar,
    dateFormat
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
        screenHeight: document.documentElement.clientHeight,
        imgUrl: '',
        showImgPre: false,
        varmax: 1,
        imagesList: [],
        uploadUrl: '',
        params: {},
        isFix: false,
        scrollHeight: '',
        orgID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || '',
        custID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].CUSTFID) || '',
        deptID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].DEPTFID) || '',
        empID: (this.$store.getters.employees[0] && this.$store.getters.employees[0].FID) || '',
        merchID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].MERCFID) || '',
        userID: this.$store.getters.userID || '',
        billType: 0,
        BDMD: {
          FNAME: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].MERCFNAME),
          FID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].MERCFID)
        },
        CXFA: { FNAME: '点击选择促销方案' },
        HDLX: { FNAME: '点击选择活动类型' },
        HZKH: { FNAME: '点击选择合作客户' },
        PJLX: { FNAME: '点击选择票据类型' },
        customerInfor: {},
        cardNumber: '',
        isOldChangeNew: 0,
        merchantCode: '',
        ysMoney: 0,
        yMoney: 0,
        wMoney: 0,
        comment: '',
        isAllSel: false,
        toPageType: '',
        goodsList: [
        ],
        goodsIndex: 0,
        checkedGoods: {}, // key是顺序index  value是goods
        kpDate: 'TODAY',
        czDate: '',
        imgObj: {},
        imgId: ''
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
      if (this.$route.params.data) {
        const good = this.$route.params.data
        if (this.$route.params.idx >= 0) {
          this.goodsList[this.$route.params.idx] = good
          this.$set(this.goodsList, this.$route.params.idx, good)
        } else {
          this.goodsList.push(good)
        }
        this.checkMoney()
      }
      if (this.$route.params.customerInfor) {
        this.reset()
        this.customerInfor = this.$route.params.customerInfor
      } else {
        this.BDMD = (this.$store.getters.submitDetails && this.$store.getters.submitDetails['BDMD']) || this.BDMD
        this.CXFA = (this.$store.getters.submitDetails && this.$store.getters.submitDetails['CXFA']) || { FNAME: '点击选择促销方案' }
        this.HDLX = (this.$store.getters.submitDetails && this.$store.getters.submitDetails['HDLX']) || { FNAME: '点击选择活动类型' }
        this.HZKH = (this.$store.getters.submitDetails && this.$store.getters.submitDetails['HZKH']) || { FNAME: '点击选择合作客户' }
        this.PJLX = (this.$store.getters.submitDetails && this.$store.getters.submitDetails['PJLX']) || { FNAME: '点击选择票据类型' }
        if (this.HDLX.FIsOldChangeNew === 0) {
          this.isOldChangeNew = 0
          this.cardNumber = ''
        } else {
          this.isOldChangeNew = 1
        }
      }
    },
    mounted() {
      /* const date = new Date()
      this.czDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() */
      // this.sfm = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss').split(' ')[1]
    },
    methods: {
      backCustomer() {
        this.goodsList = []
        this.$store.dispatch('setSubmitDetails', {}).then(() => {})
        this.$router.replace({path: '../customer?t=0'})
      },
      // 应收 已收 未收
      checkMoney() {
        this.ysMoney = 0
        this.wMoney = 0
        this.yMoney = 0
        for (let i = 0; i < this.goodsList.length; i++) {
          this.ysMoney += parseInt(this.numberFixed2(this.goodsList[i][0].FAMOUNT))
          this.wMoney += parseInt(this.numberFixed2(this.goodsList[i][0].FNREAMOUNTS))
          this.yMoney += parseInt(this.numberFixed2(this.goodsList[i][0].FREAMOUNTS))
        }
      },
      // 预览
      previewMethod(e) {
        this.showImgPre = true
        this.imgUrl = this.imagesList[0].url
      },
      // 取消预览
      cancelPreview() {
        this.showImgPre = false
      },
      addImageMethod(e) {
      },
      removeImageMethod() {
        console.log('delete img')
      },
      uploadImage(e) {
        const u = navigator.userAgent
        const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1 // android终端
        const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
        if (isAndroid) {
          this.imgObj = e.get('img')
        } else if (isiOS) {
          const imgUploader = document.getElementsByClassName('weui-uploader__input')
          this.imgObj = imgUploader[0].files[0]
        }
        const url = URL.createObjectURL(this.imgObj)
        this.imagesList.push({
          url: url
        })
        if ((this.imgObj.size / 1024) > 200) {
          this.sendImg(0.1)
        } else {
          this.sendImg(0.5)
        }
      },
      // 上传图片
      sendImg(quality) {
        const that = this
        that.photoCompress(that.imgObj, {
          quality: quality
        }, function(base64Codes) {
          const code = base64Codes.split(',')
          UploadImage(code[1], that.imgObj.name).then(resp => {
            if (resp[0].IsSuccess) {
              that.imgId = resp[0].FileId
              that.$vux.toast.show({
                text: '上传成功'
              })
            } else {
              const errorMessage = resp[0].Message
              that.$vux.alert.show({
                title: '图片上传失败',
                content: errorMessage
              })
            }
          })
        })
      },
      // 图片压缩
      photoCompress(file, w, objDiv) {
        const ready = new FileReader()
        const that = this
        ready.readAsDataURL(file)
        ready.onload = function() {
          const re = this.result
          that.canvasDataURL(re, w, objDiv)
        }
      },
      // 转base64
      canvasDataURL(path, obj, callback) {
        const img = new Image()
        img.src = path
        img.onload = function() {
          const that = this
          // 默认按比例压缩
          let w = that.width
          let h = that.height
          let scale = w / h
          w = obj.width || w
          h = obj.height || (w / scale)
          let quality = 0.5  // 默认图片质量为0.7
          // 生成canvas
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          // 创建属性节点
          const anw = document.createAttribute('width')
          anw.nodeValue = w
          const anh = document.createAttribute('height')
          anh.nodeValue = h
          canvas.setAttributeNode(anw)
          canvas.setAttributeNode(anh)
          ctx.drawImage(that, 0, 0, w, h)
          // 图像质量
          if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality
          }
          const base64 = canvas.toDataURL('image/jpeg', quality)
          callback(base64)
        }
      },
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
      // 重置
      reset() {
        this.cardNumber = ''
        this.merchantCode = ''
        this.ysMoney = 0
        this.yMoney = 0
        this.wMoney = 0
        this.comment = ''
        this.imagesList = []
        this.CXFA = { FNAME: '点击选择促销方案' }
        this.HDLX = { FNAME: '点击选择活动类型' }
        this.HZKH = { FNAME: '点击选择合作客户' }
        this.PJLX = { FNAME: '点击选择票据类型' }
        this.goodsList = []
      },
      clickType(type, index) {
        this.toPageType = type
        this.goodsIndex = index || 0
      },
      saveData() {
        this.czDate = dateFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
        const telReg = /^[1][0-9]{10}$/
        const cardReg = /^[0-9a-zA-Z]{7}$/
        this.billType = this.$store.getters.billType || ''
//        const regex = /^(0\d{2,3}-\d{7,8})$/
//        const oldReg = RegExp(/旧换新/)
        if (!this.customerInfor.FCUSTPHONE) {
          this.$vux.toast.text('请输入手机号')
          return Promise.reject(new Error('请输入手机号'))
        }
        if (!telReg.test(this.customerInfor.FCUSTPHONE)) {
          this.$vux.toast.text('手机号格式错误')
          return Promise.reject(new Error('手机号格式错误'))
        }
        if (this.HDLX.FNAME === '点击选择活动类型') {
          this.$vux.toast.text('请选择活动类型')
          return Promise.reject(new Error('请选择活动类型'))
        }
        if (this.HDLX.FIsOldChangeNew === 1) {
          if (!this.cardNumber) {
            this.$vux.toast.text('请输入以旧换新卡号')
            return Promise.reject(new Error('请输入以旧换新卡号'))
          }
          if (this.cardNumber.length !== 7 || !cardReg.test(this.cardNumber)) {
            this.$vux.toast.text('卡号必须为7位字母、数字')
            return Promise.reject(new Error('卡号必须为7位字母、数字'))
          }
        }
        // if (!this.merchantCode) {
        //   this.$vux.toast.text('请输入商家单据号')
        //   return Promise.reject(new Error('请输入商家单据号'))
        // }
        if (!this.kpDate) {
          this.$vux.toast.text('请选择开票日期')
          return Promise.reject(new Error('请选择开票日期'))
        }
        if (this.wMoney < 0) {
          this.$vux.toast.text('未收款金额不能小于0')
          return Promise.reject(new Error('未收款金额不能小于0'))
        }
        if (this.goodsList.length === 0) {
          this.$vux.toast.text('请添加商品再进行操作')
          return Promise.reject(new Error('请添加商品再进行操作'))
        }
        if (this.imagesList.length === 0) {
          this.$vux.toast.text('请上传图片再进行操作')
          return Promise.reject(new Error('请上传图片再进行操作'))
        }
        const jsonData = {
          'Model': {
            'FID': '0', // 单据内码，如果单据需要修改时需要传入单据的FID
            'FBillNo': '', // 单据编码，如果单据需要修改时需要传入单据的编码
            'FBillTypeID': {
              'FNumber': this.billType === 1 ? 'XDD02_SYS' : this.billType === 2 ? 'XDD03_SYS' : 'XDD01_SYS' // 1直营订单2代理订单3利群订单
            },
            'FDate': this.czDate, // 操作日期
            'FSaleOrgid': {
              'FORGID': this.orgID // 传入登录用户组织ID
            },
            'FCustid': {
              'FCUSTID': this.custID // 传入登录用户客户ID
            },
            'FDeptid': {
              'FDEPTID': this.deptID // 传入登录用户部门ID
            },
            'FEmpid': {
              'FID': this.empID // 传入登录员工ID
            },
            'FIPhone': this.customerInfor.FCUSTPHONE, // 顾客手机号
            'FName': this.customerInfor.FNAME, // 顾客姓名
            'FProvince': {
              'FID': (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ProvID) || '' // 省ID
            },
            'FCity': {
              'FID': (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].CityID) || '' // 市ID
            },
            'FCounty': {
              'FID': this.customerInfor.FCountyId // 区县ID
            },
            'FAddress': this.customerInfor.FADDRESS, // 地址
            'FReportMD': {
              'FID': this.BDMD.FID
            },
            'FSalesPromotion': {
              'FID': this.CXFA.FID // 促销方案ID
            },
            'FActivityType': {
              'FID': this.HDLX.FID // 活动类型
            },
            'FOldChangeNewNumber': this.cardNumber, // 已旧换新卡号
            'FMerchantNo': this.merchantCode, // 商家单号
            'FNote': this.comment, // 单据头备注
            'FCooperateCust': {
              'FID': this.HZKH.FID // 合作客户ID
            },
            'FShopNo': '',
            'FARAmount': this.ysMoney, // 应收金额
            'FREAmount': this.yMoney, // 已收金额
            'FNREAmount': this.wMoney, // 未收金额
            'F_PBPB_Combo': '未拆单', // 拆单状态
            'FError': '无异常', // 错误状态
            'F_PBPB_Combo1': '否', // 是否加赠
            'F_PBPB_Combo2': '未提交', // 提交状态
            'F_PBPB_Date2': '', // 提交日期
            'F_PBPB_Remarks': '', // 拆单错误信息
            'F_PBPB_Base': {  // 顾客信息
              'FID': this.customerInfor.FID
            },
            'F_PBPB_Datetime': this.kpDate, // 商场开发票日期
            'F_PBPB_Merchant': {
              'FID': this.merchID // 商家信息
            },
            'F_PBPB_ImageFileServer': this.imgId, // 图片id
            'FXDDEntry': []
          }
        }
        const fxddEntry = []
        /* const format = (d) => {
          return d.substring(0, 4) + '-' + d.substring(4, 6) + '-' + d.substring(6, 8)
        } */
        for (let i = 0; i < this.goodsList.length; i++) {
          for (let j = 0; j < this.goodsList[i].length; j++) {
            const goods = this.goodsList[i][j]
            fxddEntry.push({
              'FEntryID': '', // 不填
              'FGroupNum': i + 1, // 组号
              'FFourNo': goods.FFOURNO, // 四位码
              'FICitem': {
                'FMaterialid': goods.FICITEM // 物料ID
              },
              'FUnitID': {
                'FUNITID': goods.FUNITID // 计量单位ID
              },
              'FQty': goods.FQTY, // 数量
              'FPrice': goods.FAMOUNT, // 单价
              'FAmount': goods.FAMOUNT, // 金额
              'FISDis': goods.FISDIS, // 是否赠品
              'FDisType': {
                'FID': goods.FDISTYPE // 赠品类型 AO赠品：2015581；南华赠品2015582
              },
              'FDisName': '', // 赠品块名称
              'F_PBPB_Date': goods.F_PBPB_DATE, // 预约送货日期
              'FDeliveryDates': goods.F_PBPB_DATE.replace(/-/g, ''), // 预约送货日期（手机对应）20180424
              'F_PBPB_Date1': goods.F_PBPB_DATE1, // 预约安装日期
              'FInstallationDates': goods.F_PBPB_DATE1.replace(/-/g, ''), // 预约安装日期（手机对应）20180424
              'FREAmountS': goods.FREAMOUNTS, // 单据体已收款，录入
              'FNREAmountS': goods.FNREAMOUNTS, // 单据体未收款，金额 – 已收款
              'FPremiumAmount': goods.FPREMIUMAMOUNT, // 赠品价格
              'FNotes': goods.FNOTES, // 单据体备注
              'FActivityTypes': {
                'FID': '' // 活动类型
              },
              'FShopBillNo': goods.FShopBillNo // 商场提单号
            })
          }
        }
        jsonData.Model.FXDDEntry = fxddEntry
        return save(jsonData)
      },
      // 保存
      saveBill() {
        this.saveData().then(resp => {
          const that = this
          if (resp[0].IsSuccess) {
            that.$vux.toast.show({
              text: '保存成功',
              onHide() {
                that.$store.dispatch('setSubmitDetails', {}).then(() => {})
                that.goodsList = []
                that.$router.replace({ path: '/submit', query: {t: 0} })
              }
            })
          } else {
            const errorMessage = resp[0].Message
            that.$vux.alert.show({
              title: '保存出错',
              content: errorMessage
            })
          }
        }).catch(e => {
          console.log(e)
        })
      },
      /* 保存并提交 */
      saveSubmit() {
        this.saveData().then(resp => {
          const that = this
          if (resp[0].IsSuccess) {
            const number = []
            number.push(resp[0].Number)
            submitNew(number).then(resp => {
              if (resp.Result.ResponseStatus.IsSuccess) {
                that.$vux.toast.show({
                  text: '上报成功',
                  onHide() {
                    that.$store.dispatch('setSubmitDetails', {}).then(() => {})
                    that.$router.replace({ path: '/submit/sellBill', query: {t: 0} })
                  }
                })
              } else {
                const errors = resp.Result.ResponseStatus.Errors
                let errorMessage = ''
                errors.forEach(e => {
                  errorMessage += e.Message + '\r\n'
                })
                this.$vux.alert.show({
                  title: '上报出错!',
                  content: errorMessage
                })
              }
            })
          } else {
            const errors = resp.Result.ResponseStatus.Errors
            let errorMessage = ''
            errors.forEach(e => {
              errorMessage += e.Message + '\r\n'
            })
            this.$vux.alert.show({
              title: '保存出错!',
              content: errorMessage
            })
          }
        })
      },
      /* checkAll() {
        if (this.isAllSel === false) {
          for (let i = 0; i < this.goodsList.length; i++) {
            this.goodsList[i].checked = true
            this.checkedGoods[i] = this.goodsList[i]
          }
          this.isAllSel = true
        } else {
          for (let i = 0; i < this.goodsList.length; i++) {
            this.goodsList[i].checked = false
            delete this.checkedGoods[i]
          }
          this.isAllSel = false
        }
      }, */
      addGoods() {
        this.$router.push({path: '/submit/addSecond', query: {addType: 4}})
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
                delete _this.checkedGoods[i]
              }
              _this.$vux.toast.text('删除成功')
              _this.checkMoney()
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .isClick {
    pointer-events: none
  }
  .container{
    margin-top: 46px;
    #add_del{
      margin: 8px 0;
    }
    .infor_list {
      .infor_item {
        margin-top: 5px;
        padding: 5px 0;
        background-color: #fff;
        .details {
          color: #666;
          font-size: 14px;
          .details_left {
            padding-left: 20px;
            text-align: left;
            label {
              input {
                width: 18px;
                height: 18px;
                vertical-align: sub;
              }
            }
          }
          .details_right {
            height: 60px;
            line-height:60px;
          }
        }
      }
      .btns {
        text-align: center;
        button {
          font-size: 12px;
          padding: 2px 5px;
          border: 0;
          border-radius: 4px;
          box-sizing: border-box;
          background: #04BE02;
          color: #fff;
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
