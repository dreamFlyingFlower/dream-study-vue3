<template>
  <div>
    <el-table :data="moduleData.tableDatas" ref="mainList" @selection-change="handlerSelectionChange" size="mini"
      style="width: 100%;font-size:10px;" :header-cell-style="{ padding : 0}" :cell-style="{ padding : 0}" height="130"
      highlight-current-row border fit>
      <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column show-overflow-tooltip min-width="150" align="center" label="备件编码" prop="sparePartCode" />
      <el-table-column show-overflow-tooltip min-width="150" align="center" label="备件名称" prop="sparePartName" />
      <el-table-column show-overflow-tooltip min-width="150" align="center" label="规格型号" prop="specificationModel" />
      <el-table-column show-overflow-tooltip min-width="120" align="center" label="备件类型" prop="sparePartTypeId_CN" />
      <el-table-column show-overflow-tooltip min-width="120" align="center" label="生产厂商" prop="manufacturerId_CN" />
      <el-table-column show-overflow-tooltip min-width="120" align="center" label="库存上限" prop="inventoryTop" />
      <el-table-column show-overflow-tooltip min-width="120" align="center" label="总库存" prop="inventoryTotal" />
    </el-table>

    <!-- <DialogSpare v-if="moduleData.spareDialog" :show-dialog="moduleData.spareDialog"
      :select-devices="props.selectDevices.value" @closeDialog="closeDialog" /> -->
  </div>
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch, toRefs, ref } from 'vue';
import api from '../../../api/device';
import apiSpareType from '../../../api/spareType';
import { ElMessage, ElMessageBox } from 'element-plus';
import { transValue } from '../../../utils/simpleUtil';
// import DialogSpare from './dialogSpare.vue';

const prop = defineProps({
  selectDevice: { type: Object, default: null },
  selectDevices: { type: Array, default: [] },
  suppliers: { type: Array, default: [] }
});

const props = toRefs(prop);

const moduleData = reactive<any>({
  // 当前选中的设备备件列表
  tableDatas: [],
  // 添加的备件列表
  spareDatas: [],
  // 备件类型列表
  spareTypes: [],
  spareDialog: false,
  pageNum: 1,
  tabelTotal: 0,
});

watch(props.selectDevice, () => {
  getList();
}, { deep: true });

onMounted(async () => {
  await getSpareTypes();
  getList();
})

// 获得备件类型
const getSpareTypes = () => {
  apiSpareType.apis.getList({}).then((res: any) => {
    moduleData.spareTypes = res.data;
  });
}

const getList = () => {
  if (props.selectDevice && props.selectDevice.value) {
    api.apis.listDeviceSpare({ "deviceCode": props.selectDevice.value.deviceCode }).then((res: any) => {
      moduleData.tableDatas = res.data;
      transValue(res.data, ['sparePartTypeId', 'manufacturerId']
        , [moduleData.spareTypes, props.suppliers.value], ["id", "rowId"], ["typeName", "supplierName"]);
    });
  } else {
    moduleData.tableDatas = [];
  }
}

// 切换页码
const switchPageNum = (val: any) => {
  moduleData.pageNum = val;
  getList();
}

// 保存备件清单
const saveData = () => {
  // 单选操作
  deleteData();
  // 复选框操作
  addData();
  ElMessage({
    showClose: true,
    message: '保存成功',
    type: 'success',
    duration: 2000
  });
}

// 新增数据
const addData = () => {
  if (props.selectDevices && props.selectDevices.value.length > 0) {
    if (!moduleData.spareDatas || moduleData.spareDatas.length === 0) {
      return;
    } else {
      const params: Array<Object> = [];
      props.selectDevices.value.forEach((item: any) => {
        moduleData.spareDatas.forEach((element: any) => {
          params.push({
            deviceId: item.rowId,
            sparePartId: element.id
          })
        });
      });
      _addData(params);
    }
  }
}

// 保存数据
const _addData = (params: Array<Object>) => {
  api.apis.addDeviceSpares(params).then(() => {
    moduleData.spareDatas = [];
    getList();
    ElMessage({
      showClose: true,
      message: '保存成功',
      type: 'success',
      duration: 2000
    });
  })
}

// 点选表格前的勾选框操作
const multiselects = ref<any[]>([]);
const handlerSelectionChange = (val: any[]) => {
  multiselects.value = val;
}

// 删除列表数据
const deleteData = () => {
  if (!props.selectDevice || !props.selectDevice.value) {
    ElMessage("请先选择设备");
    return;
  }
  if (multiselects.value.length === 0) {
    return;
  }

  if (moduleData.tableDatas && moduleData.tableDatas.length > 0) {
    ElMessageBox.confirm('此操作将永久删除该关联备件,是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      let params: any = [];
      multiselects.value.forEach((item: any) => {
        params.push(item.id);
      });
      api.apis.deleteDeviceSpares(params).then(() => {
        getList();
      });
    }).catch(() => {
      ElMessage.info('已取消删除');
    })
  }
}

// 显示备件清单弹窗
const showDialog = () => {
  if (props.selectDevices && props.selectDevices.value.length > 0) {
    moduleData.spareDialog = true;
  } else {
    ElMessage.warning({ showClose: true, message: '请先选择设备' });
  }
}

// 关闭弹窗,保存数据
const closeDialog = (spareDatas: any) => {
  moduleData.spareDialog = false;
  if (!spareDatas || spareDatas.length === 0) {
    return;
  }
  if (moduleData.spareDatas && moduleData.spareDatas.length === 0) {
    moduleData.spareDatas = spareDatas;
  } else {
    // 去重
    spareDatas.forEach((element: any) => {
      let flag = true;
      for (const item of moduleData.spareDatas) {
        if (element.id === item.id) {
          flag = false;
          break;
        }
      }
      if (flag) {
        moduleData.spareDatas.push(element);
      }
    });
  }
  addData();
}
</script>

<style scoped>
.oprate_btn {
  text-align: left;
  padding: 10px 0 10px 10px;
}
</style>>