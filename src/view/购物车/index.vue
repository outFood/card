<template>
    <div id="cart" v-if="cartData">
    <yd-navbar title="购物车">
      <div  v-if="source==1" slot="left" @click.stop="goBack">
        <yd-navbar-back-icon></yd-navbar-back-icon>
      </div>
      <div to="#" slot="right" v-if="delShow" @click="delShow=false">
        完成
      </div>
      <div to="#" slot="right" v-else @click="delShow=true">
        编辑
      </div>
    </yd-navbar>
    <div class="shop" v-if="cartData.list.length>0">
      <div class="shop-item" v-for="(item,key) in cartData.list" :key="key">
        <div class="check">
          <img :src="require('@/assets/check.png')" alt="" v-if="item.selected==1" @click='selOrNo(item.id,0)'>
          <img :src="require('@/assets/no-check.png')" alt="" v-else @click='selOrNo(item.id,1)'>
        </div>
        <img :src="item.thumb" class="shopImg">
        <div class="right" @click="resCommodityDetailData(item.goodsid)">
          <h6>{{item.title}}</h6>
          <p>{{item.optiontitle}}</p>
          <span class="price">￥{{item.marketprice}}</span>
        </div>
        <span class="yd-spinner" style="height: 0.6rem; width: 2rem;">
          <a  @click="addOrReduceOrDel(['减',item.total,item.id,item.optionid,item.minbuy])"></a>
          <input type="number" readonly @change="inputChange(key)" pattern="[0-9]*" v-model="item.total" class="yd-spinner-input">
          <a  @click="addOrReduceOrDel(['加',item.total,item.id,item.optionid])"></a>
         </span>
      </div>
      <!--选择购买-->
      <div class="checkAll" v-if="delShow==false">
        <div class="left">
          <div class="check">
            <img :src="require('@/assets/check.png')" alt="" v-if="isCheckAll" @click='selOrNo("",0)'>
            <img :src="require('@/assets/no-check.png')" alt="" v-else @click='selOrNo("",1)'>
          </div>
          <div class="rit">合计：<span>￥{{cartData.totalprice}}</span><p>不含运费</p></div>
        </div>
        <div class="right" @click="subMitCart">结算({{cartNum}})</div>
      </div>
      <!--编辑删除-->
      <div class="edit" v-else>
        <div class="check">
          <img :src="require('@/assets/check.png')" alt="" v-if="isCheckAll" @click='selOrNo("",0)'>
          <img :src="require('@/assets/no-check.png')" alt="" v-else @click='selOrNo("",1)'>
        </div>
        <div class="delete" :class="{redDelete:checkedArr.length}" @click="addOrReduceOrDel(['删除'])">删除</div>
      </div>
    </div>
    <no-data v-else></no-data>
    <footers></footers>
  </div>
