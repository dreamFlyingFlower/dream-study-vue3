<template>
  <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="moduleData.dialogVisible" title="供应商信息"
    width="60%" center>
    <el-form ref="ruleFormRef" :inline="true" :rules="editRules" :model="formData" label-width="140px">
      <el-form-item label="单位名称:" prop="supplierName" size="small">
        <el-input v-model="formData.supplierName" placeholder="单位名称"></el-input>
      </el-form-item>
      <el-form-item label="联系人:" size="small">
        <el-input v-model="formData.contact" placeholder="联系人"></el-input>
      </el-form-item>
      <el-form-item label="联系电话:" prop="contactNumber" size="small">
        <el-input type="tel" v-model="formData.contactNumber" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-form-item label="Email:" prop="email" size="small">
        <el-input type="email" v-model="formData.email" placeholder="Email"></el-input>
      </el-form-item>
      <el-form-item label="通讯地址:" size="small">
        <el-input v-model="formData.address" placeholder="通讯地址"></el-input>
      </el-form-item>
      <el-form-item label="备注:" style="width: 80%" size="small">
        <el-input v-model="formData.remark" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handlerFormData(ruleFormRef, formData, editType, api, onCancel)">确定
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
import { SupplierEntity } from "../../../types/supplier";
import api from "../../../api/supplier";
import { checkHasValue, checkFormEmail, checkFormPhone, handlerFormData } from '../../../utils/simpleUtil';

// 声明从组件传递的属性
const props = defineProps({
  showDialog: { type: Boolean, default: false, },
  editType: { type: Number, default: 0 },
  editData: { type: Object, default: null, }
});

// 模块数据
const moduleData = reactive<any>({
  dialogVisible: props.showDialog
});

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);
// const emit = defineEmits<{
//   (e: 'closeDialog'): Boolean
// }>();

// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
// 声明supplierName校验规则
const hasSupplierName = (rule: any, value: any, callback: any) => {
  checkHasValue(formData, "supplierName", props.editType, props.editData, api, rule, value, callback);
};
// 声明supplierName校验规则
const checkPhone = (rule: any, value: any, callback: any) => {
  checkFormPhone(rule, value, callback);
};
// 声明supplierName校验规则
const checkEmail = (rule: any, value: any, callback: any) => {
  checkFormEmail(rule, value, callback);
};

// 声明表单校验规则
const editRules = reactive({
  supplierName: [{ required: true, tip: "单位名称重复,请重新输入", trigger: "blur", validator: hasSupplierName },],
  contactNumber: [{ tip: "联系号码格式错误,请重新输入", trigger: "blur", validator: checkPhone },],
  email: [{ tip: "邮箱格式错误,请重新输入", trigger: "blur", validator: checkEmail },]
});

// 声明表单数据
const formData = reactive<SupplierEntity>({
  rowId: null,
  supplierName: null,
  contact: null,
  contactNumber: null,
  email: null,
  address: null,
  remark: null
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
