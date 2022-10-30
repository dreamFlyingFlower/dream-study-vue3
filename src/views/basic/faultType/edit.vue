<template>
  <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="moduleData.dialogVisible" title="故障类型信息"
    width="60%" center>
    <el-form ref="ruleFormRef" :inline="true" :rules="editRules" :model="formData" label-width="140px">
      <el-form-item label="上级编码:" prop="superiorCode" size="small">
        <TreeSelect v-model="formData.superiorName" :tree-datas="props.treeData" :placeholder="'上级编码'" size="large"
          :value="moduleData.nodeValue" :clearable="false" @getValue="getValue" @selected="selected" />
      </el-form-item>
      <el-form-item label="类型编码:" prop="typeCode" size="small">
        <el-input v-model="formData.typeCode" placeholder="类型编码" :disabled="props.editType === 2"></el-input>
      </el-form-item>
      <el-form-item label="类型名称:" prop="typeName" size="small">
        <el-input v-model="formData.typeName" placeholder="类型名称"></el-input>
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
import { reactive, ref, onMounted } from "vue";
import api from "../../../api/faultType";
import { FaultTypeEntity } from "../../../types/faultType";
import { checkHasValue, handlerFormData } from '../../../utils/simpleUtil';
import TreeSelect from '../../../components/TreeSelect.vue';

// 声明从组件传递的属性
const props = defineProps({
  showDialog: { type: Boolean, default: false, },
  editType: { type: Number, default: 0 },
  editData: { type: Object, default: null, },
  treeData: { type: Object, default: {} },
  treeSelected: { type: Object, default: null },
});

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);
// const emit = defineEmits<{
//   (e: 'closeDialog'): Boolean
// }>();
const moduleData = reactive<any>({
  // 左边树形节点选中的值,非node
  nodeValue: null,
  dialogVisible: props.showDialog
});

// 声明表单数据
const formData = reactive<FaultTypeEntity>({
  rowId: null,
  typeCode: null,
  typeName: null,
  superiorCode: null,
  superiorName: null,
  remark: null,
});


// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
// 定义superiorCode的校验规则
const checkSuperiorCode = (rule: any, value: any, callback: any) => {
  if (!value || value.trim() === "") {
    callback(new Error('上级故障类型不能为空,请选择!'));
  } else {
    if (formData.typeCode === formData.superiorCode) {
      callback(new Error("上级故障类型不能是自己,请重新选择!"));
    } else {
      callback();
    }
  }
}
// 声明typeCode校验规则
const hasTypeCode = (rule: any, value: any, callback: any) => {
  checkHasValue(formData, 'typeCode', props.editType, props.editData, api, rule, value, callback);
};
// 声明typeName校验规则
const hasTypeName = (rule: any, value: any, callback: any) => {
  checkHasValue(formData, 'typeName', props.editType, props.editData, api, rule, value, callback);
};
// 声明表单校验规则
const editRules = reactive({
  superiorCode: [{ required: true, trigger: "change", validator: checkSuperiorCode }],
  typeCode: [{ required: true, trigger: "blur", tip: "故障编码重复,请重新输入!", validator: hasTypeCode }],
  typeName: [{ required: true, trigger: "blur", tip: "故障名称重复,请重新输入!", validator: hasTypeName }]
});

// edit组件树形结构点击回调方法,参数为整个节点数据
const getValue = (node: any) => {
  formData.superiorName = node.label;
}

// edit组件树形结构点击回调方法,参数为节点的typeCode
const selected = (node: string) => {
  formData.superiorCode = node;
}

// 初始化方法
onMounted(() => {
  init();
});

// 初始化
const init = () => {
  // 填充树形选中的节点数据
  if (props.treeSelected) {
    formData.superiorName = props.treeSelected.label;
  }
  moduleData.nodeValue = props.treeSelected ? props.treeSelected.typeCode : '0';
  // 新增
  if (props.editType === 1) {
    formData.superiorCode = props.treeSelected ? props.treeSelected.typeCode : null;
  }
  // 修改
  if (props.editType === 2) {
    for (const key in props.editData) {
      if (Object.prototype.hasOwnProperty.call(props.editData, key)) {
        formData[key] = props.editData[key];
      }
    }
    moduleData.nodeValue = props.editData['superiorCode'];
  }
}

// 关闭弹窗
const onCancel = () => {
  emit("closeDialog");
};
</script>

<style lang="scss" scoped></style>
