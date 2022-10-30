<template>
  <el-header class="headerWrap">
    <div class="headerTop">
      <div>
        <!-- <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ tabs.activeLabel }}</el-breadcrumb-item>
        </el-breadcrumb> -->
        <Breadcrumb />
      </div>

      <div class="userInfoWrap">
        <div class="userNamewrap">
          <p class="userName">{{ userInfo.userName }}</p>
          <p>{{ userInfo.loginDate }}</p>
        </div>
        <el-dropdown>
          <div class="block">
            <el-avatar
              :size="40"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            ></el-avatar>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changepassword.dialog = true"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item @click="signOut">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <!-- <div class="headerTabs">
      <el-tabs
        class="tabswrap"
        v-model="tabs.activeTabs"
        type="card"
        closable
        @tab-click="tabSelected"
        @tab-remove="removeTab"
      >
        <el-tab-pane
          v-for="item in tabs.tabsList"
          :key="item.id"
          :label="item.label"
          :name="item.path"
        >
        </el-tab-pane>
      </el-tabs>
    </div> -->
    <el-dialog
      v-model="changepassword.dialog"
      title="修改密码"
      width="30%"
      center
    >
      <el-form
        ref="userInfoForm"
        :rules="changePasswordRules"
        :model="changepassword"
        label-width="120px"
      >
        <el-form-item label="当前密码：" prop="oldPassword">
          <el-input v-model="changepassword.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码：" prop="newPassword">
          <el-input v-model="changepassword.newPassword"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="changePassword">确认修改</el-button>
          <el-button @click="changepassword.dialog = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </el-header>
</template>

<script lang="ts" setup>
import { ElMessage } from "element-plus";
import { reactive, onMounted, watch } from "vue";
import router from "../../router";
import store from "../../store";
import { saveToken } from "../../utils/localStorageUtils";
import Breadcrumb from "../../components/Breadcrumb/index.vue";

let tabs = reactive<{
  tabsList: any;
  activeTabs: any;
  tabIndex: any;
  activeLabel: any;
}>({
  tabsList: [],
  activeTabs: "",
  tabIndex: 0,
  activeLabel: "",
});

const changepassword = reactive({
  newPassword: "",
  oldPassword: "",
  dialog: false,
});
const userInfo = reactive({
  userName: "",
  loginDate: "",
  userId: 0,
});
const changePasswordRules = reactive({
  newPassword: [
    {
      required: true,
      message: "请输入新密码",
      trigger: "blur",
    },
  ],
  oldPassword: [
    {
      required: true,
      message: "请输入旧密码",
      trigger: "blur",
    },
  ],
});
watch(
  () => store.state.tabsIndex,
  () => {
    // tabs.tabIndex = store.state.tabsIndex;
    // tabs.activeTabs = tabs.tabsList[store.state.tabsIndex].path;
    // tabs.activeLabel = tabs.tabsList[store.state.tabsIndex].label;
  }
);
watch(
  () => store.state.tabsList,
  () => {
    if (store.state.tabsList) {
      tabs.tabsList = store.state.tabsList;
    }
  },
  { immediate: true, deep: true }
);
onMounted(() => {
  // getUserProfile();
});
// 获取用户权限
const getUserProfile = () => {
  // api.article.userProfile().then((res: any) => {
  //   console.log(res.data);
  //   if (res.data.code == 200) {
  //     userInfo.userId = res.data.data.userId;
  //     userInfo.userName = res.data.data.userName;
  //     userInfo.loginDate = res.data.data.loginDate
  //       .replace("T", " ")
  //       .substring(0, 16);
  //   }
  // });
};

// 退出登录
const signOut = (row: any) => {
  store.dispatch("logout");
  ElMessage.success("退出成功！");
  saveToken("");
  store.commit("clearAuthority");
  router.push("/login");
  location.reload();
};

// 修改密码
const changePassword = () => {
  // api.article
  //   .updatePwd({
  //     newPassword: changepassword.newPassword,
  //     oldPassword: changepassword.oldPassword,
  //   })
  //   .then((res: any) => {
  //     if (res.data.code == 200) {
  //       ElMessage.success("修改成功，请重新登录！");
  //       saveToken("");
  //       router.push("/Login");
  //     }
  //   });
};
const tabSelected = (selectedTab: any) => {
  store.commit("setTabIndex", selectedTab.index);
  router.push(tabs.activeTabs);
};

const removeTab = (targetName: any) => {
  let ActiveIndex = tabs.tabsList.findIndex((e: any) => {
    return e.path == targetName;
  });
  store.commit("delTabs", ActiveIndex);
  console.log(ActiveIndex == tabs.tabIndex);
  console.log(ActiveIndex);
  if (ActiveIndex == tabs.tabIndex) {
    router.push(tabs.tabsList[tabs.tabsList.length - 1].path);
  }
};
</script>

<style lang="scss" scoped>
.headerWrap {
  height: 50px;
  // box-sizing: border-box;
  .headerTop {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .userInfoWrap {
    display: flex;
    align-items: center;
    height: 50px;
    .userNamewrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      p {
        margin: 0;
        padding: 0;
        font-size: 12px;
        color: #666;
      }
      .userName {
        font-size: 16px;
        color: #333;
        margin-bottom: 8px;
      }
    }
  }
  .headerTabs {
    width: 100%;
    height: 40px;
    .tabswrap {
      width: 100%;
      .is-active {
        background: #003f72;
        color: #eee;
      }
    }
  }
}
</style>
