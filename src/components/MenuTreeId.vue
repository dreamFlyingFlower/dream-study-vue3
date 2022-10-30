<template>
  <el-tree :data="props.treeData" node-key="id" default-expand-all highlight-current check-on-click-node
    :expand-on-click-node="false" @node-click="handleNodeClick" :current-node-key="moduleData.currentNode">
    <template #default="{ node}">
      <span class="custom-tree-node">
        <span>{{ node.label }}</span>
      </span>
    </template>
  </el-tree>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";
import { Tree } from "../types/tree";

const props = defineProps({
  treeData: {
    type: Array,
    default: [],
  },
});

const moduleData = reactive({
  currentNode: 0,
});

const emit = defineEmits(["handlerClick"]);

watch(
  () => props.treeData,
  (newVal: any) => {
    moduleData.currentNode = newVal && newVal.length > 0 ? newVal[0].id : 0;
  }
);

// 调用父组件handlerClick(),传递当前节点数据
const handleNodeClick = (data: Tree) => {
  emit("handlerClick", data);
};
</script>

<style lang="scss" scoped>
.el-tree {
  height: 100%;
  font-size: 10px;
}
</style>