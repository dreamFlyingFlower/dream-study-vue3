<template>
  <div class="dialog-edit">
    <el-dialog :close-on-click-modal="false" @close="onCancel" v-model="moduleData.dialogVisible" title="保养计划信息"
      width="60%" center>
      <!-- <div>
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
      </div> -->

      <!-- 设备模块 -->
      <div>
        <h3>设备信息</h3>
        <el-col style="margin: 10px 0;float:none;">
          <el-button size="small" type="primary" @click="showDevice">选择设备</el-button>
        </el-col>
        <el-form ref="ruleFormDeviceRef" :inline="true" :rules="editRules" :model="formDataDevice" label-width="140px">
          <el-form-item label="设备编号:" prop="deviceCode" size="small">
            <el-input v-model="formDataDevice.deviceCode" placeholder="设备编号"></el-input>
          </el-form-item>
          <el-form-item label="设备名称:" prop="deviceName" size="small">
            <el-input v-model="formDataDevice.deviceName" placeholder="设备名称"></el-input>
          </el-form-item>
          <el-form-item label="设备类别:" prop="deviceType" size="small">
            <el-input v-model="formDataDevice.deviceType" placeholder="设备类别"></el-input>
          </el-form-item>
          <el-form-item label="规格型号:" prop="modelNumber" size="small">
            <el-input v-model="formDataDevice.modelNumber" placeholder="规格型号"></el-input>
          </el-form-item>
          <el-form-item label="所在部门:" prop="departmentCode" size="small">
            <el-select v-model="formDataDevice.departmentCode" placeholder="所在部门">
              <el-option v-for="item in moduleData.organizations" :key="item.organizationCode"
                :value="item.organizationCode" :label="item.organizationName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <!-- 处理情况 -->
        <h3>处理情况</h3>
        <el-form style="margin-top:10px;" ref="ruleFormDeviceRef" :inline="true" :rules="editRules"
          :model="formDataHandler" label-width="140px">
          <el-form-item label="保养级别:" prop="maintainLevel" size="small">
            <el-select v-model="formDataHandler.maintainLevel" placeholder="请选择保养级别">
              <el-option v-for="item in moduleData.upkeepLevels" :key="item.key" :label="item.label" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="外委单位:" prop="outsourcedOrgCode" size="small">
            <el-select v-model="formDataHandler.outsourcedOrgCode" placeholder="请选择外委单位">
              <el-option v-for="item in moduleData.suppliers" :key="item.rowId" :label="item.supplierName"
                :value="item.rowId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="保养状态:" prop="upkeepStatue" size="small">
            <el-select v-model="formDataHandler.upkeepStatue" placeholder="请选择保养状态">
              <el-option v-for="item in moduleData.upkeepStatues" :key="item.key" :label="item.label" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间:" size="small">
            <el-date-picker v-model="formDataHandler.startTime" type="datetime" placeholder="开始时间"
              format="YYYY-MM-DD  hh:mm" value-format="YYYY-MM-DD  hh:mm" style="width: 193px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间:" size="small">
            <el-date-picker v-model="formDataHandler.endTime" type="datetime" placeholder="结束时间"
              format="YYYY-MM-DD  hh:mm" value-format="YYYY-MM-DD  hh:mm" style="width: 193px;">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="保养用时:" size="small" style="width:40%">
            <el-input v-model="formDataHandler.upkeepSpendTimeHour" style="width:40%;"></el-input>时
            <el-input v-model="formDataHandler.upkeepSpendTimeMinute" style="width:40%;"></el-input>分
          </el-form-item>
          <el-form-item label="保养费用:" size="small">
            <el-input type="number" v-model="formDataHandler.upkeepCost" placeholder="保养费用,单位元"></el-input>
          </el-form-item>
          <el-form-item label="是否停机:" size="small">
            <el-radio v-model="formDataHandler.ifMachineHalt" label="1" size="small">停机</el-radio>
            <el-radio v-model="formDataHandler.ifMachineHalt" label="0" size="small">未停机</el-radio>
          </el-form-item>
          <el-form-item label="停机时长:" size="small">
            <el-input v-model="formDataHandler.machineHaltTime" placeholder="停机时长,单位分钟" @input="handlerMachineHaltTime">
            </el-input>
          </el-form-item>
          <el-form-item label="工作描述:" size="small" style="width:82%;">
            <el-input type="textarea" v-model="formDataHandler.orderDescribe" placeholder="工作描述"></el-input>
          </el-form-item>
        </el-form>

        <!-- 选择保养人 -->
        <h3>保养工作量</h3>
        <el-col style="margin: 10px 0;">
          <el-button size="small" type="primary" @click="showUser">增加人员</el-button>
        </el-col>
        <el-table class="spareTable" :data="moduleData.selectUsers" border fit highlight-current-row empty-text="暂无数据"
          style="width: 100%" height="120">
          <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
          <el-table-column label="操作" min-width="80" align="center">
            <template v-slot:default="scope">
              <el-button type="text" size="small" @click="removeDataUser(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="realName" label="姓名" />
        </el-table>

        <!-- 选择保养标准 -->
        <h3>保养部位</h3>
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
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="ifUpkeep" label="是否保养">
            <template v-slot:default="scope">
              <el-radio v-model="scope.row.ifUpkeep" label="1" size="large">是</el-radio>
              <el-radio v-model="scope.row.ifUpkeep" label="0" size="large">否</el-radio>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="remark" label="备注">
            <template v-slot:default="scope">
              <el-input v-model="scope.row.remark" placeholder="备注"></el-input>
            </template>
          </el-table-column>
        </el-table>

        <!-- 更换备件 -->
        <h3>更换备件</h3>
        <div style="margin: 10px 0;">
          <span style="margin-right:10px">选择仓库</span>
          <el-select v-model="moduleData.warehouseId" placeholder="请选择仓库" size="small">
            <el-option v-for="item in moduleData.warehouses" :key="item.rowId" :value="item.rowId"
              :label="item.warehouseName"></el-option>
          </el-select>
        </div>
        <div>
          <el-button size="small" type="primary" @click="showSparePart">选择备件</el-button>
        </div>
        <el-table class="spareTable" :data="moduleData.selectSpareParts" border fit highlight-current-row
          empty-text="暂无数据" style="width: 100%" height="120">
          <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
          <el-table-column label="操作" min-width="80" align="center">
            <template v-slot:default="scope">
              <el-button type="text" size="small" @click="removeDataSparePart(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="sparePartCode"
            label="备件编号" />
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="sparePartName"
            label="备件名称">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="measuringUnitName"
            label="计量单位">
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="140" prop="applyCount" label="申请数量">
            <template #default="scope">
              <el-input style="width:100%;" size="small" v-model="scope.row.applyCount"
                @input="handlerSpareApplyCountInput" @blur="handlerSpareApplyCountBlur" placeholder="申请数量" />
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="140" prop="outStockCount"
            label="出库数量">
            <template #default="scope">
              <el-input style="width:100%;" size="small" v-model="scope.row.outStockCountInput" placeholder="出库数量"
                @input="handlerSpareOutStockCountInput" disabled />
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="140" prop="useCount" label="使用数量">
            <template #default="scope">
              <el-input style="width:100%;" size="small" v-model="scope.row.useCount" @input="handlerSpareUseCountInput"
                @blur="handlerSpareUseCountBlur" placeholder="使用数量" />
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" align="center" min-width="140" prop="backCount" label="还回数量">
            <template #default="scope">
              <el-input style="width:100%;" size="small" v-model="scope.row.backCount"
                @input="handlerSpareBackCountInput" @blur="handlerSpareBackCountBlur" placeholder="还回数量" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="handlerFormData">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <DeviceSelect v-if="moduleData.deviceDialog" :show-dialog="moduleData.deviceDialog" :multiple="false"
      @closeDialog="closeDeviceDialog" />

    <UserSelect v-if="moduleData.userDialog" :show-dialog="moduleData.userDialog" @closeDialog="closeUserDialog" />

    <MaintainStandard v-if="moduleData.maintainStandardDialog" :show-dialog="moduleData.maintainStandardDialog"
      :extra-columns="{ifUpkeep:'1'}" @closeDialog="closeMaintainStandardDialog" />

    <SparePart v-if="moduleData.sparePartDialog" :show-dialog="moduleData.sparePartDialog"
      :warehouse-id="moduleData.warehouseId" :extra-columns="{outStockCount:0,backCount:0,useCount:0,applyCount:0}"
      @closeDialog="closeSparePartDialog" />

  </div>
