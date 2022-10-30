<template>
  <div class="dialog-edit">
    <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="moduleData.dialogVisible" title="保养计划信息"
      width="60%" center>
      <div v-if="moduleData.step === 1">
        <el-form ref="ruleFormRef" :inline="true" :rules="editRules" :model="formData" label-width="140px">
          <el-col>
            <el-form-item label="保养级别:" prop="maintainLevel" size="small">
              <el-select v-model="formData.maintainLevel" placeholder="请选择保养级别">
                <el-option v-for="item in moduleData.upkeepLevels" :key="item.key" :label="item.label"
                  :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="display: flex; justify-content: space-between;">
            <el-form-item label="循环周期:" prop="loopCycle" size="small">
              <el-input v-model="formData.loopCycle" placeholder="循环周期" style="width: 112px;"></el-input>
            </el-form-item>
            <el-form-item label="" prop="cycleUnit" size="small">
              <el-select v-model="formData.cycleUnit" placeholder="循环单位" style="width: 70px;">
                <el-option v-for="item in moduleData.cycleUnits" :key="item.key" :label="item.label" :value="item.key">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-form-item label="计划保养时间:" prop="upkeepDate" size="small">
            <el-date-picker v-model="formData.upkeepDate" type="daterange" range-separator="To" start-placeholder="开始"
              end-placeholder="结束" format="YYYY-MM-DD" value-format="YYYY-MM-DD" style="width: 193px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="提醒时间:" size="small">
            <el-input type="number" v-model="formData.remindTime" placeholder="请输入提醒时间" style="width: 193px;">
              <template #append>天</template>
            </el-input>
          </el-form-item>
          <el-form-item label="保养负责人:" size="small">
            <el-select v-model="formData.applicant" placeholder="请选择保养负责人" filterable clearable>
              <el-option v-for="item in moduleData.employees" :key="item.employeeCode" :label="item.employeeName"
                :value="item.employeeCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="计划描述:" style="width:82%" size="small">
            <el-input type="textarea" v-model="formData.planDescribe" placeholder="请输入计划描述"></el-input>
          </el-form-item>
        </el-form>
        <el-col style="width: 100%;display: flex;justify-content: center;" v-if="moduleData.step === 1">
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="handlerNext(ruleFormRef)">下一步</el-button>
        </el-col>
      </div>

      <!-- 下一步 -->
      <div v-if="moduleData.step === 2">
        <!-- 选择设备 -->
        <el-col style="margin: 10px 0;">
          <el-button size="small" type="primary" @click="showDevice">选择设备</el-button>
        </el-col>
        <el-table class="spareTable" :data="moduleData.selectDevices" border fit highlight-current-row empty-text="暂无数据"
          style="width: 100%" height="120">
          <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
          <el-table-column label="操作" min-width="80" align="center">
            <template v-slot:default="scope">
              <el-button type="text" size="small" @click="removeDataDevice(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="deviceName"
            label="设备名称" />
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="deviceCode"
            label="设备编码" />
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="typeName" label="设备类型">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="modelNumber"
            label="设备型号" />
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="useDept" label="使用部门" />
        </el-table>

        <!-- 选择保养标准 -->
        <el-col style="margin: 10px 0;">
          <el-button size="small" type="primary" @click="showMaintainStandard">选择标准</el-button>
        </el-col>
        <el-table class="spareTable" :data="moduleData.selectMaintainStandards" border fit highlight-current-row
          empty-text="暂无数据" style="width: 100%" height="120">
          <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
          <el-table-column label="操作" min-width="80" align="center">
            <template v-slot:default="scope">
              <el-button type="text" size="small" @click="removeDataMaintainStandard(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="maintenancePart"
            label="保养部位" />
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="maintenanceStandard"
            label="保养标准">
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer" v-if="moduleData.step === 2">
          <el-button @click="handlerBack">上一步</el-button>
          <el-button type="primary" @click="handlerFormData">确定</el-button>
          <!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
        </span>
      </template>
    </el-dialog>

    <DeviceSelect v-if="moduleData.deviceDialog" :show-dialog="moduleData.deviceDialog"
      @closeDialog="closeDeviceDialog" />

    <MaintainStandard v-if="moduleData.maintainStandardDialog" :show-dialog="moduleData.maintainStandardDialog"
      @closeDialog="closeMaintainStandardDialog" />
  </div>
</template>

<script lang="ts" setup>
import type { ElForm } from "element-plus";
import { reactive, ref, onMounted, watch } from "vue";
import api from "../../../api/upkeepPlan";
import apiEmployee from '../../../api/employee';
import apiUser from '../../../api/user';
import DeviceSelect from '../../../components/Device/index.vue';
import MaintainStandard from '../../../components/MaintainStandard/index.vue';

// 声明从组件传递的属性
const props = defineProps({
  showDialog: { type: Boolean, default: false, },
  editType: { type: Number, default: 0 },
  editData: { type: Object, default: null, },
});

const moduleData = reactive<any>({
  nodeValue: null,
  // 当前弹出页显示与否
  dialogVisible: props.showDialog,
  // 设备选择弹出页显示与否
  deviceDialog: false,
  // 保养标准弹出页显示与否
  maintainStandardDialog: false,
  // 人员数据
  employees: [],
  // 下一步
  step: 1,
  // 选中的设备列表
  selectDevices: [],
  // 选中的保养标准列表
  selectMaintainStandards: [],
  // 保养级别
  upkeepLevels: [
    { key: "1", label: "常规保养" },
    { key: "2", label: "常规润滑" },
    { key: "3", label: "二级检修保养" },
    { key: "4", label: "三级检修保养" },
    { key: "5", label: "项目检修保养" },
    { key: "6", label: "年度检修保养" }
  ],
  // 循环周期单位
  cycleUnits: [
    { key: "1", label: "天" },
    { key: "2", label: "月" },
  ]
});

