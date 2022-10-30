<template>
  <el-tree class="eam-font" :data="props.treeData" node-key="typeCode" :expand-on-click-node="false"
    @node-click="handleNodeClick" :current-node-key="moduleData.currentTypeCode" style="overflow:auto,fonst-size:10px"
    default-expand-all highlight-current check-on-click-node>
    <!-- show-checkbox -->
    <template #default="{ node }">
      <span class="custom-tree-node">
        <span>{{ node.label }}</span>
      </span>
    </template>
  </el-tree>
</template>

<script lang="ts" setup>
import { reactive, watch, onMounted, ref } from 'vue';
import { Tree } from '../types/tree';

const props = defineProps({
  treeData: { required: true, type: Object, default: [], },
  problemId: { type: Number, default: 0, },
  userId: { type: Number, default: 0, },
  dialog: { type: Boolean, default: false, },
});

const moduleData = reactive<any>({
  // 初始化的选中效果
  currentTypeCode: '0',
  treeHeight: "475px"
});

const emit = defineEmits(['handlerClick']);

watch(
  () => props.treeData, (newVal) => {
    moduleData.currentTypeCode = newVal && newVal.length > 0 ? newVal[0].typeCode : '0';
  }
)

onMounted(() => {
  moduleData.treeHeight = (window.innerHeight - 80) + "px";
  window.onresize = () => {
    setTreeHeight();
  }
});

function setTreeHeight() {
  moduleData.treeHeight = (window.innerHeight - 80) + "px";
}

const handleNodeClick = (data: Tree) => {
  emit("handlerClick", data);
}
</script>

<style lang="scss" scoped>
.custom-tree-node {
  font-size: 10px;
}
</style>