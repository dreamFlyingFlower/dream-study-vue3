<template>
  <el-tree
    :data="props.treeData"
    node-key="id"
    default-expand-all
    highlight-current
    check-on-click-node
    :expand-on-click-node="false"
    @node-click="handleNodeClick"
    :current-node-key="treeInfo.currentNode"
  >
    <!-- show-checkbox -->
    <template #default="{ node, data }">
      <span class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <!-- <a @click="append(data)"> Append </a>
              <a @click="remove(node, data)"> Delete </a> -->
        </span>
      </span>
    </template>
  </el-tree>
</template>

<script lang="ts" setup>
import { reactive, ref, watch, nextTick } from "vue";
import { Tree } from "../types/tree";

const props = defineProps({
  treeData: {
    type: Array,
    default: [],
  },
  selectedItem: {
    type: Function,
    required: true,
  },
  problemId: {
    type: Number,
    default: 0,
  },
  userId: {
    type: Number,
    default: 0,
  },
  dialog: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["handlerClick"]);

watch(
  () => props.treeData,
  (newVal: any) => {
    treeInfo.currentNode = newVal && newVal.length > 0 ? newVal[0].id : 0;
  }
);
const treeInfo = reactive({
  dataSource: [],
  taskItem: "",
  startTime: "",
  pageNum: 1,
  tabelTotal: 0,
  dialog: false,
  currentNode: 0,
});

// 调用父组件handlerClick(),传递当前节点数据
const handleNodeClick = (data: Tree) => {
  emit("handlerClick", data);
  props.selectedItem(data);
};
</script>

<style lang="scss" scoped>
.el-tree {
  height: 100%;
  ::v-deep .el-tree-node__content {
    height: 40px;
  }
}
</style>
