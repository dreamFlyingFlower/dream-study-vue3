<template>
  <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="moduleData.dialogVisible" title="备件类型信息"
    width="60%" center>
    <el-form ref="ruleFormRef" :inline="true" :rules="editRules" :model="formData" label-width="140px">
      <el-form-item label="上级类型:" prop="parentId" size="small">
        <TreeSelect v-model="formData.parentName" :tree-datas="props.treeData" :default-props="defaultProps"
          :placeholder="'上级类型'" :value="moduleData.nodeValue" :clearable="false" @getValue="getValue"
          @selected="selected" @initLabel="initLabel" />
      </el-form-item>
      <el-form-item label="备件类型名称:" prop="typeName" size="small">
        <el-input v-model="formData.typeName" placeholder="请输入备件类型名称"></el-input>
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
import api from "../../../api/spareType";
import { checkHasValueId, handlerFormData } from '../../../utils/simpleUtil';
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

// 模块数据
const moduleData = reactive<any>({
  nodeValue: null,
  dialogVisible: props.showDialog
});

// 声明表单数据
const formData = reactive<any>({
  id: null,
  parentId: null,
  parentName: null,
  typeName: null,
  remark: null
});

// 声明设备类型树形选择框的显示属性,传递给treeSelect组件
const defaultProps = {
  value: 'id',
  label: 'label',
  children: 'children'
};

// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
// 声明parentId校验规则
const checkParentId = (rule: any, value: any, callback: any) => {
  if (!value && value !== 0) {
    callback(new Error('上级类型不能为空,请重新输入'));
  } else {
    if (formData.id === formData.parentId) {
      callback(new Error("上级备件类型不能是自己,请重新选择!"));
    } else {
      callback();
    }
  }
}
// 声明typeName校验规则
const hasTypeName = (rule: any, value: any, callback: any) => {
  checkHasValueId(formData, 'typeName', props.editType, props.editData, api, rule, value, callback);
}
// 声明表单校验规则
const editRules = reactive({
  parentId: [{ required: true, trigger: "change", validator: checkParentId }],
  typeName: [{ required: true, tip: "备件类型名称重复,请重新输入", trigger: "blur", validator: hasTypeName }]
});

// 初始化方法
onMounted(() => {
  init();
});

// 初始化
const init = () => {
  // 填充树形选中的节点数据
  if (props.treeSelected) {
    formData.parentName = props.treeSelected.label;
  }
  moduleData.nodeValue = props.treeSelected ? props.treeSelected.id : null;
  // 新增
  if (props.editType === 1) {
    formData.parentId = props.treeSelected ? props.treeSelected.id : null;
  }
  // 修改
  if (props.editType === 2) {
    for (const key in props.editData) {
      if (Object.prototype.hasOwnProperty.call(props.editData, key)) {
        formData[key] = props.editData[key];
      }
    }
    moduleData.nodeValue = props.editData['parentId'];
  }
}

// 关闭弹窗
const onCancel = () => {
  emit("closeDialog");
};

// edit组件树形结构点击回调方法,参数为整个节点数据
const getValue = (node: any) => {
  formData.parentName = node.label;
}

// edit组件树形结构点击回调方法,参数为节点的id
const selected = (node: number) => {
  formData.parentId = node;
}

// 初始化显示名称
const initLabel = (label: string) => {
  formData.parentName = label;
}
</script>

<style lang="scss" scoped></style>
