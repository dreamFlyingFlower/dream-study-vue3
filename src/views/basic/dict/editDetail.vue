<template>
  <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="moduleData.dialogVisible" title="字典详情信息"
    width="60%" center>
    <el-form ref="ruleFormRef" :inline="true" :rules="editRules" :model="formData" label-width="140px"
      label-position="left">
      <el-form-item label="分类编码:" size="small">
        <el-input v-model="formData.dictCode" placeholder="分类编码" disabled></el-input>
      </el-form-item>
      <el-form-item label="分类名称:" size="small">
        <el-input v-model="formData.dictName" placeholder="分类名称" disabled></el-input>
      </el-form-item>
      <el-form-item label="分类类型:" size="small">
        <el-input v-model="formData.dictType" placeholder="分类类型" disabled></el-input>
      </el-form-item>
      <el-form-item label="字典编码:" prop="dictItemKey" size="small">
        <el-input v-model="formData.dictItemKey" placeholder="字典编码"></el-input>
      </el-form-item>
      <el-form-item label="字典名称:" prop="dictItemValue" size="small">
        <el-input v-model="formData.dictItemValue" placeholder="字典名称"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handlerFormData(ruleFormRef, formData, props.editType, api, onCancel)">确定
        </el-button>
        <el-button @click="onCancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { ElForm } from "element-plus";
import { reactive, ref, onMounted } from "vue";
import api from "../../../api/dictItem";
import { handlerFormData } from '../../../utils/simpleUtil';

// 声明从组件传递的属性
const props = defineProps({
  showDialog: { type: Boolean, default: false, },
  editType: { type: Number, default: 0 },
  editData: { type: Object, default: null, },
  parentData: { type: Object, default: null }
});

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);

// 模块数据
const moduleData = reactive<any>({
  nodeValue: null,
  dialogVisible: props.showDialog
});

// 声明表单数据
const formData = reactive<any>({
  rowId: null,
  dictCode: null,
  dictName: null,
  dictType: null,
  dictItemKey: null,
  dictItemValue: null
});

// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>();

// 声明表单校验规则
const editRules = reactive({
  dictCode: [{ required: true, trigger: "blur", message: "分类编码不能为空" }],
  dictItemKey: [{ required: true, trigger: "blur", message: "字典类型不能为空!" }],
  dictItemValue: [{ required: true, trigger: "blur", message: "字典名称不能为空!" }]
});

// 初始化方法
onMounted(() => {
  init();
});

// 初始化
const init = () => {
  formData.dictCode = props.parentData.dictCode;
  formData.dictName = props.parentData.dictName;
  formData.dictType = props.parentData.dictType === '1' ? "系统字典" : "业务字典"
  // 修改
  if (props.editType === 2) {
    for (const key in props.editData) {
      if (Object.prototype.hasOwnProperty.call(props.editData, key)) {
        formData[key] = props.editData[key];
      }
    }
  }
}

// 关闭弹窗
const onCancel = () => {
  emit("closeDialog");
};
</script>

<style lang="scss" scoped></style>
