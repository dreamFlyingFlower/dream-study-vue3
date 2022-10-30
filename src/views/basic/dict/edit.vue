<template>
  <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="moduleData.dialogVisible" title="字典信息" width="60%"
    center>
    <el-form ref="ruleFormRef" :inline="true" :rules="editRules" :model="formData" label-width="140px"
      label-position="left">
      <el-form-item label="分类编码:" prop="dictCode" size="small">
        <el-input v-model="formData.dictCode" placeholder="分类编码" :disabled="props.editType === 2"></el-input>
      </el-form-item>
      <el-form-item label="分类名称:" prop="dictName" size="small">
        <el-input v-model="formData.dictName" placeholder="分类名称"></el-input>
      </el-form-item>
      <el-form-item label="分类类型:" prop="dictType" size="small">
        <el-select v-model="formData.dictType" placeholder="分类类型">
          <el-option v-for="item in moduleData.dictTypes" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handlerFormData(ruleFormRef, formData, props.editType, api, onCancel)">确定
        </el-button>
        <!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
        <el-button @click="onCancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import type { ElForm } from "element-plus";
import { reactive, ref, onMounted } from "vue";
import api from "../../../api/dict";
import { checkHasValue, handlerFormData } from '../../../utils/simpleUtil';

// 声明从组件传递的属性
const props = defineProps({
  showDialog: { type: Boolean, default: false, },
  editType: { type: Number, default: 0 },
  editData: { type: Object, default: null, },
});

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);

// 模块数据
const moduleData = reactive<any>({
  nodeValue: null,
  dialogVisible: props.showDialog,
  dictTypes: [
    { label: "系统字典", value: 1 },
    { label: "业务字典", value: 2 }
  ]
});

// 声明表单数据
const formData = reactive<any>({
  rowId: null,
  dictCode: null,
  dictName: null,
  dictType: null
});

// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
// dictCode的校验规则
const hasDictCode = (rule: any, value: any, callback: any) => {
  checkHasValue(formData, 'dictCode', props.editType, props.editData, api, rule, value, callback);
}
// 声明表单校验规则
const editRules = reactive({
  dictCode: [{ required: true, trigger: "blur", tip: "分类编码重复,请重新输入", validator: hasDictCode }],
  dictName: [{ required: true, trigger: "blur", message: "分类名称不能为空,请重新输入!" }],
  dictType: [{ required: true, trigger: "change", message: "分类类型不能为空,请重新选择" }]
});

// 初始化方法
onMounted(() => {
  init();
});

// 初始化
const init = () => {
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
