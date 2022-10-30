<template>
  <div class="login">
    <div class="content" style="margin: auto">
      <div class="content-left">
        <img alt class="logo" src="../../assets/login_images/logo_dt.png" />
        <img alt class="bg" src="../../assets/login_images/bg_left.png" />
      </div>
      <div class="content-right">
        <div style="display: flex; width: 100%">
          <div class="login-box">
            <div class="title">欢迎登录</div>
            <div class="title-en">WELCOME</div>
            <div class="form">
              <el-form
                :model="moduleData.formData"
                ref="formRef"
                :rules="moduleData.rules"
                size="medium"
                style="width: 100%"
              >
                <el-form-item prop="username">
                  <el-input
                    placeholder="用户名"
                    v-model="moduleData.formData.username"
                  >
                    <template #suffix>
                      <el-icon class="el-input__icon">
                        <user />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item prop="password">
                  <el-input
                    @keyup.enter="login"
                    placeholder="密码"
                    type="password"
                    v-model="moduleData.formData.password"
                  >
                    <template #suffix>
                      <el-icon class="el-input__icon">
                        <lock />
                      </el-icon>
                    </template>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    :loading="moduleData.loading"
                    @click="login"
                    class="button"
                    type="primary"
                    style="background-color: #1a5f94"
                    >登录
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="company">
          <img alt src="../../assets/login_images/line_left.png" />
          <span class="span">大唐互联科技(武汉)有限公司</span>
          <img alt src="../../assets/login_images/line_right.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ElForm } from "element-plus";
import { reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import store from "../../store";

const moduleData = reactive<any>({
  formData: {
    username: "MES2_admin",
    password: "123456",
    checked: false,
  },
  loading: false,
  redirect: "",
  otherQuery: {},
  rules: {
    username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
    password: [
      { required: true, message: "请输入密码", trigger: "blur" },
      {
        min: 6,
        max: 12,
        message: "密码长度必须为 6 到 12 个字符",
        trigger: "blur",
      },
    ],
  },
});

const formRef = ref<InstanceType<typeof ElForm>>();
const $route = useRoute();
const $router = useRouter();

const login = () => {
  formRef.value!.validate((valid: Boolean | undefined) => {
    if (valid) {
      moduleData.loading = true;
      store.dispatch("loginByUsername", {
          username: moduleData.formData.username,
          password: moduleData.formData.password,
        }).then(() => {
          let queryData = $route.query;
          let redirectUrl = queryData.redirect;
          delete queryData.redirect;
          $router.push({
            path: "/device",
            query: queryData,
          });
          moduleData.loading = false;
        })
        .catch(() => {
          moduleData.loading = false;
        });
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};
</script>

<style lang="scss" scoped>
.login {
  width: 100%;
  height: 100vh;
  background-color: #f0f4fa;
  display: flex;
  .content {
    display: flex;
    width: 50%;
    min-width: 1000px;
    background-color: #fff;
    box-shadow: 0px 1px 32px 0px rgba(34, 45, 60, 0.05);
    border-radius: 10px;
    .content-left {
      width: 100%;
      .bg {
        width: 100%;
        height: 100%;
        border-bottom-left-radius: 10px;
        border-top-left-radius: 10px;
      }

      .logo {
        position: absolute;
        margin-left: 30px;
        margin-top: 26px;
        width: 8%;
        min-width: 100px;
      }
    }
    .content-right {
      width: 100%;
      .login-box {
        margin: 0 auto;
        margin-top: 16%;
        width: 52%;
        text-align: left;
        .title-en {
          font-size: 30px;
          font-family: PingFang SC;
          color: #212121;
          opacity: 0.1;
          border-bottom: 2px solid #dde2eb;
          width: 100%;
          padding-bottom: 5px;
          padding-left: 60px;
          padding-top: 10px;
          margin-bottom: 40px;
        }
        .title {
          position: absolute;
          color: #212121;
          font-size: 30px;
          min-width: 130px;
        }
        .form {
          display: flex;
          justify-content: center;
          width: 100%;
          ::v-deep {
            .el-input__inner {
              width: 100%;
              border-top-width: 0px;
              border-left-width: 0px;
              border-right-width: 0px;
              border-bottom-width: 1px;
              border-radius: 0;
            }
          }
          .password {
            width: 100%;
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            span {
              color: #069ad5;
              cursor: pointer;
            }
            ::v-deep {
              .el-checkbox__label {
                font-size: 12px;
              }
            }
          }
          .button {
            width: 100%;
            height: 36px;
            border-radius: 2px;
            color: #fff;
            border: none;
            font-size: 18px;
            margin-bottom: 10px;
            margin-top: 30px;
          }
          .login-text {
            color: #212121;
            height: 20px;
            p {
              position: absolute;
              background-color: #fff;
              height: 20px;
              line-height: 20px;
              margin-top: -10px;
              width: 100px;
              text-align: center;
              margin-left: 70px;
              font-size: 12px;
            }
            hr {
              color: #dde2eb;
            }
          }
          .other-login {
            display: flex;
            justify-content: space-evenly;
            img {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}
.company {
  margin-top: 160px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 500px;
  font-size: 14px;
  color: #808080;
  img {
    width: 140px;
  }
  .span {
    margin: 0 10px;
  }
}
// 覆盖全局样式
.el-input {
  max-width: 400px;
}
::v-deep {
  .el-form-item.is-success .el-input__inner,
  .el-form-item.is-success .el-input__inner:focus,
  .el-form-item.is-success .el-textarea__inner,
  .el-form-item.is-success .el-textarea__inner:focus {
    border-color: #666;
  }
}
</style>
