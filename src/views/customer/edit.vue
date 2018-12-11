<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header>修改顾客</x-header>
      <div class="container">
        <group class="group">
          <x-input title="顾客姓名*" placeholder="请输入顾客姓名" v-model="name" ></x-input>
          <x-input title="顾客电话*" placeholder="请输入顾客电话" :max="11"  v-model="phone" ></x-input>
          <popup-picker title="所属省*" placeholder="请选择顾客所属省" :data="provinceData" @on-change="provinceOnChange" :columns="columns" v-model="provinceArea" show-name></popup-picker>
          <popup-picker title="所属市*" placeholder="请选择顾客所属市" :data="cityData" @on-change="cityOnChange" :columns="columns" v-model="cityArea" show-name></popup-picker>
          <popup-picker title="所属县*" placeholder="请选择顾客所属县" :data="countryData" :columns="columns" v-model="countryArea" show-name></popup-picker>
          <x-input title="街道地址*" placeholder="请输入顾客街道地址" v-model="address" ></x-input>
        </group>
        <flexbox :gutter="0" class="btn_box" id="btn_box">
          <flexbox-item class="box_center"  @click.native="saveCustomer">
            <p>保存</p>
          </flexbox-item>
          <flexbox-item class="box_right" @click.native="reset">
            <p>重置</p>
          </flexbox-item>
        </flexbox>
      </div>
    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader, Group, XInput, PopupPicker, XButton, Flexbox, FlexboxItem, ChinaAddressV4Data } from 'vux'
  import { executeBillQuery, save } from '@/api/customer'
  export default {
    components: {
      ViewBox,
      XHeader,
      Group,
      XInput,
      PopupPicker,
      XButton,
      Flexbox,
      FlexboxItem,
      ChinaAddressV4Data
    },
    data() {
      return {
        provinceArea: [],
        cityArea: [],
        countryArea: [],
        provinceData: [],
        cityData: [],
        countryData: [],
        loadCityArea: [],
        loadCountryArea: [],
        name: '',
        phone: '',
        address: '',
        fId: '',
        fNumber: '',
        columns: 1
      }
    },
    mounted() {
      this.$vux.loading.show({
        text: 'Loading'
      })
      this.getProvince()
      this.getResult()
    },
    methods: {
      getResult() {
        const FID = this.$route.query.FId
        executeBillQuery(
          'kf3a96165411248208f1c003b965344be',
          'FID,FCustPhone,FName,FProvince.FNumber,FProvince,FCity.FNumber,FCity,FCountry.FNumber,FCountry,FAddress,FNumber',
          'FID=' + FID
        ).then(resp => {
          const customer = resp[0]
          console.log(customer)
          this.getCity(customer[4]).then(() => {
            this.loadCityArea = [customer[5] + '/' + customer[6]]
          })
          this.getCountry(customer[6]).then(() => {
            this.loadCountryArea = [customer[7] + '/' + customer[8]]
            setTimeout(() => {
              this.fId = customer[0]
              this.fNumber = customer[10]
              this.name = customer[2]
              this.phone = customer[1]
              this.address = customer[9]
              this.provinceArea = [customer[3] + '/' + customer[4]]
              this.cityArea = this.loadCityArea
              this.countryArea = this.loadCountryArea
              this.$vux.loading.hide()
            }, 0)
          })
        }).catch(() => {
        })
      },
      getProvince() {
        return executeBillQuery('PBPB_NH_Province', 'FID,FNumber,FName').then(resp => {
          this.provinceData = resp.map(v => ({
            name: v[2],
            value: v[1] + '/' + v[0]
          }))
        }).catch(() => {
        })
      },
      getCity(val) {
        const filter = 'FUseOrgId=\'' + 100009 + '\' AND F_PBPB_Base=\'' + val + '\''
        return executeBillQuery('PBPB_NH_City', 'FID,FNumber,FName', filter).then(resp => {
          this.cityData = resp.map(v => ({
            name: v[2],
            value: v[1] + '/' + v[0]
          }))
        }).catch(() => {
        })
      },
      getCountry(val) {
        const filter = 'FUseOrgId=\'' + 100009 + '\' AND F_PBPB_Base=\'' + val + '\''
        return executeBillQuery('PBPB_NH_Area', 'FID,FNumber,FName', filter).then(resp => {
          this.countryData = resp.map(v => ({
            name: v[2],
            value: v[1] + '/' + v[0]
          }))
        }).catch(() => {
        })
      },
      provinceOnChange(val) {
        const filter = 'FUseOrgId=\'' + 100009 + '\' AND F_PBPB_Base=\'' + val[0].split('/')[1] + '\''
        executeBillQuery('PBPB_NH_City', 'FID,FNumber,FName', filter).then(resp => {
          this.cityData = resp.map(v => ({
            name: v[2],
            value: v[1] + '/' + v[0]
          }))
        }).catch(() => {
        })
      },
      cityOnChange(val) {
        const filter = 'FUseOrgId=\'' + 100009 + '\' AND F_PBPB_Base=\'' + val[0].split('/')[1] + '\''
        executeBillQuery('PBPB_NH_Area', 'FID,FNumber,FName', filter).then(resp => {
          this.countryData = resp.map(v => ({
            name: v[2],
            value: v[1] + '/' + v[0]
          }))
        }).catch(() => {
        })
      },
      saveCustomer() {
        if (!this.name) {
          this.$vux.toast.text('请输入顾客姓名')
          return
        }
        if (!this.phone) {
          this.$vux.toast.text('请输入顾客电话')
          return
        }
        if (this.provinceArea.length === 0) {
          this.$vux.toast.text('请选择省')
          return
        }
        if (this.cityArea.length === 0) {
          this.$vux.toast.text('请选择市')
          return
        }
        if (this.countryArea.length === 0) {
          this.$vux.toast.text('请选择县')
          return
        }
        if (!this.address) {
          this.$vux.toast.text('请输入街道地址')
          return
        }
        const jsonData = {
          Creator: '',
          NeedUpDateFields: [],
          NeedReturnFields: [],
          IsDeleteEntry: 'True',
          SubSystemId: '',
          IsVerifyBaseDataField: 'false',
          IsEntryBatchFill: 'True',
          Model: {
            FID: this.fId,
            FNumber: this.fNumber,
            FCreateDate: '1900-01-01',
            FModifyDate: '1900-01-01',
            FDescription: '测试',
            FModifierId: {
              FUserID: '0'
            },
            FCreatorId: {
              FUserID: '0'
            },
            FCustLandline: this.phone,
            FName: this.name,
            FCustPhone: this.phone,
            FProvince: {
              FID: this.provinceArea[0].split('/')[1]
            },
            FCity: {
              FID: this.cityArea[0].split('/')[1]
            },
            FCountry: {
              FID: this.countryArea[0].split('/')[1]
            },
            FAddress: this.address
          }
        }
        save(jsonData).then(resp => {
          if (resp.Result.ResponseStatus.IsSuccess) {
            const _this = this
            this.$vux.toast.show({
              text: '修改成功',
              onHide() {
                _this.$router.push({path: '/customer', query: {from: 'edit'}})
              }
            })
          }
        })
      },
      reset() {
        this.provinceArea = []
        this.cityArea = []
        this.countryArea = []
        this.cityData = []
        this.countryData = []
        this.name = ''
        this.phone = ''
        this.address = ''
      }
    }
  }
</script>

<style scoped lang="less">
  .container{
    margin-top: 46px;
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
  }
</style>
