<template>
  <el-select :size="size" :clearable="clearable" :disabled="disabled" @clear="handlerClear" placeholder="请选择"
    ref="selectRef">
    <el-option value="">
      <el-tree :data="props.treeDatas" ref="selectTreeRef" :props="props.defaultProps"
        :node-key="props.defaultProps.value" :default-expanded-keys="moduleData.defaultExpandedKey"
        @node-click="handleNodeClick" :accordion="accordion" highlight-current default-expand-all>
      </el-tree>
    </el-option>
  </el-select>
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, watch, nextTick } from 'vue';
import type { ElTree } from 'element-plus'

const name = "tree-select";

const props = defineProps({
  // 树形结构显示属性
  defaultProps: {
    type: Object,
    default: { value: 'typeCode', label: 'label', children: 'children' }
  },
  // 选项列表数据(树形结构的对象数组)
  treeDatas: { type: Array, default: [] },
  // 初始值
  value: { default: null },
  // 可清空选项
  clearable: { type: Boolean, default: true },
  // 自动收起
  accordion: { type: Boolean, default: false },
  size: { type: String, default: null },
  disabled: { default: false }
});

const moduleData = reactive<any>({
  valueId: props.value,
  valueLabel: "",
  defaultExpandedKey: []
});

const selectRef = ref<any>();
const selectTreeRef = ref<InstanceType<typeof ElTree>>();

const emit = defineEmits(['initLabel', 'getValue', "selected"]);

watch(() => moduleData.valueId, (newVal) => {
  if (newVal || newVal == 0) {
    moduleData.valueId = newVal;
  } else {
    moduleData.valueId = null;
  }
  init();
});

onMounted(() => {
  init();
});

const init = () => {
  if (moduleData.valueId || moduleData.valueId == 0) {
    if (!(selectTreeRef.value!.getNode(moduleData.valueId))) {
      return false;
    }
    // 初始化显示名称
    moduleData.valueLabel = selectTreeRef.value!.getNode(moduleData.valueId).data[props.defaultProps.label];
    emit("initLabel", moduleData.valueLabel);
    // 设置下拉列表默认选中
    nextTick(() => {
      selectTreeRef.value!.setCurrentKey(moduleData.valueId, true);
    })
    // 设置默认展开
    moduleData.defaultExpandedKey = [moduleData.valueId];
  } else {
    moduleData.valueLabel = "";
  }
}

// 切换选项
const handleNodeClick = (node: any) => {
  if (node) {
    moduleData.valueLabel = node[props.defaultProps.label];
    moduleData.valueId = node[props.defaultProps.value];
  } else {
    moduleData.valueLabel = null;
    moduleData.valueId = null;
  }
  emit("getValue", node);
  emit('selected', node[props.defaultProps.value]);
  moduleData.defaultExpandedKey = [];
  selectRef.value!.blur();
}

// 清除选中
const handlerClear = () => {
  moduleData.valueLabel = null;
  moduleData.valueId = null;
  moduleData.defaultExpandedKey = [];
  emit('selected', null);
  emit("getValue", null);
}
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item {
  height: auto;
  max-height: 274px;
  padding: 0;
  overflow: hidden;
  overflow-y: auto;
}
.el-select-dropdown__item.selected {
  font-weight: normal;
}
ul li >>> .el-tree .el-tree-node__content {
  height: auto;
  padding: 0 20px;
}
.el-tree-node__label {
  font-weight: normal;
}
.el-tree >>> .is-current .el-tree-node__label {
  color: #409eff;
  font-weight: 700;
}
.el-tree >>> .is-current .el-tree-node__children .el-tree-node__label {
  color: #606266;
  font-weight: normal;
}
</style>