</template>

<script lang="ts" setup>
import { ElForm, ElMessage } from "element-plus";
import { reactive, ref, onMounted, watch } from "vue";
import api from "../../../api/upkeepOrder";
import apiUser from '../../../api/user';
import apiOrganization from '../../../api/organization';
import apiWarehouse from '../../../api/warehouse';
import apiSupplier from '../../../api/supplier';
import DeviceSelect from '../../../components/Device/index.vue';
import UserSelect from '../../../components/User/index.vue';
import MaintainStandard from '../../../components/MaintainStandard/index.vue';
import SparePart from '../../../components/SparePart/index.vue';

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
  // 人员数据
  users: [],
  // 部门列表
  organizations: [],
  // 供应商列表
  suppliers: [],
  // 仓库列表
  warehouses: [],
  // 当前选择仓库编号
  warehouseId: null,
  // 设备选择弹出页显示与否
  deviceDialog: false,
  // 用户选择弹出显示与否
  userDialog: false,
  // 保养标准弹出页显示与否
  maintainStandardDialog: false,
  // 备件选择弹出页显示与否
  sparePartDialog: false,
  // 选中的设备列表
  selectDevices: [],
  // 选中的用户列表
  selectUsers: [],
  // 选中的保养标准列表
  selectMaintainStandards: [],
  // 选中的备件列表
  selectSpareParts: [],
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
  ],
  // 保养状态
  upkeepStatues: [
    { key: "1", label: "待保养" },
    { key: "2", label: "保养中" },
    { key: "3", label: "已完成" },
  ]
});

