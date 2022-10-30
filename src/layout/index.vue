<template>
  <el-container class="xcontainer">
    <el-aside class="aside-menu" width="200px">
      <img class="logo" src="../assets/logo.png" />
      <Aside></Aside>
    </el-aside>
    <el-container class="xmain">
      <Header></Header>
      <el-main class="mainWrap">
        <el-scrollbar height="100%">
          <!-- <transition> -->
          <!-- <keep-alive>
              <router-view />
            </keep-alive> -->
          <!-- </transition> -->
          <router-view v-slot="{ Component }">
            <!-- <router-view v-slot="{Component,route}"> -->
            <transition>
              <keep-alive>
                <div>
                  <component :is="Component" />
                </div>
              </keep-alive>
            </transition>
          </router-view>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts" setup>
import Aside from "./aside/index.vue";
import Header from "./header/index.vue";

</script>

<style>
.xcontainer {
  min-height: 100vh;
  width: 100%;
  /* height: 100%; */
  display: flex;

  /* overflow: hidden; */
  /* border: 1px solid #eee; */
}

.el-aside {
  color: var(--el-text-color-primary);
  width: 200px;
  overflow: hidden;
  background-color: #003f72;
}
.el-container {
  width: 100%;
}
.aside-menu{
  height: 100vh;
  overflow: auto;
}
.xmain {
  flex-direction: column;
}
.mainWrap {
  width: 100%;
  height: 100%;
  padding: 12px 20px 2px;
}
.logo {
  width: 100%;
  overflow: hidden;
}
.el-scrollbar__view {
  height: inherit;
}
</style>
