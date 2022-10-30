<template>
  <div class="dialog-edit">
    <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="moduleData.dialogVisible" title="设备类型信息"
      width="60%" center>
      <el-form ref="ruleFormRef" :inline="true" :rules="editRules" :model="formData" label-width="140px">
        <!-- style="overflow:auto;height:200px;" -->
        <el-form-item label="设备编码:" prop="deviceCode" size="small">
          <el-input v-model="formData.deviceCode" placeholder="请输入设备编码"></el-input>
        </el-form-item>
        <el-form-item label="设备名称:" prop="deviceName" size="small">
          <el-input v-model="formData.deviceName" placeholder="请输入设备名称"></el-input>
        </el-form-item>
        <el-form-item label="设备类型:" prop="typeName" size="small">
          <TreeSelect v-model="formData.typeName" :tree-datas="props.treeData" :props="defaultProps"
            :placeholder="'类型编码'" size="small" :value="props.editType === 2 ? props.editData.typeCode : null"
            @getValue="getValue" @selected="selected" />
        </el-form-item>
        <!-- <el-form-item label="设备分类:" size="small">
          <el-select v-model="formData.category" placeholder="请输入设备分类" clearable>
            <el-option v-for="item in props.deviceCategorys" :key="item.dictItemKey" :label="item.dictItemValue"
              :value="item.dictItemKey"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="设备型号:" size="small">
          <el-input v-model="formData.modelNumber" placeholder="请输入设备型号"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家:" size="small">
          <el-select v-model="formData.manufacturersName" placeholder="请选择生产厂家" filterable clearable>
            <el-option v-for="item in props.suppliers" :key="item.rowId" :label="item.supplierName"
              :value="item.supplierName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商:" size="small">
          <el-select v-model="formData.supplierName" placeholder="请选择供应商" filterable clearable>
            <el-option v-for="item in props.suppliers" :key="item.rowId" :label="item.supplierName"
              :value="item.supplierName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用寿命:" size="small">
          <el-input-number size="small" style="width:202px" v-model="formData.lifetime" placeholder="请输入使用寿命" :min="0"
            :max="100" />
        </el-form-item>
        <el-form-item label="购买时间:" size="small">
          <!-- 该宽度根据页面宽度而定,查看页面.el-date-editor --el-date-editor-width宽度修改为合适宽度 -->
          <el-date-picker style="width:202px" v-model="formData.buyDate" type="date" value-format="YYYY-MM-DD"
            placeholder="请输入购买时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="资产原值:" size="small">
          <el-input type="number" v-model="formData.originalValue" placeholder="请输入资产原值,保留2位小数"></el-input>
        </el-form-item>
        <el-form-item label="资产净值:" size="small">
          <el-input type="number" v-model="formData.assetNetWorth" placeholder="请输入资产净值,保留2位小数"></el-input>
        </el-form-item>
        <el-form-item label="资产编号:" size="small">
          <el-input v-model="formData.assetCode" placeholder="请输入资产编号"></el-input>
        </el-form-item>
        <el-form-item label="资产负责人:" size="small">
          <el-select v-model="formData.assetManager" placeholder="请输入资产负责人" filterable clearable>
            <el-option v-for="item in moduleData.employees" :key="item.employeeCode" :label="item.employeeName"
              :value="item.employeeCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用部门:" size="small">
          <el-select v-model="formData.useDept" placeholder="请输入使用部门" filterable clearable>
            <el-option v-for="item in moduleData.organizations" :key="item.organizationCode"
              :label="item.organizationName" :value="item.organizationCode"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设备地点:" size="small">
          <el-input v-model="formData.address" placeholder="请输入设备地点"></el-input>
        </el-form-item>
        <el-form-item label="使用状况:" v-if="props.editType && props.editType === 2" size="small">
          <el-select v-model="formData.state" placeholder="请选择使用状况" clearable>
            <el-option v-for="(item) in props.deviceStates" :key="item.dictItemKey" :label="item.dictItemValue"
              :value="item.dictItemKey"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="启用时间:" size="small">
          <el-date-picker style="width:202px" v-model="formData.startUseDate" type="date" value-format="YYYY-MM-DD"
            placeholder="请输入启用时间"></el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="维修班组:" size="small">
          <el-input v-model="formData.maintainGroup" placeholder="请输入维修班组"></el-input>
        </el-form-item> -->
        <el-form-item label="要求验收时间:" size="small">
          <el-date-picker style="width:202px" v-model="formData.requireCheckTime" type="date" value-format="YYYY-MM-DD"
            placeholder="请输入要求验收时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="备注:" style="width:80%" size="small">
          <el-input type="textarea" v-model="formData.remark" placeholder="请输入备注"></el-input>
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
  </div>
</template>

<script lang="ts" setup>
import type { ElForm } from "element-plus";
import { reactive, ref, onMounted, watch } from "vue";
import api from "../../../api/device";
import apiEmployee from '../../../api/employee';
import apiOrganization from '../../../api/organization';
import { DeviceEntity } from "../../../types/device";
import { checkHasValue, handlerFormData } from '../../../utils/simpleUtil';
import TreeSelect from '../../../components/TreeSelect.vue';

