<template>
  <div id="vip" v-if="wodeHeadData&&wodeBodyData">
    <headers title="会员中心"></headers>
    <div id="head">
      <p>
        <!--<router-link to="#"><img src="/static/img/msg.png" alt=""></router-link>-->
        <router-link to="#"  @click.native="toWhere('vipIndex/set')"><img :src="require('@/assets/set.png')" alt=""></router-link>
        <router-link to="#" @click.native="toWhere('vipIndex/vipInfo')"><img :src="require('@/assets/personInfo.png')" alt=""></router-link>
        <!--<span>1</span>-->
      </p>
      <div class="personInfo">
        <router-link to="#" @click.native="toWhere('/vipIndex/nickname')" class="headPic" tag="div"><img
          :src="wodeHeadData.avatar"></router-link>
        <router-link to="/vipIndex/login"  v-if="openid==null||openid==''" class="toLogin">请点击登录</router-link>
        <div v-if="openid!=null&&openid!=''">
          <span>{{wodeHeadData.nickname==''?'未设置昵称':wodeHeadData.nickname}}</span>
          <span>【{{wodeHeadData.levelname?wodeHeadData.levelname:'普通会员'}}】</span>
          <span>ID:{{id}}</span>
        </div>
        <div v-if="openid!=null&&openid!=''">
          <span>余额</span>
          <span>{{wodeHeadData.credit2?wodeHeadData.credit2:0.00}}</span>
          <router-link to="/vipIndex/recharge" class="btn">充值</router-link>
        </div>
        <div v-if="openid!=null&&openid!=''">
          <span>积分</span>
          <span>{{wodeHeadData.credit1?wodeHeadData.credit1:0}}</span>
          <router-link to="#" class="btn" style="visibility: hidden">获取</router-link>
        </div>
      </div>
    </div>
    <div class="zijin">
      <div><span @click="toWhere('/vipIndex/myPrice')">我的资金:0.00</span></div>
      <div @click="toWhere('/vipIndex/AddOrReduce')"><span>资金来往</span></div>
      <div><span @click="toWhere('/vipIndex/replaceLogin')">授权登录</span></div>
      <div @click="toWhere('/vipIndex/record')"><span>返还记录</span></div>
    </div>
    <div class="dingdan">
      <router-link to="#" class="top" @click.native="lookOrder('全部')">
        <span>我的订单</span>
        <div>查看全部订单 <img :src="require('@/assets/more.png')" alt=""></div>
      </router-link>
      <div class="bottom">
        <router-link to="#" v-for="(item,key) in orderData" :key="key"  @click.native="lookOrder(item.text)"><img :src="item.iconSrc">{{item.text}}</router-link>
      </div>
    </div>
    <div class="other">
      <div class="other-head">
        其他
      </div>
      <div class="other-content">
        <router-link v-for="(item,key) in menuData" :key="key" to="#" @click.native="toOther(item.text)"><img :src="item.iconSrc">{{item.text}}
        </router-link>
      </div>
    </div>
    <footers></footers>
  </div>
</template>
<script>
  import config from '../../myConfig'
  import router from '@/router'
  import headers from '@/components/headers'
  export default {
    components:{headers},
    data(){
      return {
        title:'会员中心',
        openid:localStorage.getItem('openid'),
        id:localStorage.getItem('userid')
      }
    },
    computed: {
      wodeHeadData(){
        return this.$store.state.wodeHeadData
      },
      wodeBodyData(){
        return this.$store.state.wodeBodyData
      },
      menuData() {
        var menuData=this.$store.state.wodeBodyData.data.module.listmenu.data
        for(var i=0;i<menuData.length;i++){
          if(menuData[i].text=='全部订单'){
            menuData[i].iconSrc=require('@/assets/footmark.png')
          }else if(menuData[i].text=='我的关注'){
            menuData[i].iconSrc=require('@/assets/black-heart.png')
          }else if(menuData[i].text=='我的足迹'){
            menuData[i].iconSrc=require('@/assets/footmark.png')
          }else if(menuData[i].text=='我的地址'){
            menuData[i].iconSrc=require('@/assets/position.png')
          }else if(menuData[i].text=='领取优惠券'){
            menuData[i].iconSrc=require('@/assets/get.png')
          }else if(menuData[i].text=='我的优惠券'){
            menuData[i].iconSrc=require('@/assets/quan.png')
          }
        }
        return menuData
      },
      orderData(){
        var orderData=this.$store.state.wodeBodyData.data.module.menu.data
        for(var i=0;i<orderData.length;i++){
          if(i==0){
            orderData[0].iconSrc=require('@/assets/waitPay.png')
          }else if(i==1){
            orderData[1].iconSrc=require('@/assets/waitSend.png')
          }else if(i==2){
            orderData[2].iconSrc=require('@/assets/waitGet.png')
          }else if(i==3){
            orderData[3].iconSrc=require('@/assets/waitBack.png')
          }
        }
        return orderData
      },
    },
    methods: {
      lookOrder(text){
        var openid=localStorage.getItem('openid')
        var mid=localStorage.getItem('userid')
        if(openid!=null&&openid!='undefined'&&mid!=null&&mid!='undefined'){
          this.$store.dispatch({
            type:'resMyOrder',
            text:text
          })
        }else{
          this.$dialog.confirm({
            title: '提示',
            mes: '请先登录！',
            opts: () => {
              router.push({path: 'vipIndex/login'})
            }
          });
        }
      },
      toOther(text){
        var openid=localStorage.getItem('openid')
        var mid=localStorage.getItem('userid')
        if(openid!=null&&openid!='undefined'&&mid!=null&&mid!='undefined'){
          if(text=='我的关注'){
            router.push({path: '/vipIndex/myLike'})
          }else if(text=='我的足迹'){
            router.push({path: '/vipIndex/zuji'})
          }else if(text=='我的地址'){
            router.push({path: '/vipIndex/myAddress'})
          }else if(text=='领取优惠券'){
            router.push({path: '/vipIndex/getQuan'})
          }else if(text=='我的优惠券'){
            router.push({path: '/vipIndex/myQuan'})
          }
        }else{
          this.$dialog.confirm({
            title: '提示',
            mes: '请先登录！',
            opts: () => {
              router.push({path: 'vipIndex/login'})
            }
          });
        }
      },
      toWhere(toStr){
         var openid=localStorage.getItem('openid')
         var mid=localStorage.getItem('userid')
         if(openid!=null&&openid!='undefined'&&mid!=null&&mid!='undefined'){
           if(toStr=='/vipIndex/myPrice'||toStr=='/vipIndex/replaceLogin'){
             this.$dialog.toast({
               mes:'此功能暂未开放！',
               timeout: 500,
             });
           }else{
             router.push({path:toStr})
           }
         }else{
           this.$dialog.confirm({
             title: '提示',
             mes: '请先登录！',
             opts: () => {
               router.push({path: 'vipIndex/login'})
             }
           });
         }
      },
      back:function () {
        this.$router.go(-1)
      }
    },
    beforeCreate(){
      this.$store.dispatch({
        type: 'resWode',
        params:{
          openid:localStorage.getItem('openid'),
          mid:localStorage.getItem('userid'),
          t:config.t,
          uniacid:config.uniacid,
          i:config.i
        }
      })
    },
  }
