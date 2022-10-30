<template>
  <div class="oprate_btn">
    <el-button size="small" type="primary" @click="showUploadFile">
      <el-icon style="vertical-align: middle;">
        <upload />
      </el-icon>
      <span style="vertical-align: middle;">上传</span>
    </el-button>
    <el-button size="small" type="primary" @click="deleteData">
      <el-icon style="vertical-align: middle;">
        <delete />
      </el-icon>
      <span style="vertical-align: middle;">删除</span>
    </el-button>
  </div>
  <el-table :data="moduleData.tableDatas" ref="mainList" @selection-change="handlerSelectionChange" style="width: 100%;"
    size="mini" :header-cell-style="{ padding : 0}" :cell-style="{ padding : 0}" height="130" highlight-current-row
    border fit>
    <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
    <el-table-column type="selection" width="45" align="center"></el-table-column>
    <el-table-column label="操作" min-width="100" align="center">
      <template v-slot:default="scope">
        <el-button type="text" size="small" @click="downloadFile(scope.row)">下载</el-button>
      </template>
    </el-table-column>
    <el-table-column show-overflow-tooltip min-width="250" align="center" label="文件名" prop="fileName" />
    <el-table-column show-overflow-tooltip min-width="150" align="center" label="文档类型" prop="documentType" />
    <el-table-column show-overflow-tooltip min-width="100" align="center" label="上传时间" prop="createTime" />
    <el-table-column show-overflow-tooltip min-width="100" align="center" label="上传者" prop="creator" />
    <el-table-column show-overflow-tooltip min-width="100" align="center" label="文件类型" prop="fileType" />
    <el-table-column show-overflow-tooltip min-width="100" align="center" label="文件大小" prop="fileSize" />
  </el-table>

  <UploadFile v-if="moduleData.showDialog" :show-dialog="moduleData.showDialog" @closeDialog="closeDialog" />
</template>

<script lang="ts" setup>
import { reactive, onMounted, watch, toRefs, ref } from 'vue';
import api from '../../../api/file';
import apiDevice from '../../../api/device';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { ElUpload } from 'element-plus'
import UploadFile from '../../../components/UploadFile.vue';

const prop = defineProps({
  selectDevice: { type: Object, default: null },
  selectDevices: { type: Array, default: [] },
});

const props = toRefs(prop);

// 声明从父组件传递的方法
const emit = defineEmits(['resetDeviceList']);

const moduleData = reactive<any>({
  // 当前选中的设备备件列表
  tableDatas: [],
  showDialog: false
});

watch(props.selectDevice, () => {
  getList();
}, { deep: true });

const showUploadFile = () => {
  if (!props.selectDevices || props.selectDevices.value.length === 0) {
    ElMessage.warning({ showClose: true, message: '请先选择设备' });
    return;
  }
  moduleData.showDialog = true;
}

onMounted(() => {
  getList();
})

const getList = () => {
  if (props.selectDevice && props.selectDevice.value && props.selectDevice.value.attachId) {
    api.apis.getByIds(props.selectDevice.value.attachId.split(",")).then((res: any) => {
      moduleData.tableDatas = res.data;
    });
  } else {
    moduleData.tableDatas = [];
  }
}

// 下载文件
const downloadFile = (row: any) => {
  api.apis.download(row.id);
}

// 点选表格前的勾选框操作
const multiselects = ref<any[]>([]);
const handlerSelectionChange = (val: any[]) => {
  multiselects.value = val;
}

// 删除列表,调后台接口删除
const deleteData = () => {
  if (!props.selectDevice || !props.selectDevice.value) {
    ElMessage("请先选择设备");
    return;
  }
  if (multiselects.value.length === 0) {
    ElMessage("请选择一条记录");
    return;
  }
  if (moduleData.tableDatas && moduleData.tableDatas.length > 0) {
    ElMessageBox.confirm('此操作将永久删除该文件,是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const params: any = {
        rowId: props.selectDevice.value.rowId,
        fileIds: []
      };
      multiselects.value.forEach((item: any) => params.fileIds.push(item.id));
      apiDevice.apis.deleteDeviceFiles(params).then(() => {
        emit('resetDeviceList');
      });
    }).catch(() => {
      ElMessage.info('已取消删除');
    })
  }
}

// 关闭弹窗,将文件ID传给后台保存
const closeDialog = (newAddDatas: Array<Object>) => {
  moduleData.showDialog = false;
  if (!newAddDatas || newAddDatas.length === 0) {
    return;
  }
  if (props.selectDevices && props.selectDevices.value.length > 0) {
    const params: Array<Object> = [];
    const fileIds: Array<String> = [];
    newAddDatas.map((item: any) => fileIds.push(item.id + ""));
    props.selectDevices.value.forEach((item: any) => {
      params.push({
        rowId: item.rowId,
        attachId: fileIds.join(",")
      })
    });
    apiDevice.apis.addDeviceFile(params).then(() => {
      emit('resetDeviceList');
    })
  }
}
</script>

<style scoped>
.oprate_btn {
  text-align: left;
  padding: 10px 0 10px 10px;
}
</style>>