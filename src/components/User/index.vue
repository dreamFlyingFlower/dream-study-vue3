<template>
  <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="moduleData.dialogVisible" title="设备信息" width="60%"
    center>
    <el-card shadow="hover">
      <div class="InquireList">
        <el-input size="small" v-model="moduleData.userName" placeholder="用户名" @keyup.enter="getList" clearable />
        <el-input size="small" v-model="moduleData.realName" placeholder="真实姓名" @keyup.enter="getList" clearable />
        <el-button size="small" type="primary" @click="getList">查询</el-button>
      </div>
    </el-card>
    <el-table class="spareTable" :data="moduleData.tableDatas" empty-text="暂无数据"
      @selection-change="handlerSelectionChange" style="width: 100%;min-height:120px;font-size:10px"
      :header-cell-style="{ padding : 0}" :cell-style="{ padding : 0}" border fit highlight-current-row>
      <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="userName" label="用户名" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="realName" label="真实姓名" />
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
import api from "../../api/user";
import apiSpareType from "../../api/spareType";
import apiWarehouse from "../../api/warehouse";

// 声明从组件传递的属性
const props = defineProps({
  showDialog: { type: Boolean, default: false },
  warehouseId: { type: Number, default: null },
  // 额外添加的字段以及默认值,key为额外添加的字段,value为默认值
  extraColumns: { type: Object, default: null }
});

const moduleData = reactive<any>({
  dialogVisible: props.showDialog,
  tableDatas: [],
  // 备件类型列表
  spareTypes: [],
  // 仓库列表
  warehouses: [],
  // 查询条件备件名称或备件编码
  quickSearchStr: "",
  // 查询条件备件类型ID
  sparePartTypeId: null,
  // 查询条件备件所属仓库
  warehouseId: props.warehouseId,
  pageNum: 1,
  tabelTotal: 0
});

// 点选表格前的勾选框操作
const multiselects = ref<any[]>([]);

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);

// 初始化操作 -------- start
onMounted(async () => {
  getWarehouse();
  getSpareType();
  getList();
});

// 切换页码
const switchPageNum = (val: any) => {
  moduleData.pageNum = val;
  getList();
};

// 获得设备类型列表
const getWarehouse = (): void => {
  apiWarehouse.apis.getList({}).then((res: any) => {
    moduleData.warehouses = res.data;
  });
}

// 获得设备类型列表
const getSpareType = (): void => {
  apiSpareType.apis.getList({}).then((res: any) => {
    moduleData.spareTypes = res.data;
  });
}

// 查询设备列表
const getList = (): void => {
  api.apis.selectlists({
    warehouseId: moduleData.warehouseId,
    quickSearchStr: moduleData.quickSearchStr,
    sparePartTypeId: moduleData.sparePartTypeId,
    currentPage: moduleData.pageNum,
    pageSize: 10,
  }).then((res: any) => {
    moduleData.tableDatas = res.data.list;
    moduleData.tabelTotal = res.data.pages.count;
  });
};

// 点击多选框操作
const handlerSelectionChange = (val: any[]) => {
  multiselects.value = val;
}

// 确认
const confirm = () => {
  if (multiselects.value && multiselects.value.length > 0) {
    // 如果需要添加额外字段
    if (props.extraColumns && Object.keys(props.extraColumns).length > 0) {
      multiselects.value.forEach((item: any) => {
        for (const key in props.extraColumns) {
          if (Object.prototype.hasOwnProperty.call(props.extraColumns, key)) {
            item[key] = props.extraColumns[key];
          }
        }
      });
    }
    emit("closeDialog", multiselects.value);
  } else {
    emit("closeDialog");
  }
}

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