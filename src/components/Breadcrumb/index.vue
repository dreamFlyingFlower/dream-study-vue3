<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="item in moduleData.matched" :key="item.path" :to="{path:item.path}">
      {{item.meta.label ? item.meta.label : item.name}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts" setup>
import { reactive, watch, onMounted } from "vue";
import { useRoute } from 'vue-router';

const $route = useRoute();

const moduleData = reactive<any>({
  matched: []
});

onMounted(() => {
  if ($route) {
    moduleData.matched = $route.matched;
  }
});

watch(() => $route, () => {
  moduleData.matched = $route.matched;
}, { deep: true });
</script>

<style lang="scss" scoped>
</style>
