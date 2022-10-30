<template>
  <div class="loginWrap">
    <div class="loginForm">
     
    </div>
    <div class="welcomeWrap">
     
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, toRefs, onMounted } from "vue";
import api from "../api/spareType";
import { saveToken } from "../utils/localStorageUtils";
import router from "../router";
const loginForm = reactive({
  username: "",
  password: "",
});
const loginForms = ref();
const loginRules = reactive({
  username: [
    {
      required: true,
      message: "请先输入用户名",
      trigger: "blur",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入正确的密码",
      trigger: "blur",
    },
  ],
});

const onSubmit = () => {
 
};
</script>

<style lang="scss" scoped>
.loginWrap {
  width: 100%;
  height: 100vh;
  // background: url("../assets/loginbg.png") no-repeat center;
  // background-size: cover;
  // position: relative;
}
.loginForm {
  position: absolute;
  right: 20%;
  top: 50%;
  width: 544px;
  height: 650px;
  margin-top: -325px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-sizing: border-box;
  padding: 53px 48px;
  .loginTitle {
    height: 80px;
    font-size: 56px;
    font-family: Source Han Sans CN;
    font-weight: 500;
    color: #003f72;
    line-height: 80px;
    margin: 0;
  }
  .loginSubtitle {
    height: 24px;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #222222;
    line-height: 24px;
    opacity: 0.67;
  }
  .inputForm {
    margin-top: 66px;
  }
  .el-input {
    color: #a5a5a5;
    font-size: 24px;
  }
  .el-button {
    width: 100%;
  }
  .loginBtn {
    height: 64px;
    background: #003f72;
    box-shadow: 0px 10px 24px 0px rgba(44, 102, 200, 0.28);
    border-radius: 32px;
    font-size: 28px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
    line-height: 40px;
    margin-top: 52px;
  }
}
.welcomeWrap {
  position: absolute;
  left: 15%;
  top: 50%;
  width: 544px;
  height: 544px;
  margin-top: -272px;
  padding: 71px 65px;
  text-align: left;
  h5 {
    font-size: 40px;
    font-family: Source Han Sans CN;
    font-weight: 300;
    color: #ffffff;
    line-height: 48px;
    margin: 0;
  }
  .splitLine {
    width: 42px;
    height: 3px;
    background: #ffffff;
    margin: 30px 0 100px;
  }
  h4 {
    font-size: 60px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #ffffff;
    line-height: 72px;
    margin: 0;
  }
}
@media screen and (max-width: 1550px){
  .welcomeWrap{
    transform: scale(0.75);
    left: 10%;
  }
  .loginForm{
    transform: scale(0.75);
    right: 15%;
  }
}
</style>
