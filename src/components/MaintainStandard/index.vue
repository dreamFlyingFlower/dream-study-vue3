<template>
  <el-dialog :close-on-click-modal="false" @close="cancel" v-model="moduleData.dialogVisible" title="设备信息" width="60%"
    center>
    <el-card shadow="hover">
      <div class="InquireList">
        <el-select size="small" v-model="moduleData.typeCode" placeholder="设备类型" @change="getList" filterable clearable>
          <el-option v-for="item in moduleData.deviceTypes" :key="item.typeCode" :value="item.typeCode"
            :label="item.typeName"></el-option>
        </el-select>
        <el-input size="small" v-model="moduleData.maintenancePart" placeholder="标准部位" @keyup.enter="getList"
          clearable />
        <el-input size="small" v-model="moduleData.maintenanceStandard" placeholder="保养标准" @keyup.enter="getList"
          clearable />
        <el-button size="small" type="primary" @click="getList">查询</el-button>
      </div>
    </el-card>
    <el-table class="spareTable" :data="moduleData.tableDatas" empty-text="暂无数据"
      @selection-change="handlerSelectionChange" style="width: 100%;min-height:120px;font-size:10px"
      :header-cell-style="{ padding : 0}" :cell-style="{ padding : 0}" border fit highlight-current-row>
      <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="maintenancePart"
        label="保养部位" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="maintenanceStandard"
        label="保养标准">
      </el-table-column>
    </el-table>
    <el-pagination class="userPagination" small="small" layout="prev, pager, next" :total="moduleData.tabelTotal"
      @current-change="switchPageNum"></el-pagination>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirm">确定 </el-button>
        <el-button @click="cancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import type { DeviceEntity } from "../../types/device";
import api from "../../api/matainStand";
import apiDeviceType from "../../api/deviceType";

// 声明从组件传递的属性
const props = defineProps({
  showDialog: { type: Boolean, default: false, },
  // 额外添加的字段以及默认值,key为额外添加的字段,value为默认值
  extraColumns: { type: Object, default: null }
});

const moduleData = reactive<any>({
  dialogVisible: props.showDialog,
  tableDatas: [],
  // 设备类型列表
  deviceTypes: [],
  // 查询条件设备类型编码
  typeCode: null,
  // 查询条件设备类型名称
  typeName: null,
  // 查询条件保养标准明细部位名称
  maintenancePart: "",
  // 查询条件保养标准明细
  maintenanceStandard: null,
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

// 初始化操作 -------- start
onMounted(async () => {
  getDeviceType();
  getList();
});

// 切换页码
const switchPageNum = (val: any) => {
  moduleData.pageNum = val;
  getList();
};

// 获得设备类型列表
const getDeviceType = (): void => {
  apiDeviceType.apis.getList({}).then((res: any) => {
    moduleData.deviceTypes = res.data;
  });
}

// 查询设备列表
const getList = (): void => {
  api.apis.getListDetail({
    typeCode: moduleData.typeCode,
    maintenancePart: moduleData.maintenancePart,
    maintenanceStandard: moduleData.maintenanceStandard,
    currentPage: moduleData.pageNum,
    pageSize: 10,
  }).then((res: any) => {
    moduleData.tableDatas = res.data.list;
    moduleData.tabelTotal = res.data.pages.count;
  });
};
// 初始化操作 -------- end

const handlerSelectionChange = (val: DeviceEntity[]) => {
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
const cancel = () => {
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