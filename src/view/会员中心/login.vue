<template>
  <div id="login">
    <headers title="会员登录"></headers>
    <form action="#">
      <div class="form-group">
        账号：
        <input type="text" required  v-model="phone" maxlength="11" placeholder="请输入手机号">
      </div>
      <div class="form-group">
        密码：
        <input type="password" required  v-model="pwd" maxlength="10" pattern="^(\w){6,10}$"  placeholder="6-10位数字、字母">
      </div>
    </form>
    <div class="otherDo">
      <router-link to="/vipIndex/wodeRegist">注册新账号</router-link>
      <router-link to="#">忘记密码?</router-link>
    </div>
    <yd-button size="large" type="primary" class="Btn" @click.native="toLogin">登录</yd-button>
    <router-link to="#"><yd-button size="large" type="primary" class="Btn">手机验证码登录</yd-button></router-link>
    <div class="otherLoginMethod">
      <div class="first">
        <span></span>第三方账号登录<span></span>
      </div>
      <div class="second" @click="otherLogin">
        <img :src="require('@/assets/weixin.png')" alt="">
        <img :src="require('@/assets/qq.png')" alt="">
      </div>
    </div>
  </div>
</template>
<script>
  import config from '../../myConfig'
  import router from '@/router'
  import headers from '@/components/headers'
  export default {
    components:{headers},
    data() {
      return {
        phone:'',
        pwd: '',
      }
    },
    computed:{
      loginStatus(){
        return this.$store.state.loginStatus
      }
    },
    methods:{
      openAlert() {
        this.$dialog.alert({
          mes:this.tipMsg
        });
      },
      toLogin(){
        var regMobile =/^[1][3,4,5,7,8][0-9]{9}$/;
        var regPwd=/^[a-zA-Z0-9]{6,10}$/
        if(this.phone==''){
          this.tipMsg='请填写手机号!'
          this.openAlert()
        }else if(this.phone.length!=11){
          this.tipMsg='请填写11位手机号!'
          this.openAlert()
        }else if(!regMobile.test(this.phone)){
          this.tipMsg='手机号格式输入有误!'
          this.openAlert()
        }else if(this.pwd==''){
          this.tipMsg='请输入密码!'
          this.openAlert()
        }else if(!regPwd.test(this.pwd)){
          this.tipMsg='密码必须由6到10位的数字或字母组成!'
          this.openAlert()
        }else{
          this.$store.dispatch({
            type:'login',
            params:{
              mobile:this.phone,
              pwd:this.pwd,
              t:config.t,
              ispost:1
            }
          })
          setTimeout(()=>{
            if(this.loginStatus.status==1){
              router.push({path:'/shopIndex'})
              this.$dialog.toast({
                mes:'登录成功！',
                timeout: 1500,
              });
            }else if(this.loginStatus.status==0){
              this.tipMsg='用户名或密码错误，请核对后再试！'
              this.openAlert()
            }
          },500)
        }
      },
      otherLogin(){
        this.$dialog.toast({
          mes:'此功能暂未开放！',
          timeout: 500
        });
      }
    }
  }
</script>

<style scoped>
  #login {
    position: fixed;
    top:0;right:0;bottom: 0;left:0;
    background: #fff;
  }
  #login .form-group{
    display:flex;
    align-items: center;
    font-size:0.5rem;
    padding:0.625rem;
    border-bottom: 1px solid #eee;
  }
  #login .form-group input{
    border:none
  }
  /**************/
  #login .otherDo{
    margin:0.78125rem;
    display:flex;
    justify-content: space-between;
    font-size:0.4375rem;
    color:#feae19;
  }
  #login .Btn{
    width:90%;
    height:1.25rem;
    margin:0.625rem auto;
    font-size:0.5rem;
  }
  #login .otherLoginMethod{
    font-size: 0.4375rem;
    color:#868686;
    padding-bottom:0.9375rem;
  }
  #login .otherLoginMethod .first{
    margin-bottom: 0.625rem;
  }
  #login .otherLoginMethod .first span{
    display: inline-block;
    height:7px;
    width:25%;
    border-top:1px solid #d4d4d4;
  }
  #login .otherLoginMethod .first span:nth-child(1){
    margin-right:0.3125rem;
  }
  #login .otherLoginMethod .first span:nth-child(2){
    margin-left:0.3125rem;
  }
  #login .otherLoginMethod .second img{
    width:1.5625rem;
    height:1.5625rem;
  }
  #login .otherLoginMethod .second img:nth-child(1){
    margin-right:0.625rem;
  }
  #login .otherLoginMethod .second img:nth-child(2){
    margin-left:0.625rem;
  }
</style>