// 声明表单数据
const formData = reactive<any>({
  id: null,
  loopCycle: null,
  cycleUnit: null,
  // 保养计划时间
  upkeepDate: null,
  upkeepPlanTimeStart: null,
  upkeepPlanTimeEnd: null,
  remindTime: null,
  // 计划开始时间
  planStartTime: null,
  // 计划结束时间
  planEndTime: null,
  // 用户id,多个用逗号隔开
  applicant: null,
  // 用户名,多个用逗号隔开
  applicantName: null,
  planDescribe: null,
  deviceId: null,
  standardId: null,
  planStatue: null,
  // 保养部位集合
  upkeepPositionList: [],
  // 更换备件集合
  replacePositionDTOList: []
});

// 设备数据
const formDataDevice = reactive<any>({
  deviceCode: null,
  deviceName: null,
  deviceType: null,
  modelNumber: null,
  departmentCode: null,
});

// 处理情况数据
const formDataHandler = reactive<any>({
  // 保养级别
  maintainLevel: null,
  // 外委单位
  outsourcedOrgCode: null,
  // 保养状态
  upkeepStatue: null,
  // 实际开始时间
  startTime: null,
  // 实际结束时间
  endTime: null,
  // 保养用时
  upkeepSpendTime: null,
  // 保养用时小时
  upkeepSpendTimeHour: 0,
  // 保养用时分钟
  upkeepSpendTimeMinute: 0,
  // 保养费用
  upkeepCost: null,
  // 是否停机:0否,1是
  ifMachineHalt: '0',
  // 停机时长,分钟
  machineHaltTime: 0,
  // 工作描述
  orderDescribe: null
});

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);

// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const ruleFormDeviceRef = ref<InstanceType<typeof ElForm>>();


// 声明表单校验规则
const editRules = reactive({
  maintainLevel: { required: true, message: "请选择保养级别", trigger: "change" },
  // loopCycle: [{ required: true, message: "请输入循环周期", trigger: "blur" }],
  // cycleUnit: [{ required: true, message: "请选择循环周期单位", trigger: "change" }],
  // upkeepDate: { required: true, message: "请选择保养时间", trigger: "blur" },
  upkeepStatue: { required: true, message: "请选择保养状态", trigger: "change" },
});

// 声明设备类型树形选择框的显示属性,传递给treeSelect组件
const defaultProps = {
  value: 'typeCode',
  label: 'label',
  children: 'children'
};

// 监控
watch(
  () => formData.upkeepDate, () => {
    if (formData.upkeepDate && formData.upkeepDate.length > 0) {
      formData.upkeepPlanTimeStart = formData.upkeepDate[0];
      formData.upkeepPlanTimeEnd = formData.upkeepDate[0];
    }
  }
);

