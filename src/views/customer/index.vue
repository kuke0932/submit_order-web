<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header" >顾客
        <router-link to="/customer/add" slot="right">新增顾客</router-link>
      </x-header>
      <div class="container">
        <search
          v-model="searchContent"
          placeholder="请输入顾客姓名/手机号"
          position="fixed"
          @on-submit="onSubmit"
          ref="search"
          style="position:fixed;z-index: 10; top: 46px"></search>
        <div :style="'margin-top: 90px; width: 100%;height:' + viewHeight + 'px;'">
          <group>
            <!--<cell :title="merChantName">报单人：{{empName}}</cell>-->
            <flexbox :gutter="0" style="padding: 10px 0;color:#00CC00">
              <flexbox-item :span="7" align="left" style="padding-left: 20px">
                {{merChantName}}
              </flexbox-item>
              <flexbox-item :span="4" align="right" style="margin-right: 20px">
                报单人：{{empName}}
              </flexbox-item>
            </flexbox>
          </group>
          <scroller ref="scroller" style="position: relative;" :on-refresh="refresh" :on-infinite="infinite" >
            <div class="customer_list">
          <div class="customer_item" v-for="(item, index) in customerList">
            <div class="details">
              <span style="font-weight: bold;margin-right: 20px;">{{item.FNAME}}</span>
              <span>电话：{{item.FCUSTPHONE}}</span>
              <flexbox :gutter="0">
                <flexbox-item>
                  地址：{{item.FADDRESS}}
                </flexbox-item>
              </flexbox>
            </div>
            <flexbox :gutter="0" style="border-top: 1px solid #ccc">
              <flexbox-item>
                <div class="flex-demo" @click="goSubmit(index)">
                  <img src="../../assets/icons/menu01.svg" alt=""> 报单
                </div>
              </flexbox-item>
              <flexbox-item>
                <div class="flex-demo" @click="goCollection(index)">
                  <img src="../../assets/icons/money01.svg" alt=""> 收款
                </div>
              </flexbox-item>
            </flexbox>
          </div>
        </div>
          </scroller>
        </div>
      </div>

    </view-box>
  </div>
</template>

<script>
  import { ViewBox, XHeader, XButton, Search, Flexbox, FlexboxItem, Group, Cell, PopupPicker } from 'vux'
  import Tabbar from '@/components/tabbar'
  import { GetMemberInfo } from '@/api/customer'
  import Vue from 'vue'
  import VueScroller from 'vue-scroller'
  Vue.use(VueScroller)
  export default {
    components: {
      XHeader,
      XButton,
      Search,
      Tabbar,
      Flexbox,
      FlexboxItem,
      ViewBox,
      Group,
      Cell,
      PopupPicker
    },
    data() {
      return {
        merChantName: '',
        empName: '',
        viewHeight: document.documentElement.clientHeight - 143,
        customerList: [],
        pageIndex: 1,
        pageSize: 10,
        searchContent: ''
      }
    },
    activated(done) {
      this.merChantName = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].MERCFNAME) || ''
      this.empName = (this.$store.getters.employees[0] && this.$store.getters.employees[0].FNAME) || ''
      this.refresh(done)
    },
    mounted() {
    },
    methods: {
      back() {
        this.$router.replace({path: '/'})
      },
      refresh(done) {
        this.pageIndex = 1
        this.pageSize = 10
        this.customerList = []
        const scroller = this.$refs.scroller
        if (this.$refs.scroller.loadingState === 2) {
          scroller.loadingState = 0
          done && done(false)
        } else {
          done && done(false)
        }
      },
      infinite(done) {
        this.infiniteHandler(done)
      },
      infiniteHandler($state) {
        /* executeBillQuery(
          'kf3a96165411248208f1c003b965344be',
          'FID,FCustPhone,FName,FProvince.FName,FCity.FName,FCountry.FName,FAddress,FNumber',
          this.searchValue,
          this.orderString,
          this.startRow,
          this.topRowCount,
          this.limit
        ).then(resp => {
          if (resp.length) {
            this.list = this.list.concat(resp.map(v => ({
              id: v[0],
              phone: v[1],
              name: v[2],
              address: v[3] + v[4] + v[5] + v[6],
              number: v[7]
            })))
            if (resp.length < this.limit) {
              $state && $state(true)
            } else {
              $state && $state()
            }
            this.startRow = (Math.ceil(this.list.length / this.limit)) * this.limit
          } else {
            $state && $state(true)
          }
        }).catch((e) => {
          console.log(e)
          $state && $state(true)
        }) */
        this.fetchData(this.pageIndex, this.pageSize, this.searchContent).then(resp => {
          this.customerList = this.customerList.concat(resp)
          if (resp.length < this.pageSize) {
            $state && $state(true)
          } else {
            $state && $state()
          }
          this.pageIndex++
        }).catch((e) => {
          $state && $state(true)
        })
      },
      fetchData(pageIndex, pageSize, search, BussinessId) {
        const bussinessId = (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].MERCFID) || ''
        return GetMemberInfo(this.pageIndex, this.pageSize, this.searchContent, bussinessId)
      },
      /* removeCustomer(number, index) {
        const _this = this
        this.$vux.confirm.show({
          title: '删除',
          content: '确定删除吗？',
          onConfirm() {
            const data = {
              CreateOrgId: 0,
              Numbers: [
                number
              ]
            }
            remove(data).then(() => {
              _this.startRow = 0
              _this.$vux.toast.show({
                text: '删除成功',
                onHide() {
                  _this.list.splice(index, 1)
                }
              })
            })
          }
        })
      }, */
      onSubmit() {
        this.refresh()
      },
      goSubmit(index) {
        this.$router.push({name: 'addSubmit', query: {from: 0}, params: {customerInfor: this.customerList[index]}})
      },
      goCollection(index) {
        this.$router.push({name: 'submitCollection', query: {t: 0}, params: {customerInfor: this.customerList[index]}})
      }
    }
  }
</script>

<style lang="less" scoped>
  .customer_list{
    .customer_item{
      margin:0 0 10px 0;
      background-color: #fff;
      .details{
        padding:10px 20px 5px;
        color:#666;
        p{
          font-size: 16px;
        }
      }
      .flex-demo {
        text-align: center;
        color: #666;
        border-right:0;
        font-size: 14px;
        padding:3px 0;
        img{
          width:18px;
          vertical-align: text-bottom;
        }
      }
    }
  }
</style>
