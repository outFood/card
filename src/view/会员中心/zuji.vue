<template>
  <div id="zuji">
    <headers title="我的足迹"></headers>
    <div v-if="list.length==0" class="noData"><span></span> 没有数据 <span></span></div>
    <div v-else>
      <div class="item" v-for="(item,key) in list" :key="key" @click="toGoods(item.goodsid)">
        <img :src="item.thumb">
        <div class="right">
          <h6>{{item.title}}</h6>
          <span>￥{{item.marketprice}}</span><i>￥{{item.productprice}}</i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import config from '../../myConfig'
  import axios from 'axios'
  import headers from '@/components/headers'
  export default {
    components:{headers},
    data(){
      return{
        list:[]
      }
    },
    beforeCreate(){
      var me=this,params={
        page:1,
        mid:localStorage.getItem('userid'),
        openid:localStorage.getItem('openid'),
        t:config.t,
        uniacid:config.uniacid
      }
      axios.get(config.baseUrl + '/app/index.php?from=wxapp&c=entry&m=ewei_shopv2&do=mobile&r=member.history.get_list', {params:params})
        .then(function (res) {
          me.list=res.data.result.data.list
        }).catch(function (err) {
        console.log('请求失败')
      })
    },

    methods: {
      toGoods(id){
        var openid=localStorage.getItem('openid')
        var mid=localStorage.getItem('userid')
        if(openid!=null&&openid!='undefined'&&mid!=null&&mid!='undefined'){
          this.$store.dispatch({
            type:'resCommodityDetailData',
            params:{
              id:id,
              t:config.t,
              i:config.i,
              uniacid:config.uniacid,
              mid:config.mid,
              openid:config.openid,
            }
          })
        }else{
          this.$dialog.confirm({
            title: '提示',
            mes: '请先登录！',
            opts: () => {
              router.push({path: '/vipIndex/login'})
            }
          });
        }
      },
    },
  }
</script>
<style>
  #zuji header {
    height: 1.5rem !important;
    align-items: center;
  }
  #zuji header .yd-navbar-center-title{
    font-size:.5rem !important;
  }
  #zuji .yd-back-icon:before, .yd-next-icon:before {
    font-size: .6rem;
  }
  #zuji .noData{
    margin-top:20px;
  }
  #zuji .noData span{
    display: inline-block;
    width:30%;
    height:8px;
    border-top:1px solid #eee;
  }
  #zuji .item{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    background: #fff;
    padding:10px;
    margin-bottom:10px;
    text-align: left;
  }
  #zuji .item>img{
    width:50px;
    height:50px;
    margin-right:10px;
  }
  #zuji .item .right h6{
    font-weight: bold;
  }
  #zuji .item .right span{
    color:red;
  }
  #zuji .item .right i{
    color:#999;
    text-decoration:line-through
  }
</style>
