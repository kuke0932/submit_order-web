<template>
  <div style="height:100%;">
    <view-box ref="viewBox">
      <x-header :left-options="{preventGoBack: true}" @on-click-back="back"  slot="header">物料选择
      </x-header>
      <div class="container">
        <search
          @on-change="search"
          v-model="searchContent"
          auto-scroll-to-top top="46px"
          placeholder="请输入搜索内容"
          @on-submit="onSubmit"
          class="search"
          ref="search" :style="'position:fixed;z-index: 10; top: 46px;left: ' + searchBoxLeft + 'px;width:' + searchBoxWidth + 'px'"></search>
        <flexbox :gutter="0"  class="materials_details">
          <flexbox-item :span="3.5">
            <div class="left" style="height:100%">
              <group class="selector_box">
                <selector style=" font-size: 14px;" v-model="typeSelector" @on-change="typeSelectorChange" :options="typeOptions"></selector>
              </group>
              <div class="box1" width="40%">
                <p @click="clickBox1Item($event, index, item.fid)" class="box1_item" v-for="(item, index) in materialGroup">{{item.name}}</p>
              </div>
              <div v-transfer-dom>
                <popup v-model="show1" position="left" width="40%">
                  <div @click="backPrelevel1" class="back_to" style="background-color: #DA4F49;">
                    <p style="padding: 10px; line-height: 22px;height:22px;color:#e6e6e6;font-size: 14px">
                      <img style="width: 22px;vertical-align: middle" src="../../assets/icons/back02.svg" alt=""> 返回
                    </p>
                  </div>
                  <div class="box_desc" style="height:100%;text-align: center;font-size: 14px;background: #fff; padding:10px 0;">
                    <p style="padding: 10px 0" @click="clickBox2Item($event, index, item.fid)" class="box_item" v-for="(item, index) in materialGroup1">{{item.name}}</p>
                  </div>
                </popup>
              </div>
              <div v-transfer-dom>
                <popup v-model="show2" position="left" width="40%">
                  <div  @click="backPrelevel2" class="back_to" style="background-color: #0088CC">
                    <p style="padding: 10px; line-height: 22px;height:22px;color:#e6e6e6;font-size: 14px">
                      <img style="width: 22px;vertical-align: middle" src="../../assets/icons/back02.svg" alt=""> 返回
                    </p>
                  </div>
                  <div class="box_desc" style="height:100%;text-align: center;font-size: 14px;background: #fff; padding:10px 0;">
                    <p style="padding: 10px 0" @click="clickBox3Item($event, index, item.fid)" class="box_item" v-for="(item, index) in materialGroup2">{{item.name}}</p>
                  </div>
                </popup>
              </div>
              <div v-transfer-dom>
                <popup v-model="show3" position="left" width="40%">
                  <div @click="backPrelevel3" class="back_to" style="background-color: #FAA732">
                    <p style="padding: 10px; line-height: 22px;height:22px;color:#e6e6e6;font-size: 14px">
                      <img style="width: 22px;vertical-align: middle" src="../../assets/icons/back02.svg" alt=""> 返回
                    </p>
                  </div>
                  <div class="box_desc" style="height:100%;text-align: center;font-size: 14px;background: #fff; padding:10px 0;">
                    <p style="padding: 10px 0" @click="clickBox4Item($event, index, item.fid)" class="box_item" v-for="(item, index) in materialGroup3">{{item.name}}</p>
                  </div>
                </popup>
              </div>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="right" ref="rightDetails" :style="'margin-top: 46px; width: 100%;height:'+ (viewHeight - 143) + 'px'">
              <scroller ref="scroller" style="position:relative;" :on-refresh="refresh" :on-infinite="infinite">
                <div class="infor_list">
                  <div class="infor_item" v-for="(item, index) in materialList" v-bind:key="index">
                    <flexbox class="details">
                      <flexbox-item :span="1" class="details_left">
                        <label><input type="checkbox" class="item_checkbox" @click="itemChecked(item, item.checked)" :checked="item.checked || false"></label>
                      </flexbox-item>
                      <flexbox-item class="details_right">
                        <span>物料编码：&nbsp;&nbsp;{{item.MaterialNumber}}</span>
                        <flexbox :gutter="0">
                          <flexbox-item :span="3.5">物料名称：</flexbox-item>
                          <flexbox-item>{{item.MaterialName}}</flexbox-item>
                        </flexbox>
                        <flexbox :gutter="0">
                          <flexbox-item :span="3.5">规格型号：</flexbox-item>
                          <flexbox-item>{{item.SpecifiCation}}</flexbox-item>
                        </flexbox>
                        <flexbox :gutter="0">
                          <flexbox-item :span="3.5">库存：</flexbox-item>
                          <flexbox-item>{{item.Stockstatus}}&nbsp;&nbsp;{{item.StockQty}}</flexbox-item>
                        </flexbox>
                        <flexbox>
                          <flexbox-item class="count" >数量：
                            <img @click="minusCount(index)" src="../../assets/icons/minus.svg">
                            <input type="number" style="border-bottom: 1px solid #ccc" class="input_counts"  @blur="validInput(index)" v-model="item.Number">
                            <img @click="plusCount(index)" src="../../assets/icons/plus.svg"> {{item.Unit}}
                          </flexbox-item>
                        </flexbox>
                      </flexbox-item>
                    </flexbox>
                  </div>
                </div>
              </scroller>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
      <flexbox :gutter="0" class="btn_box" id="btn_box">
        <flexbox-item :span="5" class="box_left">
          <p>已选{{totalCategoryCount}}种，共{{totalCount}}个</p>
        </flexbox-item>
        <flexbox-item class="box_center" @click.native="pre">
          <p>上一步</p>
        </flexbox-item>
        <flexbox-item class="box_right" @click.native="next">
          <p>确认</p>
        </flexbox-item>
      </flexbox>
    </view-box>
  </div>