</script>
<style>
  #vip{
    overflow-y: scroll;
  }
  #vip .yd-navbar-item>a {
    font-size: .45rem;
    visibility: hidden;
  }
  #vip #head {
    background: #00c2aa;
    padding: 0.3125rem;
  }
  #vip #head .toLogin{
    color:#fff;
  }
  #vip #head p {
    position: relative;
    height: 1rem;
  }
  #vip #head p img {
    width: 0.78125rem;
    height: 0.78125rem;
    float: right;
    margin-left: 0.3125rem;
  }
  #vip #head p span {
    display: inline-block;
    width: 0.46875rem;
    height: 0.46875rem;
    line-height: 0.46875rem;
    border-radius: 50%;
    background: red;
    color: #fff;
    position: absolute;
    top: 0;
    right: 0;
  }
  #vip #head .personInfo {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    color: #fff
  }
  #vip #head .personInfo .headPic img {
    width: 1.7rem;
    height: 1.7rem;
    border-radius: 50%;
    border:2px solid #fff;
  }
  #vip #head .personInfo > div {
    flex: 0 0 25%;
    text-align: center;
    line-height: 0.78125rem;
  }
  #vip #head .personInfo > div:nth-child(1) {
    flex: 0 0 20%;
  }
  #vip #head .personInfo > div:nth-child(2) {
    flex: 0 0 30%;
  }
  #vip #head .personInfo > div span {
    display: block;
  }
  #vip #head .personInfo > div .btn {
    display: block;
    color:#fff;
    border-radius: 0.3125rem;
    border: 1px solid #fff;
    width: 1.5625rem;
    height: 0.625rem;
    line-height: 0.625rem;
    margin: 0 auto;
    margin-top: 5px;
  }
  #vip .zijin {
    background: #fff;
    margin: 0.3125rem 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    flex-wrap: wrap;
  }
  #vip .zijin > div {
    flex: 0 0 50%;
    padding: 15px 0;
  }
  #vip .zijin > div:nth-child(1), .zijin > div:nth-child(2) {
    border-bottom: 1px solid #eee;
  }
  #vip .zijin > div span:nth-child(2n-1) {
    display: inline-block;
    width: 100%;
    border-right: 1px solid #eee
  }
  #vip .dingdan {
    background: #fff;
  }
  #vip .dingdan .top {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0.3125rem;
    border-bottom: 1px solid #eee;
  }
  #vip .dingdan .top img {
    width:0.625rem;
    height:0.625rem;
    vertical-align: middle;
  }
  #vip .dingdan .bottom {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    font-size:0.375rem;
  }
  #vip .dingdan .bottom > a {
    flex: 0 0 25%;
    padding: 0.3125rem 0;
  }
  #vip .dingdan .bottom > a:not(:last-child) {
    border-right: 1px solid #eee
  }
  #vip .dingdan .bottom > a img {
    width:1rem;
    height: 1rem;
    display: block;
    margin: 0 auto;
    margin-bottom: 5px;
  }
  #vip .other {
    margin: 0.3125rem 0 2.5rem 0;
    background: #fff;
  }
  #vip .other .other-head {
    padding: 0.3125rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  #vip .other .other-content {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    flex-wrap: wrap;
    font-size:0.375rem;
  }
  #vip .other .other-content > a {
    flex: 0 0 25%;
    padding:0.3125rem 0;
  }
  #vip .other .other-content > a:first-child{
    display: none;
  }
  #vip .other .other-content > a:not(:nth-child(5n)) {
    border-right: 1px solid #eee;
    border-bottom: 1px solid #eee;
  }
  #vip .other .other-content > a:nth-child(5n) {
    border-bottom: 1px solid #eee;
  }
  #vip .other .other-content > a img {
    width:0.8rem;
    height:0.8rem;
    display: block;
    margin: 0 auto;
    margin-bottom: 5px;
  }
</style>
