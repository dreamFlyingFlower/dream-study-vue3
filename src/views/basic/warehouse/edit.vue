<template>
  <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="moduleData.dialogVisible" title="仓库信息" width="60%"
    center>
    <el-form ref="ruleFormRef" :inline="true" :rules="editRules" :model="formData" label-width="140px">
      <el-form-item label="仓库名称:" prop="warehouseName" size="small">
        <el-input v-model="formData.warehouseName" placeholder="请输入仓库名称"></el-input>
      </el-form-item>
      <el-form-item label="联系人:" size="small">
        <el-input v-model="formData.manager" placeholder="请输入联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话:" prop="telephone" size="small">
        <el-input v-model="formData.telephone" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="仓库地址:" size="small">
        <el-input v-model="formData.address" placeholder="请输入仓库地址"></el-input>
      </el-form-item>
      <el-form-item label="备注:" style="width:80%" size="small">
        <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注"></el-input>
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
import { reactive, ref, defineEmits, onMounted } from "vue";
import api from "../../../api/warehouse";
import { checkHasValue, checkFormPhone, handlerFormData } from '../../../utils/simpleUtil';

// 声明从组件传递的属性
const props = defineProps({
  showDialog: { type: Boolean, default: false, },
  editType: { type: Number, default: 0 },
  editData: { type: Object, default: null, }
});

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);

// 模块数据
const moduleData = reactive<any>({
  dialogVisible: props.showDialog
});

// 声明表单数据
const formData = reactive<any>({
  rowId: null,
  warehouseName: null,
  manager: null,
  telephone: null,
  address: null,
  remark: null
});

// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
// 声明supplierName校验规则
const hasWarehouseName = (rule: any, value: any, callback: any) => {
  checkHasValue(formData, 'warehouseName', props.editType, props.editData, api, rule, value, callback);
}
// 声明supplierName校验规则
const checkPhone = (rule: any, value: any, callback: any) => {
  checkFormPhone(rule, value, callback);
};
// 声明表单校验规则
const editRules = reactive({
  warehouseName: [{ required: true, tip: "仓库名称重复,请重新输入", trigger: "blur", validator: hasWarehouseName }],
  telephone: [{ tip: "联系号码格式错误,请重新输入", trigger: "blur", validator: checkPhone },]
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