</template>

<script>
  import { getMaterialGroup, getMaterial, selectMaterial } from '@/api/borrow'
  import { ViewBox, XHeader, Search, Flexbox, FlexboxItem, XInput, XButton, TransferDom, Popup, debounce, Group, Selector } from 'vux'
  import InfiniteLoading from 'vue-infinite-loading'
  import Vue from 'vue'
  import VueScroller from 'vue-scroller'
  Vue.use(VueScroller)

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      ViewBox,
      Search,
      Flexbox,
      FlexboxItem,
      XInput,
      XButton,
      TransferDom,
      Popup,
      InfiniteLoading,
      Group,
      Selector
    },
    data() {
      return {
        viewHeight: document.documentElement.clientHeight,
        searchBoxWidth: '',
        searchBoxLeft: '',
        orgID: (this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex] && this.$store.getters.deptMercCustModel[this.$store.getters.deptMercCustModelIndex].ORGID) || '',
        userID: (this.$store.getters.employees[0] && this.$store.getters.employees[0].FID) || '',
        pageIndex: 1,
        pageSize: 10,
        searchPageIndex: 1,
        searchPageSize: 10,
        show1: false,
        show2: false,
        show3: false,
        totalCount: 0,
        totalCategoryCount: 0,
        checkedMaterial: {},
        searchContent: '',
        selectedGroupId: 0,
        materialGroup: [],
        materialGroup1: [],
        materialGroup2: [],
        materialGroup3: [],
        materialList: [],
        level1Index: 0,
        level2Index: 0,
        level3Index: 0,
        distance: 20,
        infiniteType: 1,  // 0 搜索上拉加载更多, 1 普通上拉加载更多,
        typeSelector: 1,
        typeOptions: [{key: 0, value: '物料编码'}, {key: 1, value: '物料名称'}, {key: 2, value: '规格型号'}],
        from: ''
      }
    },
    created() {
      this.from = this.$route.query.from
      getMaterialGroup(this.orgID, this.userID, this.pageIndex, this.pageSize).then(resp => {
        this.materialList = resp.material_result
        for (let i = 0; i < this.materialList.length; i++) {
          this.materialList[i].Number = 0
        }
        this.materialGroup = resp.groupmodel[0].childs
        if (this.materialGroup.length > 0) {
          this.selectedGroupId = this.getFirstGroupId(this.materialGroup[0])
        }
      })
    },
    mounted() {
      // window.addEventListener('scroll', this.handleScroll)
      this.searchBoxLeft = document.querySelector('.left').offsetWidth
      this.searchBoxWidth = document.documentElement.clientWidth - this.searchBoxLeft
      document.getElementsByClassName('weui-search-bar')[0].style.width = this.searchBoxWidth + 'px'
      this.rightHeight = document.documentElement.clientHeight - 132 - 70
    },
    updated() {
      this.searchBoxLeft = document.querySelector('.left').offsetWidth
      this.searchBoxWidth = document.documentElement.clientWidth - this.searchBoxLeft
      document.getElementsByClassName('weui-search-bar')[0].style.width = this.searchBoxWidth + 'px'
      this.rightHeight = document.documentElement.clientHeight - 132 - 70
    },
    destroyed() {
      // window.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      handleScroll() {
        const scrollHeight = document.documentElement.scrollHeight
        const scrollTop = document.documentElement.scrollTop
        console.log(scrollHeight, scrollTop + document.documentElement.clientHeight)
        if (scrollHeight - scrollTop - document.documentElement.clientHeight < this.distance) {
          // console.log(true)
        }
      },
      refresh(done) {
        this.pageIndex = 0
        this.searchPageIndex = 0
        this.materialList = []
        this.checkedMaterial = {}
        const scroller = this.$refs.scroller
        if (scroller.loadingState === 2) {
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
        let promise, pageIndex, pageSize
        if (this.infiniteType === 1) {
          pageIndex = ++this.pageIndex
          pageSize = this.pageSize
          promise = getMaterial(this.selectedGroupId, this.orgID, this.userID, pageIndex, pageSize)
        } else if (this.infiniteType === 0) {
          pageIndex = ++this.searchPageIndex
          pageSize = this.searchPageSize
          if (this.typeSelector === 0) {
            promise = selectMaterial(this.searchContent, '', '', this.orgID, this.userID, pageIndex, pageSize)
          } else if (this.typeSelector === 1) {
            promise = selectMaterial('', this.searchContent, '', this.orgID, this.userID, pageIndex, pageSize)
          } else {
            promise = selectMaterial('', '', this.searchContent, this.orgID, this.userID, pageIndex, pageSize)
          }
        }
        promise.then(resp => {
          if (resp && resp.length) {
            this.materialList = this.materialList.concat(resp)
            if (resp.length < pageSize) {
              $state && $state(true)
            } else {
              $state && $state()
            }
          } else {
            $state && $state(true)
          }
          for (let i = 0; i < this.materialList.length; i++) {
            this.materialList[i].Number = 0
          }
        }).catch((e) => {
          console.log(e)
          $state && $state(true)
        })
      },
      getFirstGroupId(group) {
        if (group.childs && group.childs.length > 0) {
          return this.getFirstGroupId(group.childs[0])
        } else {
          return group.fid
        }
      },
      itemChecked(item) {
        item.checked = !item.checked
        if (item.checked) {
          this.checkedMaterial[item.MaterialId] = item
          this.totalCategoryCount++
          this.totalCount += Number.parseFloat(item.Number || 0)
        } else {
          delete this.checkedMaterial[item.MaterialId]
          this.totalCategoryCount--
          this.totalCount -= Number.parseFloat(item.Number || 0)
        }
      },
      search: debounce(function(val) {
//        this.doSearch(0)
      }, 500),
      onSubmit() {
        this.$refs.search.setBlur()
        this.doSearch()
      },
      doSearch() {
        this.infiniteType = 0
        const scroller = this.$refs.scroller
        this.refresh(scroller.finishInfinite())
      },
      typeSelectorChange(val) {
        this.typeSelector = val
      },
      plusCount: function(index) {
        let goods = this.materialList[index]
        goods.Number = Number.parseFloat(goods.Number || 0) + 1
        if (goods.Number > goods.StockQty) {
          goods.Number = goods.StockQty
        }
        this.$set(this.materialList, index, goods)
        let totalCount = 0
        for (let materialKey in this.checkedMaterial) {
          const material = this.checkedMaterial[materialKey]
          if (material.checked) {
            totalCount += Number.parseFloat(material.Number || 0)
          }
        }
        this.totalCount = totalCount
      },
      minusCount: function(index) {
        let goods = this.materialList[index]
        goods.Number = Number.parseFloat(goods.Number || 0)
        if (goods.Number >= 1) {
          goods.Number -= 1
          let totalCount = 0
          for (let materialKey in this.checkedMaterial) {
            const material = this.checkedMaterial[materialKey]
            if (material.checked) {
              totalCount += Number.parseFloat(material.Number || 0)
            }
          }
          this.totalCount = totalCount
        }
        this.$set(this.materialList, index, goods)
      },
      validInput(index) {
        const ret = this.validNumber(this.materialList[index].Number)
        if (this.materialList[index].Number > parseFloat(this.materialList[index].StockQty)) {
          this.materialList[index].Number = parseFloat(this.materialList[index].StockQty)
          this.$set(this.materialList, index, this.materialList[index])
        }
        if (!ret.ok) {
          this.$vux.alert.show({
            title: '出错了!',
            content: ret.message,
            onHide() {
              document.querySelectorAll('.input_counts')[index].focus()
            }
          })
        } else {
          if (this.materialList[index].Number > parseFloat(this.materialList[index].StockQty)) {
            this.materialList[index].Number = parseFloat(this.materialList[index].StockQty)
            this.$set(this.materialList, index, this.materialList[index])
          }
        }
        this.totalCount = 0
        for (let materialKey in this.checkedMaterial) {
          const material = this.checkedMaterial[materialKey]
          if (material.checked) {
            this.totalCount += Number.parseFloat(material.Number || 0)
          }
        }
      },
      validNumber(number) {
        if (number === '') {
          return {
            ok: false,
            message: '数量不能为空'
          }
        }
        const regex = /(^[0-9]\d*$)|(^[0-9]\d*\.\d{0,2}$)/
        if (!regex.test(number)) {
          return {
            ok: false,
            message: '数字格式不对,请检查'
          }
        }
        return {
          ok: true,
          message: ''
        }
      },
      /* 点击物料分组 */
      clickBox1Item: function(e, index, fid) {
        this.publicClick(e, index, fid)
        // getMaterial(fid, this.orgID, this.pageIndex, this.pageSize).then(resp => {
        //   this.materialList = resp
        // })
        this.materialGroup1 = (this.materialGroup[index] && this.materialGroup[index].childs) || []
        if (this.materialGroup1.length === 0) {
          return
        }
        this.show1 = true
      },
      clickBox2Item: function(e, index, fid) {
        this.publicClick(e, index, fid)
        this.materialGroup2 = (this.materialGroup1[index] && this.materialGroup1[index].childs) || []
        // getMaterial(fid, this.orgID, this.pageIndex, this.pageSize).then(resp => {
        //   this.materialList = resp
        // })
        if (this.materialGroup2.length === 0) {
          this.show1 = false
          return
        }
        this.show1 = false
        this.show2 = true
      },
      clickBox3Item: function(e, index, fid) {
        this.publicClick(e, index, fid)
        this.materialGroup3 = (this.materialGroup2[index] && this.materialGroup2[index].childs) || []
        // getMaterial(fid, this.orgID, this.pageIndex, this.pageSize).then(resp => {
        //   this.materialList = resp
        // })
        if (this.materialGroup3.length === 0) {
          this.show1 = false
          this.show2 = false
          return
        }
        this.show2 = false
        this.show3 = true
      },
      clickBox4Item: function(e, index, fid) {
      },
      publicClick(e, index, fid) {
        this.pageIndex = 0
        this.pageSize = 10
        this.selectedGroupId = fid
        this.infiniteType = 1
        this.materialList = []
        const scroller = this.$refs.scroller
        if (scroller.loadingState === 2) {
          scroller.loadingState = 0
          scroller.finishInfinite(false)
        } else {
          scroller.finishInfinite(false)
        }
        let items = e.path[1].childNodes
        for (let i = 0; i < items.length; i++) {
          items[i].style.fontWeight = 'normal'
          items[i].style.background = '0'
        }
        e.path[0].style.fontWeight = 'bold'
        e.path[0].style.background = '#F5F5F5'
      },
      backPrelevel1() {
        this.show1 = false
      },
      backPrelevel2() {
        this.show2 = false
        this.show1 = true
      },
      backPrelevel3() {
        this.show3 = false
        this.show2 = true
      },
      pre() {
        this.back()
      },
      next() {
        const storeMaterial = this.$store.getters.checkedMaterial
        /* console.log(this.checkedMaterial)
          for (let key in this.checkedMaterial) {
            if (!this.checkedMaterial[key].checked) {
              this.$vux.alert.show({
                title: '出错了!',
                content: '没有选择物料！'
              })
              return
            }
          } */
        for (let materialKey in storeMaterial) {
          let o = this.checkedMaterial[materialKey]
          if (o) {
            o.Number = Number.parseFloat(o.Number || 0) + Number.parseFloat(storeMaterial[materialKey].Number || 0)
          } else {
            this.checkedMaterial[materialKey] = storeMaterial[materialKey]
          }
        }
        this.$store.dispatch('setCheckedMaterial', this.checkedMaterial).then(() => {
          if (this.from === 'edit' || this.from === 'add') {
            this.back()
          } else {
            this.$router.push({path: '/borrow_material', query: {t: 1}})
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .container{
    .search{
      position: fixed!important;
      right:0;
    }
    .materials_details{
      margin-top: 44px;
      .left{
        position: fixed;
        top: 46px;
        padding:0 0 20px 0;
        background-color: #fff;
        font-size: 14px;
        text-align: center;
        height:100%;
        .box1{
          .box1_item{
            padding:10px
          }
        }
      }
      .right{
        margin-top: 44px;
        padding:10px 0;
        .infor_list{
          .infor_item{
            border-bottom: 1px solid #ddd;
            margin:0 0 10px 0;
            .details{
              color:#666;
              font-size: 12px;
              .details_left{
                padding-left: 10px;
                label {
                  input {
                    width: 16px;
                    height: 16px;
                  }
                }
              }
              .details_right{
                .count{
                  .input_counts {
                    border: 0;
                    width: 40px;
                    text-align: center;
                    font-size: 1em;
                    background-color: #F5F5F5;
                  }
                  img{
                    width:16px;
                    vertical-align: middle;
                  }
                }
              }
            }
          }
        }
      }
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
  @media screen and (max-width: 320px) {
    .bottom_details{
      font-size: 0.6rem;
    }
  }
</style>
