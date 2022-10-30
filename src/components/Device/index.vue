<template>
  <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="moduleData.dialogVisible" title="设备信息" width="60%"
    center>
    <el-card shadow="hover">
      <div class="InquireList">
        <el-input size="small" v-model="moduleData.slowSearch" placeholder="设备名称,编码" @keyup.enter="getList" clearable />
        <TreeSelect v-model="moduleData.typeName" :tree-datas="moduleData.treeData" :props="defaultProps"
          :placeholder="'类型编码'" size="small" :value="null" @getValue="getValue" @selected="selected" />
        <el-input size="small" v-model="moduleData.useDept" placeholder="使用部门" @keyup.enter="getList" clearable />
        <el-button size="small" type="primary" @click="getList">查询</el-button>
      </div>
    </el-card>
    <el-table class="spareTable" :data="moduleData.tableDatas" empty-text="暂无数据"
      @selection-change="handlerSelectionChange" @row-click="handlerRowClick" @row-dblclick="handlerRowDbclick"
      style="width: 100%;min-height:120px;font-size:10px" :header-cell-style="{ padding : 0}"
      :cell-style="{ padding : 0}" border fit highlight-current-row>
      <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
      <el-table-column v-if="props.multiple" type="selection" width="45" align="center" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="deviceName" label="设备名称" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="deviceCode" label="设备编码" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="typeName" label="设备类型">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="modelNumber" label="设备型号" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="useDept" label="使用部门" />
    </el-table>
    <el-pagination class="userPagination" small="small" layout="prev, pager, next" :total="moduleData.tabelTotal"
      @current-change="switchPageNum"></el-pagination>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirm">确定 </el-button>
        <el-button @click="onCancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import type { DeviceEntity } from "../../types/device";
import api from "../../api/device";
import apiDeviceType from "../../api/deviceType";
import { toTreeCodeUnchange } from "../../utils/toTree";
import { resloveTree } from '../../utils/simpleUtil';
import TreeSelect from '../TreeSelect.vue';

// 声明从组件传递的属性
const props = defineProps({
  showDialog: { type: Boolean, default: false, },
  // 是否多选,默认true可多选
  multiple: { type: Boolean, default: true, },
});

const moduleData = reactive<any>({
  dialogVisible: props.showDialog,
  tableDatas: [],
  // 设备类型选框树形结构数据
  treeData: null,
  // 设备类型树形结构选中节点
  treeNode: null,
  // 查询条件设备类型编码
  typeCode: null,
  // 查询条件设备类型名称
  typeName: null,
  // 查询条件使用部门
  useDept: null,
  // 查询条件设备名称或设备编码
  slowSearch: "",
  // 当前选中行
  currentRow: null,
  pageNum: 1,
  tabelTotal: 0
});

// 声明设备类型树形选择框的显示属性,传递给treeSelect组件
const defaultProps = {
  value: 'typeCode',
  label: 'label',
  children: 'children'
};

// 点选表格前的勾选框操作
const multiselects = ref<DeviceEntity[]>([]);

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);

// 初始化操作
onMounted(async () => {
  getDeviceType();
  getList();
});

// 切换页码
const switchPageNum = (val: any) => {
  moduleData.pageNum = val;
  getList();
};

// 获得设备类型列表,并转成树形结构
const getDeviceType = (): void => {
  apiDeviceType.apis.getList({}).then((res: any) => {
    moduleData.treeData = toTreeCodeUnchange(res.data, "设备类型");
  });
}

// 查询设备列表
const getList = (): void => {
  api.apis.getList({
    typeCode: moduleData.typeCode,
    useDept: moduleData.useDept,
    slowSearch: moduleData.slowSearch,
    currentPage: moduleData.pageNum,
    pageSize: 10,
  }).then((res: any) => {
    moduleData.tableDatas = res.data.list;
    moduleData.tabelTotal = res.data.pages.count;
  });
};

// 多选操作
const handlerSelectionChange = (val: DeviceEntity[]) => {
  multiselects.value = val;
}

// 单选操作
const handlerRowClick = (val: any) => {
  moduleData.currentRow = val;
}

// 单选时才会触发该事件
const handlerRowDbclick = (val: any) => {
  if (props.multiple) {
    return;
  } else {
    emit("closeDialog", [val])
  }
}

// edit组件树形结构点击回调方法,参数为整个节点数据
const getValue = (node: any) => {
  if (node) {
    moduleData.typeName = node.label;
    moduleData.treeNode = node;
    moduleData.typeCode = resloveTree(node);
  } else {
    moduleData.typeName = null;
    moduleData.treeNode = null;
    moduleData.typeCode = null;
  }
}

// edit组件树形结构点击回调方法,参数为节点的typeCode
const selected = (node: string) => {
}

// 确认
const confirm = () => {
  if (props.multiple) {
    emit("closeDialog", multiselects.value);
  } else {
    emit("closeDialog", [moduleData.currentRow]);
  }
};

// 关闭弹窗
const onCancel = () => {
  emit("closeDialog");
};
</script>

<style lang="scss">
.InquireList {
  display: flex;
  align-items: center;
  .el-input {
    width: 100px;
    margin: 0 10px;
  }
  .el-select {
    width: 120px;
    margin-left: 10px;
  }
}

.spareTable {
  margin-top: 12px;
}
.userPagination {
  margin-top: 12px;
  text-align: right;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>