<template>
  <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="props.showDialog" title="文件上传" width="40%" center>
    <el-upload :action="moduleData.actionUrl" :before-upload="beforeUpload" :before-remove="beforeRemove"
      :on-remove="handleRemove" :on-success="uploadSuccess" :on-error="uploadError" :file-list="fileList"
      list-type="picture">
      <el-button size="small" type="primary">上传</el-button>
      <template #tip>
        <div class="el-upload__tip">
          文件大小不能超过5M
        </div>
      </template>
    </el-upload>
    <template #footer>
      <span class="dialog-footer">
        <el-button size="small" type="primary" @click="handlerConfirm">确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import type { UploadFile, ElUploadProgressEvent } from 'element-plus/es/components/upload/src/upload.type'

interface FileEntity {
  name: string,
  url: string
}

const props = defineProps({
  showDialog: { type: Boolean, default: false }
});

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);

const moduleData = reactive<any>({
  successFiles: [],
  actionUrl: import.meta.env.VITE_BASE_URL + "fm/upload"
});

const fileList = ref<FileEntity[]>([]);

// 上传文件之前校验文件大小
const beforeUpload = (file: UploadFile) => {
  if (file.size > moduleData.fileSize) {
    ElMessage.info("文件大小不能超过5M,请重新上传");
    return false;
  }
  return true;
}

// 删除之前进行询问
const beforeRemove = (file: UploadFile, fileList: UploadFile[]) => {
  return ElMessageBox.confirm(`确认删除 ${file.name} ?`);
}

// 删除文件
const handleRemove = (file: UploadFile, fileList: UploadFile[]) => {
  if (moduleData.successFiles.length === 1) {
    moduleData.successFiles = [];
  } else {
    moduleData.successFiles = moduleData.successFiles.filter((item: any) => !(item.id === (file.response as any).id));
  }
}

// 上传成功
const uploadSuccess = (response: ElUploadProgressEvent, file: UploadFile, fileList: FileList) => {
  ElMessage.success("上传成功");
  moduleData.successFiles.push(response);
}

// 上传失败
const uploadError = (error: Error, file: UploadFile, fileList: FileList) => {
  ElMessage.error("上传失败:" + error.message);
}

// 点击确认
const handlerConfirm = () => {
  onCancel();
}

// 关闭弹窗
const onCancel = () => {
  emit("closeDialog", moduleData.successFiles);
};
</script>