</template>
<script type="text/babel">
  import config from '../../myConfig'
  import noData from '@/view/购物车/noData'
  export default {
    components:{noData},
    data() {
      return {
        delShow:false,
        select:0,
        goodsId:'',
        source:'',//判断来源
      }
    },
    computed:{
      cartData(){
         return this.$store.state.cartData
      },
      cartNum(){
        var cartNum=0;
        for(var i=0;i<this.$store.state.cartData.list.length;i++){
          if(this.$store.state.cartData.list[i].selected=='1'){
            cartNum+=parseInt(this.$store.state.cartData.list[i].total)
          }
        }
        return cartNum
      },
      isCheckAll(){
        return this.$store.state.isCheckAll
      },
      checkedArr(){
        return this.$store.state.checkedArr
      }
    },
    methods: {
      addOrReduceOrDel(arr){//---------------------------------------
        if(arr[0]=='加'){
          this.$store.dispatch({
            type:'cartUpdate',
            params:{
              total:parseInt(arr[1])+1,
              optionid:arr[3],
              id:arr[2],
              t:config.t,
              i:config.i,
              uniacid:config.uniacid,
              mid:localStorage.getItem('userid'),
              openid:localStorage.getItem('openid'),
              source:2
            }
          })
        }else if(arr[0]=='减'){
          if(arr[1]>arr[4]){
            this.$store.dispatch({
              type:'cartUpdate',
              params:{
                total:parseInt(arr[1])-1,
                optionid:arr[3],
                id:arr[2],
                t:config.t,
                mid:localStorage.getItem('userid'),
                openid:localStorage.getItem('openid'),
                source:2
              }
            })
          }else{
            this.$dialog.toast({
              mes:'受不了了，宝贝不能再减少了哦',
              timeout: 1500
            });
          }
        }else if(arr[0]=='删除'){
          if(this.checkedArr){
            this.$store.dispatch({
              type:'cartDelete',
              params:{
                mid:localStorage.getItem('userid'),
                openid:localStorage.getItem('openid'),
                t:config.t,
                i:config.i,
                uniacid:config.uniacid,
                ids:this.checkedArr.join(','),
                source:2
              }
            })
          }
        }
      },
      resCommodityDetailData(id){
        this.$store.dispatch({
          type:'resCommodityDetailData',
          params:{
            id:id,
            t:config.t,
            mid:localStorage.getItem('userid'),
            openid:localStorage.getItem('openid')
          }
        })
      },
      selOrNo(id,selected){
        this.$store.dispatch({
          type:'selOrNo',
          params:{
            mid:localStorage.getItem('userid'),
            openid:localStorage.getItem('openid'),
            uniacid:config.uniacid,
            t:config.t,
            i:config.i,
            id:id,
            select:selected
          }
        })
      },
      subMitCart(){
        if(this.checkedArr.length>0){
          this.$store.dispatch({
            type:'subMitCart',
            params:{
              t:config.t,
              i:config.i,
              uniacid:config.uniacid,
              mid:localStorage.getItem('userid'),
              openid:localStorage.getItem('openid'),
            }
          })
        }else{
          this.$dialog.toast({
            mes:'请选择商品！',
            timeout: 1500,
          });
        }
      },
      goBack(){
        this.$router.go(-1);
      },
      //输入input数量
      inputChange(index){
        //数量超过库存 直接等于库存
        let item=this.cartData.list[index]
        if(item.total>item.maxbuy&&Number(item.maxbuy)!=0){
          if(item.total>item.stock){
            item.total=item.stock
          }else{
            item.total=item.maxbuy
          }
          console.log(item.total,item.stock)
        }else{
          if(item.total>item.stock){
            item.total=item.stock
          }
        }
      }
    },
    beforeCreate(){
      var openid=localStorage.getItem('openid')
      var mid=localStorage.getItem('userid')
      if(openid!=null&&openid!='undefined'&&mid!=null&&mid!='undefined'){
        //暂时不需要这个,重复请求了
        // this.$store.dispatch({
        //   type:'lookCart',
        //   params:{
        //     t:config.t,
        //     i:config.i,
        //     uniacid:config.uniacid,
        //     mid:localStorage.getItem('userid'),
        //     openid:localStorage.getItem('openid')
        //   }
        // })
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
    created(){
      if(this.$route.query){
        this.source=this.$route.query.source
      }
    }
  }
</script>
<style>
  #cart header{
    height:1.4rem !important;
    align-items: center;
  }
  .yd-navbar-center-title{
    font-size: .5rem !important;
  }
  .yd-navbar-item>a{
    font-size: .45rem;
  }
  #cart .shop{
    margin-bottom:3.44rem;
    background: #fff;
  }
  #cart .shop  .shop-item{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    padding:0.3125rem  0.3125rem 0.3125rem 0.3125rem;
    align-items: center;
    border-bottom: 1px solid #cdcdcd;
  }
  #cart .shop .check img{
    width:0.625rem;height:0.625rem;
  }
  #cart .shop  .shop-item .shopImg{
    width:2rem;
    height:2rem;
    margin-left:0.3125rem;
  }
  #cart .shop  .shop-item .right{
    margin-left:0.3125rem;
    text-align: left;
    flex: 0 0 45%;
  }
  .yd-spinner{
    height: 1rem !important;
    width: 3rem !important;
  }
  .yd-spinner>input{
    width:30%;
    font-size:0.7rem;display: inline-block;
  }
  .yd-spinner>a:after{
    font-size: 0.45rem;
  }
  .yd-spinner>a{
    width:35%;display: inline-block;
  }
  #cart .shop  .shop-item .right h6{
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size:0.5rem;

  }
  #cart .shop  .shop-item .right p{
    margin:0.3125rem 0;
    color: #777;
  }
  #cart .shop  .shop-item .right .price{
    color:red;
    font-size: 0.45rem
  }
  #cart .shop .checkAll{
    position: fixed;
    bottom:1.8rem;
    width:100%;
    height:1.8rem;
    background: #fff;
    z-index: 1;

    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
  }
  #cart .shop .checkAll .left{
    flex: 0 0 70%;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding:0 0.3125rem;
  }
  #cart .shop .checkAll .left .rit{
    text-align: right;
  }
  #cart .shop .checkAll .left .rit span{
    font-size:0.57rem;
    color:#ff5555;
    font-weight: bold;
  }
  #cart .shop .checkAll .left .rit p{
    font-size:0.44rem;
    color:#969696
  }
  #cart .shop .checkAll .right{
    flex: 0 0 30%;
    background: #ff5555;
    color:#fff;
    line-height: 1.72rem;
  }
  #cart .shop .edit{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    z-index: 1;

    width:100%;
    height:1.5625rem;
    background: #fff;
    position: fixed;
    bottom:1.875rem;

  }
  #cart .shop .edit .check{
    flex: 0 0 70%;
    text-align: left;
    padding-left:0.3rem;
  }
  #cart .shop .edit>div:not(:nth-child(1)){
    flex:0 0 30%;
    background: #ccc;
    height:100%;
    color:#fff;
    line-height: 1.5625rem;
  }
  #cart .shop .edit .delete{
    margin-right:5px;
  }
  #cart .redDelete{
    background: #ff5555 !important;
    color:#fff !important;
  }
</style>
