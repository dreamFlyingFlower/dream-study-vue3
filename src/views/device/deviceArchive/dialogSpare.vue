<template>
  <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="moduleData.dialogVisible" title="备件选择" width="60%"
    center>
    <!-- 设备信息 -->
    <el-table :data="props.selectDevices" style="width: 100%;" size="mini" highlight-current-row border fit>
      <el-table-column show-overflow-tooltip align="center" width="50" type="index" label="序号" />
      <el-table-column show-overflow-tooltip min-width="150" align="center" label="设备编码" prop="deviceCode" />
      <el-table-column show-overflow-tooltip min-width="150" align="center" label="设备名称" prop="deviceName" />
      <el-table-column show-overflow-tooltip min-width="150" align="center" label="规格型号" prop="modelNumber" />
    </el-table>
    <el-card class="spareForm">
      <!-- 备件选择 -->
      <el-form :inline="true" :model="moduleData.searchParams">
        <el-form-item>
          <el-input v-model="moduleData.searchParams.sparePartName" size="small" placeholder="备件名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select v-model="moduleData.searchParams.sparePartTypeId" size="small" placeholder="备件类型" clearable>
            <el-option v-for="item in moduleData.spareTypes" :key="item.id" :label="item.typeName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table class="spareTable" style="width: 100%;font-size:10px;" :data="moduleData.tableDatas" empty-text="暂无数据"
        @selection-change="handlerSelectionChange" :header-cell-style="{padding:0}" :cell-style="{padding:0}"
        height="130" border fit highlight-current-row>
        <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="sparePartCode"
          label="备件编码" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="sparePartName"
          label="备件名称" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="specificationModel"
          label="规格型号" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="sparePartTypeName"
          label="备件类型" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="manufacturerName"
          label="生产厂商" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="inventoryTop"
          label="库存上限" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="providerName" label="供应商" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="measuringUnitId"
          label="计量单位" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="referencePrice"
          label="参考价" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="inventoryFloor"
          label="库存下限" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="inventoryTotal"
          label="总库存" />
      </el-table>
      <el-pagination class="userPagination" small="small" layout="prev, pager, next" :total="moduleData.tabelTotal"
        @current-change="switchPageNum">
      </el-pagination>
    </el-card>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handlerConfirm">确定 </el-button>
        <el-button @click="onCancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import api from "../../../api/spareList";
import apiSpareType from '../../../api/spareType';

const props = defineProps({
  showDialog: { type: Boolean, default: false },
  selectDevices: { type: Array, default: [] }
});

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);

const moduleData = reactive<any>({
  // 搜索关键字
  searchParams: {
    sparePartName: null,
    sparePartTypeId: null,
  },
  // 表格数据
  tableDatas: [],
  // 表格选中数据列表
  spares: [],
  // 备件类型下拉列表数据
  spareTypes: [],
  pageNum: 1,
  tabelTotal: 0,
  dialogVisible: props.showDialog
});

// 切换页码
const switchPageNum = (val: any) => {
  moduleData.pageNum = val;
  getList();
};

// 初始化操作 -------- start
onMounted(async () => {
  getList();
  getSpareTypes();
});

// 获得设备分类
// const getDictCategory = () => {
//   apiDict.apis.getItemsByCode({ "dictCode": "dt_device_category" }).then((res: any) => {
//     moduleData.deviceCategorys = res.data;
//   });
// }

// 查询备件列表
const getList = () => {
  api.article.getList({
    sparePartName: moduleData.searchParams.sparePartName,
    sparePartTypeId: moduleData.searchParams.sparePartTypeId,
    currentPage: moduleData.pageNum,
    pageSize: 10,
  }).then((res: any) => {
    moduleData.tableDatas = res.data.list;
    moduleData.tabelTotal = res.data.pages.count;
  });
};

// 查询备件类型
const getSpareTypes = () => {
  apiSpareType.apis.getList({}).then((res: any) => {
    moduleData.spareTypes = res.data;
  });
}

// 点选表格前的勾选框操作
const multipleSelection = ref<any[]>([]);
const handlerSelectionChange = (val: any[]) => {
  multipleSelection.value = val;
}

// 批量删除数据
const handlerConfirm = () => {
  if (multipleSelection.value.length === 0) {
    emit("closeDialog");
    return;
  }
  multipleSelection.value.forEach(item => moduleData.spares.push(item));
  onCancel();
}

// 关闭弹窗
const onCancel = () => {
  emit("closeDialog", moduleData.spares);
};
</script>

<style lang="scss" scoped>
.spareForm {
  margin-top: 5px;
  width: 100%;

  .el-form-item {
    margin-bottom: 2px;
  }
}
.userPagination {
  margin-top: 10px;
  text-align: right;
}
</style>