// 初始化方法
onMounted(async () => {
  init();
  getUsers();
  getOrganizations();
  getSuppliers();
  getWarehouses();
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

// 部门列表
const getOrganizations = () => {
  apiOrganization.apis.getList({}).then((res: any) => {
    moduleData.organizations = res.data;
  });
}

// 供应商列表
const getSuppliers = () => {
  apiSupplier.apis.getList({}).then((res: any) => {
    moduleData.suppliers = res.data;
  });
}

// 用户列表
const getUsers = () => {
  apiUser.apis.selectlists({}).then((res: any) => {
    moduleData.users = res.data;
  });
}

// 仓库列表
const getWarehouses = () => {
  apiWarehouse.apis.getList({}).then((res: any) => {
    moduleData.warehouses = res.data;
  });
}


/************************** 设备 start ************************/
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
  let temp = val[0];
  formDataDevice.deviceCode = temp.deviceCode;
  formDataDevice.deviceName = temp.deviceName;
  formDataDevice.deviceType = temp.typeName;
  formDataDevice.modelNumber = temp.modelNumber;
  formDataDevice.departmentCode = temp.useDept;
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
/************************** 设备 start ************************/


/************************** 处理情况 start ************************/
// 处理停机时长
const handlerMachineHaltTime = (val: any) => {
  formDataHandler.machineHaltTime = val ? Number.parseInt(val) : null;
}
/************************** 处理情况 end ************************/


/************************** 用户 start ************************/
// 显示保养标准
const showUser = () => {
  moduleData.userDialog = true;
}

// 关闭保养标准弹窗
const closeUserDialog = (val: any[]) => {
  moduleData.userDialog = false;
  if (!val || val.length === 0) {
    return;
  }
  if (moduleData.selectUsers && moduleData.selectUsers.length === 0) {
    moduleData.selectUsers = val;
  } else {
    // 去重
    val.forEach((element: any) => {
      let flag = true;
      for (const item of moduleData.selectUsers) {
        if (element.userId === item.userId) {
          flag = false;
          break;
        }
      }
      if (flag) {
        moduleData.selectUsers.push(element);
      }
    });
  }
}

// 删除选中的保养标准
const removeDataUser = (row: any) => {
  if (!moduleData.selectUsers || moduleData.selectUsers.length === 0) {
    return;
  }
  let index = moduleData.selectUsers.findIndex((value: any) => row.userId === value.userId);
  if (index !== -1) {
    moduleData.selectUsers.splice(index, 1);
  }
}
/************************** 用户 end ************************/


/************************** 保养标准 start ************************/
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
/************************** 保养标准 end ************************/


/************************** 备件 start ************************/
// 显示备件选择弹窗
const showSparePart = () => {
  if (!moduleData.warehouseId) {
    ElMessage("请先选择仓库!");
    return;
  }
  moduleData.sparePartDialog = true;
}

// 关闭备件选择弹窗
const closeSparePartDialog = (val: any[]) => {
  console.log(val);
  moduleData.sparePartDialog = false;
  if (!val || val.length === 0) {
    return;
  }
  if (moduleData.selectSpareParts && moduleData.selectSpareParts.length === 0) {
    moduleData.selectSpareParts = val;
  } else {
    // 去重
    val.forEach((element: any) => {
      let flag = true;
      for (const item of moduleData.selectSpareParts) {
        if (element.rowId === item.rowId) {
          flag = false;
          break;
        }
      }
      if (flag) {
        moduleData.selectSpareParts.push(element);
      }
    });
  }
}

// 处理备件申请数量
const handlerSpareApplyCountInput = (row: any) => {
  row.applyCount = row.applyCount ? Number.parseInt(row.applyCount) : null;
}

// 申请数量=使用数量+还回数量,未测试
const handlerSpareApplyCountBlur = (row: any) => {
  if (!row.applyCount && !row.useCount && !row.backCount) {
    return;
  }
  if (row.applyCount) {
    if (!row.useCount && !row.backCount) {
      row.useCount = row.applyCount;
      row.backCount = 0;
    } else {
      if (row.useCount) {
        row.backCount = row.applyCount - row.useCount;
      } else {
        row.backCount = row.backCount ? row.backCount : 0;
        row.useCount = row.applyCount - row.backCount;
      }
    }
  } else {
    if (row.useCount) {
      if (!row.backCount) {
        row.backCount = 0;
        row.applyCount = row.useCount;
      } else {
        row.applyCount = row.useCount + row.backCount;
      }
    } else {
      row.useCount = 0;
      row.applyCount = row.backCount;
    }
  }
}

// 处理备件出库数量
const handlerSpareOutStockCountInput = (row: any) => {
  row.outStockCount = row.outStockCount ? Number.parseInt(row.outStockCount) : null;
}

// 处理备件使用数量
const handlerSpareUseCountInput = (row: any) => {
  row.useCount = row.useCount ? Number.parseInt(row.useCount) : null;
}

// 申请数量=使用数量+还回数量,未完成
const handlerSpareUseCountBlur = (row: any) => {
  if (!row.applyCount && !row.useCount && !row.backCount) {
    return;
  }
  if (row.applyCount) {
    if (!row.useCount && !row.backCount) {
      row.useCount = row.applyCount;
      row.backCount = 0;
    } else {
      if (row.useCount) {
        row.backCount = row.applyCount - row.useCount;
      } else {
        row.backCount = row.backCount ? row.backCount : 0;
        row.useCount = row.applyCount - row.backCount;
      }
    }
  } else {
    if (row.useCount) {
      if (!row.backCount) {
        row.backCount = 0;
        row.applyCount = row.useCount;
      } else {
        row.applyCount = row.useCount + row.backCount;
      }
    } else {
      row.useCount = 0;
      row.applyCount = row.backCount;
    }
  }
}

// 处理备件还回数量
const handlerSpareBackCountInput = (row: any) => {
  row.backCount = row.backCount ? Number.parseInt(row.backCount) : null;
}

// 申请数量=使用数量+还回数量,未完成
const handlerSpareBackCountBlur = (row: any) => {
  if (!row.applyCount && !row.useCount && !row.backCount) {
    return;
  }
  if (row.applyCount) {
    if (!row.useCount && !row.backCount) {
      row.useCount = row.applyCount;
      row.backCount = 0;
    } else {
      if (row.useCount) {
        row.backCount = row.applyCount - row.useCount;
      } else {
        row.backCount = row.backCount ? row.backCount : 0;
        row.useCount = row.applyCount - row.backCount;
      }
    }
  } else {
    if (row.useCount) {
      if (!row.backCount) {
        row.backCount = 0;
        row.applyCount = row.useCount;
      } else {
        row.applyCount = row.useCount + row.backCount;
      }
    } else {
      row.useCount = 0;
      row.applyCount = row.backCount;
    }
  }
}

// 删除选中的备件
const removeDataSparePart = (row: any) => {
  if (!moduleData.selectSpareParts || moduleData.selectSpareParts.length === 0) {
    return;
  }
  let index = moduleData.selectSpareParts.findIndex((value: any) => row.id === value.id);
  if (index !== -1) {
    moduleData.selectSpareParts.splice(index, 1);
  }
}
/************************** 备件 end ************************/

// 保存数据
const handlerFormData = () => {
  console.log(moduleData.selectSpareParts);
  // 新增快速工单时处理
  if (props.editType === 1) {
    // 处理保养用时,转成分钟
    let upkeepSpendTime: any = null;
    if (formData.upkeepSpendTimeHour && formData.upkeepSpendTimeHour > 0) {
      upkeepSpendTime = formData.upkeepSpendTimeHour * 60;
    }
    if (formData.upkeepSpendTimeMinute && formData.upkeepSpendTimeMinute > 0) {
      upkeepSpendTime = upkeepSpendTime ? upkeepSpendTime + formData.upkeepSpendTimeMinute
        : formData.upkeepSpendTimeMinute;
    }
    formData.upkeepSpendTime = upkeepSpendTime;

    // 处理保养用户
    if (moduleData.selectUsers && moduleData.selectUsers.length > 0) {
      let applicants: any = [];
      let applicantName: any = [];
      moduleData.selectUsers.forEach((item: any) => {
        applicants.push(item.userId);
        applicantName.push(item.userName);
      });
      formData.applicant = applicants.join(",");
      formData.applicantName = applicantName.join(",");
    }

    // 处理备件,检查申请数量等是否未填
  }

  // if (props.editType === 1) {
  //   if (moduleData.selectMaintainStandards && moduleData.selectMaintainStandards.length > 0) {
  //     formData.standardId = moduleData.selectMaintainStandards.forEach((item: any) => item.maintenanceStandardId).join(",");
  //   }
  //   if (moduleData.selectDevices && moduleData.selectDevices.length > 0) {
  //     moduleData.selectDevices.forEach((item: any) => {
  //       formData.deviceId = item.rowId;
  //       api.apis.add(formData);
  //       onCancel();
  //     });
  //   } else {
  //     // api.apis.add(formData);
  //   }
  // } else if (props.editType === 2) {
  //   // api.apis.edit(formData).then(() => {
  //   //   ElMessage.success("修改成功");
  //   // });
  //   console.log(formData);
  // }
}

// 关闭编辑弹窗
const onCancel = () => {
  emit("closeDialog");
};
</script>

<style lang="scss">
.dialog-edit .el-dialog--center {
  min-width: 450px;

  h3 {
    margin: 15px 0 0 0;
    background-color: lightgray;
  }
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