// 声明表单数据
const formData = reactive<any>({
  id: null,
  maintainLevel: null,
  loopCycle: null,
  cycleUnit: null,
  // 保养计划时间
  upkeepDate: null,
  upkeepPlanTimeStart: null,
  upkeepPlanTimeEnd: null,
  remindTime: null,
  applicant: null,
  planDescribe: null,
  deviceId: null,
  standardId: null,
  planStatue: null,
});

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);

// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>();

// 监控
watch(
  () => formData.upkeepDate, () => {
    if (formData.upkeepDate && formData.upkeepDate.length > 0) {
      formData.upkeepPlanTimeStart = formData.upkeepDate[0];
      formData.upkeepPlanTimeEnd = formData.upkeepDate[0];
    }
  }
);

// 声明表单校验规则
const editRules = reactive({
  maintainLevel: { required: true, message: "请选择保养级别", trigger: "change" },
  // loopCycle: [{ required: true, message: "请输入循环周期", trigger: "blur" }],
  // cycleUnit: [{ required: true, message: "请选择循环周期单位", trigger: "change" }],
  // upkeepDate: { required: true, message: "请选择保养时间", trigger: "blur" },
});

// 声明设备类型树形选择框的显示属性,传递给treeSelect组件
const defaultProps = {
  value: 'typeCode',
  label: 'label',
  children: 'children'
};

// 初始化方法
onMounted(async () => {
  init();
  getEmployees();
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

// 员工列表
const getEmployees = () => {
  apiEmployee.apis.getList({}).then((res: any) => {
    moduleData.employees = res.data;
  });
}

// 下一步
const handlerNext = (formEl: InstanceType<typeof ElForm> | undefined) => {
  if (!formEl) {
    return;
  }
  formEl.validate((valid) => {
    if (valid) {
      moduleData.step = 2;
    } else {
      return false;
    }
  })
}

// 上一步
const handlerBack = () => {
  moduleData.step = 1;
}

// 显示设备弹窗
const showDevice = () => {
  moduleData.deviceDialog = true;
}

// 关闭设备弹窗
const closeDeviceDialog = (val: any[]) => {
  moduleData.deviceDialog = false;
  if (!val || val.length === 0) {
    return;
  }
  if (moduleData.selectDevices && moduleData.selectDevices.length === 0) {
    moduleData.selectDevices = val;
  } else {
    // 去重
    val.forEach((element: any) => {
      let flag = true;
      for (const item of moduleData.selectDevices) {
        if (element.rowId === item.rowId) {
          flag = false;
          break;
        }
      }
      if (flag) {
        moduleData.selectDevices.push(element);
      }
    });
  }
}

// 删除选中的设备
const removeDataDevice = (row: any) => {
  if (!moduleData.selectDevices || moduleData.selectDevices.length === 0) {
    return;
  }
  let index = moduleData.selectDevices.findIndex((value: any) => row.rowId === value.rowId);
  if (index !== -1) {
    moduleData.selectDevices.splice(index, 1);
  }
}

// 显示保养标准
const showMaintainStandard = () => {
  moduleData.maintainStandardDialog = true;
}

// 关闭保养标准弹窗
const closeMaintainStandardDialog = (val: any[]) => {
  moduleData.maintainStandardDialog = false;
  if (!val || val.length === 0) {
    return;
  }
  if (moduleData.selectMaintainStandards && moduleData.selectMaintainStandards.length === 0) {
    moduleData.selectMaintainStandards = val;
  } else {
    // 去重
    val.forEach((element: any) => {
      let flag = true;
      for (const item of moduleData.selectMaintainStandards) {
        if (element.id === item.id) {
          flag = false;
          break;
        }
      }
      if (flag) {
        moduleData.selectMaintainStandards.push(element);
      }
    });
  }
}

// 删除选中的保养标准
const removeDataMaintainStandard = (row: any) => {
  if (!moduleData.selectMaintainStandards || moduleData.selectMaintainStandards.length === 0) {
    return;
  }
  let index = moduleData.selectMaintainStandards.findIndex((value: any) => row.rowId === value.rowId);
  if (index !== -1) {
    moduleData.selectMaintainStandards.splice(index, 1);
  }
}

// 保存数据
const handlerFormData = () => {
  if (props.editType === 1) {
    if (moduleData.selectMaintainStandards && moduleData.selectMaintainStandards.length > 0) {
      formData.standardId = moduleData.selectMaintainStandards.forEach((item: any) => item.maintenanceStandardId).join(",");
    }
    if (moduleData.selectDevices && moduleData.selectDevices.length > 0) {
      moduleData.selectDevices.forEach((item: any) => {
        formData.deviceId = item.rowId;
        api.apis.add(formData);
        onCancel();
      });
    } else {
      // api.apis.add(formData);
    }
  } else if (props.editType === 2) {
    // api.apis.edit(formData).then(() => {
    //   ElMessage.success("修改成功");
    // });
    console.log(formData);
  }
}

// 关闭编辑弹窗
const onCancel = () => {
  emit("closeDialog");
};
</script>

<style lang="scss">
.dialog-edit .el-dialog--center {
  min-width: 450px;
}
.spareTable {
  th {
    padding: 0 !important;
    height: 30px;
    line-height: 30px;
  }
  td {
    padding: 0 !important;
    height: 30px;
    line-height: 30px;
  }
}
</style>