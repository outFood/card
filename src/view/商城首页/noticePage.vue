<template>
  <div id="noticePage">
    <headers title="公告"></headers>
    <section>
      <h2>{{curNotice.title}}</h2>
      <p>
        <!--<span>E卡系统</span> -->
        发布时间:{{curNotice.createtime}}</p>
      <div v-html="curNotice.detail"></div>
      <img :src="curNotice.thumb" alt="">
    </section>
  </div>
</template>
<script>
  import router from '@/router'
  import headers from '@/components/headers'
  export default {
    components:{headers},
    data(){
      return{
        curNotice:JSON.parse(this.$route.query.item)
      }
    },
    methods:{
      back:function () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style>
  #noticePage section{
    background: #fff;text-align: left;padding: 0.3125rem;
  }
  #noticePage section  h2{
    font-size:0.6rem;
  }
  #noticePage section p{
    color:#8a8a8a;
    margin-top:.3125rem;
  }
  #noticePage section p span{
    color:blue;
  }
  #noticePage section img{
    display: block;
    width:90%;
    margin:0.9375rem auto;
  }
</style>