// 声明从组件传递的属性
const props = defineProps({
  showDialog: { type: Boolean, default: false, },
  editType: { type: Number, default: 0 },
  editData: { type: Object, default: null, },
  treeData: { type: Object, default: {} },
  treeSelected: { type: Object, default: null },
  deviceStates: { type: Array, default: [] },
  suppliers: { type: Array, default: [] }
});

const moduleData = reactive<any>({
  nodeValue: null,
  dialogVisible: props.showDialog,
  // 人员数据
  employees: [],
  // 组织机构列表
  organizations: []
});

// 声明表单数据
const formData = reactive<DeviceEntity>({
  rowId: null,
  deviceCode: null,
  deviceName: null,
  typeCode: null,
  typeCode_CN: null,
  typeName: null,
  modelNumber: null,
  manufacturersName: null,
  supplierName: null,
  lifetime: 0,
  buyDate: null,
  originalValue: null,
  assetNetWorth: null,
  assetCode: null,
  assetManager: null,
  assetManagerName: null,
  useDept: null,
  useDeptName: null,
  address: null,
  state: null,
  startUseDate: null,
  requireCheckTime: null,
  attachId: null,
  tenantCode: null,
  remark: null
});

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);

watch(
  [() => formData.assetManager, () => formData.useDept], () => {
    if (moduleData.employees && moduleData.employees.length > 0) {
      let tempData = moduleData.employees.filter((item: any) => item.employeeCode === formData.assetManager);
      formData.assetManagerName = (tempData && tempData.length > 0) ? tempData[0].employeeName : null;
    }
    if (moduleData.organizations && moduleData.organizations.length > 0) {
      let tempData = moduleData.organizations.filter((item: any) => item.organizationCode === formData.useDept);
      formData.useDeptName = (tempData && tempData.length > 0) ? tempData[0].organizationName : null;
    }
  }
);

// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
// 声明deviceName校验规则
const hasDeviceName = (rule: any, value: any, callback: any) => {
  checkHasValue(formData, 'deviceName', props.editType, props.editData, api, rule, value, callback);
};
// 声明deviceCode校验规则
const hasDeviceCode = (rule: any, value: any, callback: any) => {
  checkHasValue(formData, 'deviceCode', props.editType, props.editData, api, rule, value, callback);
};
// 声明typeName校验规则
const checkTypeName = (rule: any, value: any, callback: any) => {
  if (!value || value.trim() === "") {
    callback(new Error("设备类型编码不能为空,请选择"));
  } else {
    if (formData.typeName === '设备类型') {
      callback(new Error(rule.tip));
    } else {
      callback();
    }
  }
};
// 声明state校验规则
const checkState = (rule: any, value: any, callback: any) => {
  if (props.editType === 2) {
    if (!value || value.trim() === "") {
      callback(new Error(rule.message));
    } else {
      callback();
    }
  }
}
// 声明表单校验规则
const editRules = reactive({
  deviceName: [{ required: true, message: "设备名称重复,请重新输入", trigger: "blur", validator: hasDeviceName }],
  deviceCode: { required: true, message: "设备编码重复,请重新输入", trigger: "blur", validator: hasDeviceCode },
  typeName: { required: true, tip: "不能选择根节点设备类型", trigger: "change", validator: checkTypeName },
});

// 声明设备类型树形选择框的显示属性,传递给treeSelect组件
const defaultProps = {
  value: 'typeCode',
  label: 'label',
  children: 'children'
};

// edit组件树形结构点击回调方法,参数为整个节点数据
const getValue = (node: any) => {
  formData.typeName = node.label;
}

// edit组件树形结构点击回调方法,参数为节点的typeCode
const selected = (node: string) => {
  formData.typeCode = node;
}

// 初始化方法
onMounted(async () => {
  init();
  getEmployees();
  getOrganizations();
});

// 初始化
const init = () => {
  // 填充树形选中的节点数据
  if (props.treeSelected) {
    formData.typeName = props.treeSelected.label;
  }
  moduleData.nodeValue = props.treeSelected ? props.treeSelected.typeCode : '0';
  // 新增
  if (props.editType === 1) {
    formData.typeCode = props.treeSelected ? props.treeSelected.typeCode : null;
  }
  // 修改
  if (props.editType === 2) {
    for (const key in props.editData) {
      if (Object.prototype.hasOwnProperty.call(props.editData, key)) {
        formData[key] = props.editData[key];
      }
    }
  }
}

// 员工列表
const getEmployees = () => {
  apiEmployee.apis.getList({}).then((res: any) => {
    moduleData.employees = res.data;
  })
}

// 员工列表
const getOrganizations = () => {
  apiOrganization.apis.getList({}).then((res: any) => {
    moduleData.organizations = res.data;
  })
}

// 关闭弹窗
const onCancel = () => {
  emit("closeDialog");
};
</script>

<style lang="scss">
.dialog-edit .el-dialog--center {
  min-width: 450px;
}
</style>