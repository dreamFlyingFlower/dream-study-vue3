<template>
  <!-- <div
    class="ScaleBox"
    ref="ScaleBox"
    :style="{ width: screenInfo.width + 'px', height: screenInfo.height + 'px' }"
  >
    <router-view />
  </div> -->
  <router-view />
</template>
<script lang="ts" setup>
import { onMounted, reactive, nextTick } from "vue";
const screenInfo = reactive({
  width: 1920,
  height: 1080,
  scale: 1,
});

onMounted(() => {
  // screenInfo.width = document.documentElement.clientWidth;
  screenInfo.height = document.documentElement.clientHeight;
  // setScale();
  // window.addEventListener("resize", debounce(setScale(), 100));
  nextTick(() => {
    if (window.screen.width <= 1920) {
      //  document.querySelector('body').setAttribute('style', 'zoom:80%;height:900px')
    }
  });
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
html,
body {
  margin: 0;
  min-height: 100%;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.el-table .cell{
  line-height: 20px;
}
.el-tabs--border-card>.el-tabs__content{
  padding: 0 0 10px;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 8px;
  cursor: pointer;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3);
  border-radius: 6px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
  -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(255, 0, 0, 0.4);
}
.el-sub-menu .el-menu-item{
  min-width: 160px;
}
</style>
