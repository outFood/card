<template>
  <div id="tuiguang">
    <headers title="推广二维码"></headers>
    <yd-slider autoplay="3000">
      <yd-slider-item>
        <a href="#">
          <img :src="qrcodeImg.img">
        </a>
      </yd-slider-item>
    </yd-slider>
    <div class="smile"><img :src="require('@/assets/Smile.png')" alt="">如何赚钱</div>
    <div class="buzhou">
      <div class="item">
        <span>第一步</span>
        <i>转发商品链接或商品图片给微信好友；</i>
      </div>
    </div>
    <div class="buzhou">
      <div class="item">
        <span>第二步</span>
        <i>从您转发的链接或图片进入商城的好友系统将自动锁定；</i>
      </div>
    </div>
    <div class="buzhou">
      <div class="item">
        <span>第三步</span>
        <i>您可以在分销中心查看【我的团队】和【佣金明细】；</i>
      </div>
    </div>
    <div class="shuoming">说明:分享后会带有独有的推荐码，您的好友访问后，系统会自动检测并记录客户关系。如果您的好友已被其他人抢先发展成客户,它就不能成为您的客户，以最早发展成为客户为准</div>
  </div>
</template>
<script>
  import config from '../../myConfig'
  import axios from 'axios'
  import headers from '@/components/headers'
  export default {
    components:{headers},
    data(){
      return {
        qrcodeText:{},
        qrcodeImg:{}
      }
    },
    beforeCreate(){
      var me=this,params={
        uniacid:config.uniacid,
        t:config.t,
        i:config.i,
        openid:localStorage.getItem('openid'),
        mid:localStorage.getItem('userid'),
        ispost:''
      }
      axios.get(config.baseUrl + "/app/index.php?c=entry&m=ewei_shopv2&do=mobile&r=commission.qrcode.get_main", {params:params})
        .then(function (restext) {
          params.ispost = '1'
          axios.get(config.baseUrl + "/app/index.php?c=entry&m=ewei_shopv2&do=mobile&r=commission.qrcode.get_main", {params:params})
            .then(function (resimg) {
              me.qrcodeText=restext.data.result.data
              me.qrcodeImg=resimg.data.result.data
            }).catch(function (err) {
            console.log('请求失败：' + err)
          })
        }).catch(function (err) {
        console.log('请求失败：' + err)
      })
     }
  }
</script>
<style>
  #tuiguang header {
    height: 1.5rem !important;
    align-items: center;
  }
  #tuiguang header .yd-navbar-center-title{
    font-size:.5rem !important;
  }
  #tuiguang .yd-back-icon:before, .yd-next-icon:before {
    font-size: .6rem;
  }
  #tuiguang{
    text-align: left;
    background: #fff;
    padding-bottom:0.46875rem;
  }
  #tuiguang .smile{
    padding:0.3125rem;
    background: #eee;
  }
  #tuiguang .smile img{
    width:0.625rem;
    height:0.625rem;
    vertical-align: middle;
    margin-right: 0.3125rem;
  }
  #tuiguang .buzhou{
    background: #fff;
    padding: 0  0.3125rem;
  }
  #tuiguang .buzhou .item{
    padding: 0.3125rem 0;
    border-bottom:1px solid #eee;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  #tuiguang .shuoming{
    background: orange;
    color:#fff;
    width:90%;
    margin:0.46875rem auto;
    padding: 0.3125rem;
    border-radius: 5px;
  }
</style>
