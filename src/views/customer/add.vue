<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header>新增顾客</x-header>
      <div class="container" :style="'height:' + (screenHeight - 88) + 'px'">
        <group class="group">
          <x-input title="顾客姓名" placeholder="请输入顾客姓名" v-model="name" ></x-input>
          <x-input title="顾客手机号" placeholder="请输入顾客手机号" :max="11"  v-model="phone"></x-input>
          <cell title="所属省" v-model="provinceArea" ></cell>
          <cell title="所属市" v-model="cityArea" ></cell>
          <popup-picker title="所属县" placeholder="请选择顾客所属县" :data="countryList" :columns="1" v-model="countryArea" show-name></popup-picker>
          <x-input title="街道地址" placeholder="请输入顾客详细地址" v-model="address" ></x-input>
          <popup-radio title="是否设计师" :options="styleList" v-model="style"></popup-radio>
          <x-textarea title="备注" placeholder="请输入备注信息" v-model="remark"></x-textarea>
        </group>
      </div>
      <flexbox :gutter="0" id="btn_box">
        <flexbox-item class="box_center"  @click.native="saveCustomer">
          <p>保存</p>
        </flexbox-item>
        <flexbox-item class="box_right" @click.native="reset">
          <p>重置</p>
        </flexbox-item>
      </flexbox>
    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader, Cell, Group, XInput, XTextarea, PopupPicker, XButton, Flexbox, FlexboxItem, PopupRadio, ChinaAddressV4Data } from 'vux'
  import { SaveMemberInfoNew, SubmitMemberInfo, audit, executeBillQuery } from '@/api/customer'
  export default {
    components: {
      ViewBox,
      XHeader,
      Cell,
      Group,
      XInput,
      XTextarea,
      PopupPicker,
      XButton,
      Flexbox,
      FlexboxItem,
      PopupRadio,
      ChinaAddressV4Data
    },
    data() {
      return {
        screenHeight: document.documentElement.clientHeight,
        provinceArea: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ProvFNAME),
        cityArea: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].CityFNAME),
        cityID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].CityID),
        countryArea: [],
        countryList: [],
        name: '',
        phone: '',
        address: '',
        styleList: ['是', '否'],
        style: '否',
        remark: '',
        orgID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || ''
      }
    },
    mounted() {
      this.getCountryList()
    },
    methods: {
      countryChange(e) {
        console.log(e)
      },
      saveCustomer() {
//        const regex = /^(0\d{2,3}-\d{7,8})$/
        const telReg = /^[1][0-9]{10}$/
        if (!this.name) {
          this.$vux.toast.text('请输入顾客姓名')
          return
        }
        if (!this.phone) {
          this.$vux.toast.text('请输入顾客手机号')
          return
        }
        if (!telReg.test(this.phone)) {
          this.$vux.toast.text('手机号格式错误')
          return
        }
        if (this.countryArea.length === 0) {
          this.$vux.toast.text('请选择县')
          return
        }
        if (!this.address) {
          this.$vux.toast.text('请输入详细地址')
          return
        }
        const jsonData = {
          'FNAME': this.name,
          'FCUSTPHONE': this.phone,
          // 'FID_FPROVINCE': this.provinceArea.length !== 0 ? this.provinceArea[0].split('/')[1] : 0,
          'FID_FPROVINCE': (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ProvID) || '',
          // 'FID_FCITY': this.cityArea.length !== 0 ? this.cityArea[0].split('/')[1] : 0,
          'FID_FCITY': (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].CityID),
          'FID_FCOUNTRY': this.countryArea.length !== 0 ? this.countryArea[0].split('/')[1] : 0,
          'FADDRESS': this.address,
          'FDESCRIPTION': this.remark,
          'FISstylist': this.style === '否' ? 0 : 1,
          'FEmloyee': (this.$store.getters.employees[0] && this.$store.getters.employees[0].FID) || '',
          'FBussiness': (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].MERCFID) || ''
        }
        SaveMemberInfoNew(jsonData).then(resp => {
          if (resp[0].IsSuccess) {
            const _this = this
            const number = resp[0].Number
            SubmitMemberInfo(number).then(resp => {
              if (resp[0].IsSuccess) {
                const number = resp[0].Number
                const jsonData = {
                  'CreateOrgId': 0,
                  'Numbers': [
                    number
                  ]
                }
                audit(jsonData).then(resp => {
                  if (resp.Result.ResponseStatus.IsSuccess) {
                    this.$vux.toast.show({
                      text: '顾客保存成功',
                      onHide() {
                        _this.$router.push({path: '/customer?t=0'})
                      }
                    })
                  } else {
                    _this.$vux.alert.show({
                      title: '提示!',
                      content: '审核出错'
                    })
                  }
                })
              } else {
                _this.$vux.alert.show({
                  title: '提示!',
                  content: '提交出错'
                })
              }
            })
          } else {
            const that = this
            that.$vux.alert.show({
              title: '提示!',
              content: '保存出错'
            })
          }
        })
      },
      reset() {
        // this.countryArea = []
        this.name = ''
        this.phone = ''
        this.address = ''
        this.remark = ''
      },
      /* getProvince() {
        executeBillQuery('PBPB_NH_Province', 'FID,FNumber,FName').then(resp => {
          this.provinceData = resp.map(v => ({
            name: v[2],
            value: v[1] + '/' + v[0]
          }))
        }).catch(() => {
        })
      }, */
      /* provinceOnChange(val) {
        if (val.length > 0) {
          const filter = 'FUseOrgId=\'' + this.orgID + '\' AND F_PBPB_Base=\'' + val[0].split('/')[1] + '\''
          executeBillQuery('PBPB_NH_City', 'FID,FNumber,FName', filter).then(resp => {
            this.cityData = resp.map(v => ({
              name: v[2],
              value: v[1] + '/' + v[0]
            }))
          }).catch(() => {
          })
        }
      }, */
      getCountryList() {
        const filter = 'FUseOrgId=\'' + this.orgID + '\' AND F_PBPB_Base=\'' + this.cityID + '\''
        executeBillQuery('PBPB_NH_Area', 'FID,FNumber,FName', filter).then(resp => {
          this.countryList = resp.map(v => ({
            name: v[2],
            value: v[1] + '/' + v[0]
          }))
        }).catch(() => {
        })
      }
    }
  }
</script>

<style scoped lang="less">
  .container {
    margin-top: 46px;
  }
  .isClick {
    pointer-events: none
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
