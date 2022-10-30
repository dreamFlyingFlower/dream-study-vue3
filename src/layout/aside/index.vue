<template>
  <!-- <el-icon class="is-loading">
    <loading />
  </el-icon> -->
  <el-menu
    :default-active="menudata.activeName"
    class="el-menu-vertical-demo"
    :collapse="menudata.isCollapse"
    :unique-opened="true"
    background-color="#003F72"
    text-color="#EEEEEE"
    active-text-color="#EEEEEE"
    style="margin-right:-1px"
  >
  <!-- transparent -->
    <template v-for="item in menudata.menuList" :key="item.id">
      <el-sub-menu :index="item.path" v-if="item.children">
        <template #title>
          <component class="el-icon" :is="item.icon"></component>
          <span>{{ item.label }}</span>
        </template>
        <el-menu-item
          v-for="items in item.children"
          :key="items.id"
          :index="items.path"
          @click="selectMenu(items)"
        >
          <component class="el-icon" :is="items.icon"></component>
          {{ items.label }}</el-menu-item
        >
      </el-sub-menu>
      <el-menu-item :index="item.path" v-else @click="selectMenu(item)">
        <component class="el-icon" :is="item.icon"></component>
        <template #title>{{ item.label }}</template>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script lang="ts" setup>
import { reactive, onMounted, nextTick, unref } from "vue";
import store from "../../../src/store/index";
// import { Location, Menu as IconMenu } from "@element-plus/icons";
import router from "../../router";
let menudata = reactive<{
  menuList: any;
  isCollapse: boolean;
  activeName: string;
}>({
  menuList: [],
  isCollapse: false,
  activeName: "",
});

const selectMenu = (item: any) => {
  console.log(item);
  // console.log(store.getters.addTabs(111));
  store.commit("setActiveRoute", item);
  router.push(item.path);
};
const getMuse = () => {
  menudata.menuList = store.state.menuList;
  nextTick(() => {
    let routerPathData = router.currentRoute.value.path.split("/");
    let routerVal = routerPathData[routerPathData.length - 1];
    let routerPath = filterActive(menudata.menuList, routerVal);
    menudata.activeName = routerPath.length > 0 ? routerPath[0].path : "home";
    store.commit("setActiveRoute", routerPath[0]);
  });
};
const filterActive = (filterArray: any, filterTerm: string, activePath: any = []) => {
  filterArray.forEach((e: any) => {
    if (e.children && e.children.length) {
      filterActive(e.children, filterTerm, activePath);
    } else {
      if (e.path.includes(filterTerm)) {
        activePath.push(e);
      }
    }
  });
  return activePath;
};

onMounted(() => {
  getMuse();
});
</script>

<style lang="scss" scoped>
.el-menu-item.is-active {
  background: #5a778e;
}
</style>
