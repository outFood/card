import axios from 'axios'
import $ from 'jquery';
import Vue from 'Vue'
import router from '@/router'
import config from '../myConfig'
const VueSet = Vue.set

export default {
  state: function () {
    return {
      nowTitle: {
        '/shopIndex/': '商城首页',
        '/sort/': '全部商品',
        '/eChart/': 'E聊',
        '/fujin/': '附近',
        '/vip/': '会员中心',
      },
      homeData: {},
      prefix: 'http://cscs.ylhhyk.com/attachment/',//附加前缀
      pageNum: 0,
      //分类
      sortData: {},
      keywords: '',//请求商品列表的分类关键字
      commodityListData: {},
      commodityDetailData: {},
      commodityColorSizeData: {},
      payStaus: '购买',
      buyPageData: {},
      sortid:'',
      //附近商家
      Fujin_sortData: [],
      getFujin_slideData: [],
      Fujin_ListData: {},
      payStatus: '购买',
      //购物车
      cartData: {},
      cartcount: 0,
      exclusiveShopData: {},
      addCartStatus:'',
      //分销
      fenxiao_headData: {},
      fenxiao_bodyData: {},
      priceData:{},
      tixianData:{},
      tuiguangData:{},
      //个人中心
      wodeHeadData: {},
      wodeBodyData: {},
      loginStatus: '',
      vipInfoData:{},
      myAddressData: {},
      wantEditAddress: [],
      curSelAddress: {},
      myOrder:{},
      orderStatus:null,
      myLikeData:{},
      zuJiData:{}
    }
  },
  getters: {
    dingdanALLMsg(state) {
      return state
        .dingdan
        .filter(it => it.status == 1)
    }
  },
  actions: {
    //首页
    resHomeData({commit, state}, data) {
      axios.get(config.baseUrl+'/app/index.php?c=wxapp&a=module&do=main&id=12&uniacid='+config.uniacid)
        .then(function (res) {
          commit({
            type: 'saveHomeData',
            data: res
          })
        }).catch(function (err) {console.log('请求失败：'+err)})
    },
    // resFuKuan({commit, state}, data){
    //   axios.get('https://xcx.xcwll.cn/app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile&r=member.branch.payment&mid='+localStorage.getItem('userid'))
    //     .then(function (res) {
    //     console.log(res)
    //   }).catch(function (err) {alert(err)})
    // },
    // resShouKuan({commit, state}, data){
    //   axios.get('https://xcx.xcwll.cn/app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile&r=member.branch.receivables&mid='+localStorage.getItem('userid'))
    //     .then(function (res) {
    //     console.log(res)
    //   }).catch(function (err) {alert(err)})
    // },
    // resVip({commit, state}, data){
    //   axios.get('https://xcx.xcwll.cn/app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile&r=member.branch&mid='+localStorage.getItem('userid'))
    //     .then(function (res) {
    //     console.log(res)
    //   }).catch(function (err) {alert(err)})
    // },
    //分类
    resSortData({commit, state}, data) {
      axios.get(config.baseUrl+'/bale/api.php?mod=category&uniacid='+config.uniacid+'&t='+config.t)
        .then(function (res) {
          commit({
            type: 'saveSortData',
            res: res,
          })
        }).catch(function (err) {console.log('请求失败:'+err)})
    },
    resCommodityListData({commit, state}, data) {
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=goods.index.get_list',{params:data.params})
        .then(function (res) {
          commit({
            type: 'saveCommodityListData',
            res: res,
            sortid:data.params.cate
          })
        }).catch(function (err) {
        alert(err)
      })

    },
    resCommodityDetailData({commit, state}, data) {
      console.log(data)
      function commodityDetailData() {
        return axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=goods.detailapp.get_detailapp',{params:data.params})
      }
      function commodityColorSizeData() {
        return axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=goods.detailapp.picker',{params:data.params})
      }
      function commodityPingjiaData() {
        return axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=goods.detail.get_comments',{params:data.params})
      }
      function commodityPingjiaSortData() {
        return axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=goods.detail.get_comment_list',{params:data.params})
      }
      function submitCart() {
        return axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.cart.submit',{params:data.params})
      }
      function like() {
        return axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.favorite.toggle',{params:data.params})
      }
      axios.all([commodityDetailData(), commodityColorSizeData()]).then(axios.spread(function (commodityDetailData, commodityColorSizeData) {
        // console.log('commodityColorSizeData-----------------')
        // console.log(commodityColorSizeData)
        commit({
          type: 'saveCommodityDetailData',
          data: {
            commodityDetailData: commodityDetailData,
            commodityColorSizeData: commodityColorSizeData
          }
        })
      }))
    },
    changePayStaus({commit, state}, data) {
      commit({
        type: 'changePayStaus',
        payStatus: data.payStatus
      })
    },
    cartOrPay({commit, state}, data) {
      if (state.payStatus == '加入购物车') {
        axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.cart.add', {params: data.params})
          .then(function (res) {
            if(res.data.result.message!=undefined){
              commit({
                type:'saveAddCartStatus',
                data:res.data.result.message
              })
            }else{
              commit({
                type: 'saveCartcount',
                data: res
              })
            }
          }).catch(function (err) {
          alert(err)
        })
      } else {
        axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=order.create.get_main', {params: data.params})
          .then(function (res) {
            commit({
              type: 'saveBuyPageData',
              res: res
            })
          }).catch(function (err) {
          alert(err)
        })
      }
    },
    //查看购物车
    lookCart({commit, state}, data) {
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.cart.get_list',{params:data.params})
        .then(function (res) {
          commit({
            type: 'saveCartData',
            res: res
          })
        }).catch(function (err) {console.log('请求失败：'+err)})
    },
    cartUpdate({commit, state}, data) {
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.cart.update', {params: data.params})
        .then(function (res) {
        }).catch(function (err) {
        alert(err)
      })
    },
    cartDelete({commit, state}, data) {
      console.log(data)
      console.log('哈哈哈')
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.cart.remove',{params:data.params})
        .then(function (res) {
          commit({
            type: 'saveCartcount',
            data: 0
          })
        })
    },
    //附近商家
    resFujinData({commit, state}, data) {
      var id = data.id ? data.id : '';//如果点击分类的时候请求就有id,否则就是页面加载的时候请求
      function getFujin_sortData() {//分类
        return axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=merch.list.get_category&uniacid=2&t='+config.t);
      }

      function getFujin_slideData() {//轮播
        return axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=merch.list.get_category_swipe&uniacid=2&t='+config.t);
      }

      function getFujin_ListData() {//商户列表
        return axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=merch.list.ajaxmerchuser&uniacid=2&id=2'+'&t='+config.t);
      }
      axios.all([getFujin_sortData(), getFujin_slideData(), getFujin_ListData()])//一次性并发多个请求
        .then(axios.spread(function (Fujin_sortData, getFujin_slideData, Fujin_ListData) {
          commit({
            type: 'saveFujinData',
            data: {
              Fujin_sortData: Fujin_sortData,
              getFujin_slideData: getFujin_slideData,
              Fujin_ListData: Fujin_ListData
            }
          })
        }))
    },
    resExclusiveShopData({commit, state}, data) {
      // var url='https://xcx.xcwll.cn/app'+(data.url).replace(/^./, "")+'&state=we7sid-989f479443e701453157a809d00e2e0f&sign=907857da4524149aacd027f26975f731'
      var url = config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=merch.index.get_main&state=we7sid-989f479443e701453157a809d00e2e0f&sign=5fc39c4c2d8acbfb7c253e67cbecda05&mid=0'
      axios.get(url,{params:data.params}).then(function (res) {
        commit({
          type: 'saveExclusiveShopData',
          res: res
        })
      }).catch(function (err) {
        alert(err)
      })
    },
    //分销中心
    resApply({commit, state}, data) {
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=commission.register.get_main',{params:data.params})
        .then(function (res) {
            router.push({path:'/distributIndex/wait'})
        }).catch(function (err) {console.log('请求失败:'+err)})
    },
    resFenxiao({commit, state}, data) {
      var headPrams={
          t:config.t,
          uniacid:config.uniacid,
          openid:localStorage.getItem('openid'),
          mid:localStorage.getItem('userid'),
          i:2
        }
      //请求HeadData
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=commission.index.get_main',{params:headPrams})
        .then(function (res) {
          commit({
            type:'saveFenxiaoHead',
            data:res
          })
        }).catch(function (err) {console.log('请求失败:'+err)})
      //请求BodyData
      axios.get(config.baseUrl+'/app/index.php?c=wxapp&a=module&do=nav&type=4&uniacid='+config.uniacid+'&t='+config.t)
        .then(function (res) {
          commit({
            type:'saveFenxiaoBody',
            data:res
          })
        }).catch(function (err) {console.log('请求失败:'+err)})
    },
    resPrice({commit, state}, data){
      var params={
        mid:config.mid,
        openid:localStorage.getItem('openid'),
        t:config.t
      }
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=commission.withdraw.get_main&i=2',params)
        .then(function (res) {
          commit({
            type:'savePriceData',
            res:res
          })
        }).catch(function (res) {alert(err)})
    },
    resTiXian({commit, state}, data){
      var params={
        mid:config.mid,
        openid:localStorage.getItem('openid'),
        t:config.t
      }
      axios.get(config.baseUrl+"/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=commission.log.get_list&i=2",params)
        .then(function (res) {
          console.log(res)
          // commit({
          //   type:'saveTixianData',
          //   res:res
          // })
        }).catch(function (err) {console.log('请求失败:'+err)})

    },
    resXiaXian({commit, state}, data){
      axios.get(config.baseUrl+"/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=commission.down.get_list&page=1&level=1",{params:data.params})
        .then(function (res) {
          console.log(res)
        }).catch(function (err) {console.log('请求失败:'+err)})
    },
    resTuiGuang({commit, state}, data){
      axios.get(config.baseUrl+"/app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile&r=commission.qrcode.get_main&mid="+localStorage.getItem('userid'))
        .then(function (res) {
          console.log(res)
          // commit({
          //   type:'saveTuiGuangData',
          //   res:res
          // })
        }).catch(function (err) {console.log('请求失败：'+err)})
    },
    resXiaoDianData({commit, state}, data){
      var params={
        t:config.t,
        mid:config.mid,
        openid:localStorage.getItem('openid')
      }
      axios.get(config.baseUrl+"/app/index.php?i=2&c=entry&m=ewei_shopv2&do=mobile&r=commission.myshop.set.get_main",params)
        .then(function (res) {
          console.log(res)
        }).catch(function (err) {console.log('请求失败：'+err)})
    },
    //代理中心
    resAgent({commit, state}, data){
      var agentParams={
        t:config.t,
        openid:localStorage.getItem('openid'),
        mid:localStorage.getItem('userid'),
        uniacid:config.uniacid
      }
      axios.get('http://cscs.ylhhyk.com/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=abonus.index.get_main',{params:agentParams})
        .then(function (res) {
          if(res.data.member.isagent==0){//没有申请分销商
            console.log('没有申请分销商')
            router.push({path:'/distributIndex/apply'})
          }else if(res.data.member.isagent==1&&res.data.member.status==0){//分销商申请了，审核中
            console.log('分销商申请了，审核中')
            router.push({path:'/distributIndex/wait'})
          }else if(res.data.member.isagent==1&&res.data.member.status==1){//已经是分销商了
            console.log('已经是分销商了')
            if(res.data.member.isaagent==0){//没注册代理
              console.log('没注册代理')
              router.push({path:'/agentIndex/agentRegist'})
            }else if(res.data.member.isaagent==1&&res.data.member.aagentstatus==0){//注册了代理，审核中
              console.log('注册了代理，审核中')
              router.push({path:'/agentIndex/agentWait'})
            }else{//已经是代理商了
              console.log('已经是代理商了')
              router.push({path:'/agentIndex/'})
            }
          }
        }).catch(function (err) {console.log('请求失败:'+err)})
    },
    registAgent({commit, state}, data){
      axios.post(' http://cscs.ylhhyk.com/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=abonus.register.get_main',data.params,{
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(function (res) {
        console.log(res)
      }).catch(function (err) {console.log('请求失败：'+err)})
    },
    //个人中心
    resWode({commit, state}, data) {
      //请求wodeHeadData
      function resWodeHeadData() {
        return axios.get(config.baseUrl+"/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=merch.xcxl",{params:data.params})
      }
      function resWodeBodyData() {
        return axios.get(config.baseUrl+"/app/index.php?c=wxapp&a=module&do=nav&type=3&uniacid="+config.uniacid)
      }
      axios.all([resWodeHeadData(), resWodeBodyData()])//一次性并发多个请求
        .then(axios.spread(function (wodeHeadData,wodeBodyData) {
          //当这三个个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
          commit({
            type: 'saveWodeData',
            data: {
              wodeHeadData: wodeHeadData,
              wodeBodyData: wodeBodyData
            }
          })
        }))
    },
    regist({commit, state}, data) {
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=merch.user.register',{params:data.params})
        .then(function (res) {
          if(res.msg=='注册成功'){
            router.push({path: '/vipIndex/login'})
          }
        }).catch(function (err) {console.log('请求失败:'+err)})
    },
    login({commit, state}, data) {
      axios.get(config.baseUrl+"/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=merch.user.passwordlogin",{params:data.params})
        .then(function (res) {
          console.log(res)
          if(res.data.data!={}){
            localStorage.setItem('openid',res.data.data.openid)
            localStorage.setItem('userid',res.data.data.mid)
          }
          commit({
            type:'saveLoginInfo',
            res:res
          })
        }).catch(function (err) {console.log('请求失败:'+err)})
    },
    resVipInfo({commit, state}, data){
      axios.get(config.baseUrl+"/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.info.get_main",{params:data.params})
        .then(function (res) {
          commit({
            type:'saveVipInfoData',
            data:res
          })
        }).catch(function (err) {console.log('请求失败:'+err)})
    },
    updatePersonInfo({commit, state}, data) {
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.info.submitapp', {params: data.params})
        .then(function (res) {
          // router.push({path: '/vipIndex'})
        }).catch(function (err) {
        alert(err)
      })
    },
    updateNickName({commit, state}, data){
      axios.post(config.baseUrl+"/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=merch.xcxl.alteravatar",data.params,{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }})
        .then(function (res) {
          console.log(res)
        }).catch(function (err) {console.log('请求失败:'+err)})
    },
    resAddress({commit, state}, data) {
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.address.indexapp',{params:data.params})
        .then(function (res) {
          commit({
            type: 'saveAddressList',
            res: res
          })
        }).catch(function (err) {
        alert(err)
      })
    },
    resDelAddress({commit, state}, data) {
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.address.delete', {params: data.params})
        .then(function (res) {
          //删除地址成功重新请求地址列表
          axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.address.indexapp&mid='+localStorage.getItem('userid')+'&t='+config.t)
            .then(function (res) {
              commit({
                type: 'saveAddressList',
                res: res
              })
            }).catch(function (err) {
            alert(err)
          })
        }).catch(function (err) {
        alert(err)
      })
    },
    saveWantEditAddress({commit, state}, data) {
      commit({
        type: 'saveWantEditAddress',
        params: data.params
      })
    },
    addOrUpdateAddress({commit, state}, data) {
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.address.submitapp', {params: data.params})
        .then(function (res) {
          console.log(res)
          router.push({path: '/vipIndex/myAddress'})
        }).catch(function (err) {
        alert(err)
      })
    },
    defaultAddress({commit, state}, data) {
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.address.setdefault&&state=we7sid-989f479443e701453157a809d00e2e0f&sign=56270194a41701253e0ca556eb6c9312', {params: data.params})
        .then(function (res) {
          //设置默认地址成功重新请求地址列表
          axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.address.indexapp&mid='+localStorage.getItem('userid')+'&t='+config.t)
            .then(function (res) {
              commit({
                type: 'saveAddressList',
                res: res
              })
            }).catch(function (err) {
            alert(err)
          })
        }).catch(function (err) {
        alert(err)
      })
    },
    saveSelAddress({commit, state}, data) {
      commit({
        type: 'saveSelAddress',
        data: data
      })
    },
    resMyOrder({commit, state}, data){
      var status=6;
      if(data.text=='全部'){status=6}else if(data.text=='待付款'){status=0}else if(data.text=='待发货'){status=1}else if(data.text=='待收货'){status=2}else if(data.text=='退换货'){status=4}
      var params={
        status:status,
        mid:localStorage.getItem('userid'),
        page:1,
        t:config.t
      }
      axios.get(config.baseUrl+"/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=order.index.get_list",{params:params})
        .then(function (res) {
          commit({
            type:'saveMyOrder',
            res:res,
            orderStatus:status
          })
        }).catch(function (err) {
        alert(err)
      })
    },
    resMyLike({commit, state}, data){
      console.log(data.params)
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.favorite.get_list',{params:data.params})
        .then(function (res) {
          commit({
            type:'saveMyLikeData',
            res:res
          })
        }).catch(function (err) {console.log('请求失败')})
    },
    resZuji({commit, state}, data){
      axios.get(config.baseUrl+'/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.history.get_list',{params:data.params})
        .then(function (res) {
          commit({
            type:'saveZujiData',
            res:res
          })
        }).catch(function (err) {console.log('请求失败')})
    }
  },
  mutations: {
    changeTitle(state, msg) {
      //根据路由修改页面title console.log(msg.fullPath, msg);
      document.title = state.nowTitle[msg.fullPath]
    },
    //首页
    saveHomeData(state, data) {
      VueSet(state, 'homeData', data.data.data.result)
      if (state.homeData != {}) {
        router.push({path: '/shopIndex/'})
      }
    },
    //分类
    saveSortData(state, data) {
      VueSet(state, 'sortData', data.res.data)
      if(state.sortData!={}){
        router.push({path: '/sortIndex/'})
      }
    },
    saveCommodityListData(state, data) {//商品列表
      console.log(data)
      VueSet(state, 'commodityListData', data.res.data.result)
      VueSet(state, 'sortid', data.sortid)
      if (state.commodityListData != {}) {
        router.push({path: '/sortIndex/someSort'})
      }
    },
    saveFujinData(state, data) {
      VueSet(state, 'Fujin_sortData', data.data.Fujin_sortData.data)
      VueSet(state, 'getFujin_slideData', data.data.getFujin_slideData.data)
      VueSet(state, 'Fujin_ListData', data.data.Fujin_ListData.data)
      console.log(state.getFujin_slideData)
      console.log(state.Fujin_sortData)
      console.log(state.Fujin_ListData)
      if (state.Fujin_sortData && state.getFujin_slideData && state.Fujin_ListData) {
        router.push({path: '/fujin/'})
      }
    },
    saveCommodityDetailData(state, data) {
      VueSet(state, 'commodityDetailData', data.data.commodityDetailData.data)
      VueSet(state, 'commodityColorSizeData', data.data.commodityColorSizeData.data.result)
      console.log('commodityColorSizeData-----------------------------------')
      console.log(state.commodityColorSizeData)
      if (state.commodityDetailData != {}) {
        router.push({path: '/sortIndex/detail'})
      }
    },
    changePayStaus(state, data) {
      VueSet(state, 'payStatus', data.payStatus)
    },
    saveBuyPageData(state, data) {
      VueSet(state, 'buyPageData', data.res.data)
      console.log(state.buyPageData)
      if (state.buyPageData != {}) {
        router.push({path: '/sortIndex/buyPage'})
      }

    },
    //  购物车
    saveCartData(state, data) {
      VueSet(state, 'cartData', data.res.data.result)
      if (state.cartData != {}) {
        router.push({path: '/cart/'})
      }
    },
    saveAddCartStatus(state,data){
      VueSet(state,'addCartStatus',data.data)
    },
    saveCartcount(state, data) {
      if (data.data == 0) {
        VueSet(state, 'cartcount', 0)
      } else {
        VueSet(state, 'cartcount', data.data.data.result.cartcount)
      }
    },
    //附近商家
    saveExclusiveShopData(state, data) {
      VueSet(state, 'exclusiveShopData', data.res.data.result)
      if (state.exclusiveShopData != {}) {
        router.push({path: '/fujinIndex/exclusiveShop'})
      }
      console.log('**************exclusiveShopData****************')
      console.log(state.exclusiveShopData)
    },
    //分销
    saveFenxiaoHead(state, data){
      VueSet(state, 'fenxiao_headData', data.data.data)
      console.log(state.fenxiao_headData)
      //在分销中心里,status为0表示未审核，1代表审核通过；register为0代表没注册过，1注册过
      if(state.fenxiao_headData.result.register==0){//没注册过
          router.push({path:'/distributIndex/apply'})
      }else if(state.fenxiao_headData.result.register==1&&state.fenxiao_headData.status==0){//注册过待审核
        router.push({path:'/distributIndex/wait'})
      }else{
        router.push({path:'/distributIndex'})
      }
    },
    saveFenxiaoBody(state, data){
      VueSet(state, 'fenxiao_bodyData', data.data.data)
    },
    savePriceData(state, data){
      VueSet(state,'priceData',data.res.data.result)
      console.log(state.priceData)
    },
    saveTixianData(state, data){
      VueSet(state,'tixianData',data.res)
      console.log(state.tixianData)
    },
    //个人中心
    saveWodeData(state,data){
      VueSet(state,'wodeHeadData',data.data.wodeHeadData.data)
      VueSet(state, 'wodeBodyData',data.data.wodeBodyData.data.module)
      if(state.wodeHeadData!={}&&state.wodeBodyData!={}){
        router.push({path: '/vipIndex'})
      }
    },
    saveLoginInfo(state, data) {
      VueSet(state, 'loginStatus', data.res.data.msg)
    },
    saveVipInfoData(state, data){
      console.log(data)
      VueSet(state,'vipInfoData',data.data.data.result.member)
      console.log(state.vipInfoData)
    },
    saveAddressList(state, data) {
      console.log(data.res.data.result)
      VueSet(state, 'myAddressData', data.res.data.result.list)
    },
    saveWantEditAddress(state, data) {
      VueSet(state, 'wantEditAddress', data.params)
      if (state.wantEditAddress != {}) {
        router.push({path: '/vipIndex/editAddress'})
      }
    },
    saveSelAddress(state, data) {
      VueSet(state, 'curSelAddress', data.data.item)
      console.log(state.curSelAddress)
      if (state.curSelAddress != {}) {
        router.push({path: '/sortIndex/buyPage'})
      }
    },
    saveMyOrder(state, data){
      console.log(data)
      VueSet(state,'myOrder',data.res.data.result)
      VueSet(state,'orderStatus',data.orderStatus)
      if(state.myOrder!={}&&state.orderStatus!=null){
        router.push({path: '/vipIndex/order'})
      }
    },
    saveMyLikeData(state, data){
      VueSet(state,'myLikeData',data.res.data.result)
      console.log(state.myLikeData)
    },
    saveZujiData(state, data){
      VueSet(state,'zuJiData',data.res.data.result)
      console.log(state.zuJiData)
    }
  }
}
