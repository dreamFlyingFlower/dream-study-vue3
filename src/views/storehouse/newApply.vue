<template>
  <el-dialog
    :close-on-click-modal="false"
    @close="onCancel"
    v-model="newAdd.dialog"
    :title="dialogType == 0 ? '添加领用申请' : '申请详情'"
    width="60%"
    center
  >
    <el-form
      ref="newAddForm"
      :inline="true"
      :rules="newAddRules"
      :model="addForm"
      label-width="140px"
      size="small"
      :label-position="'right'"
    >
      <el-form-item label="单号：">
        <el-input
          :disabled="dialogType == 1"
          readonly
          size="small"
          v-model="addForm.sparePartConsumeCode"
        ></el-input>
      </el-form-item>
      <el-form-item label="日期：" prop="applyTime">
        <el-date-picker
          :disabled="dialogType == 1"
          style="width: 202px"
          size="small"
          v-model="addForm.applyTime"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="申请人：" prop="proposer">
        <el-input v-model="addForm.proposer" placeholder="申请人"></el-input>
      </el-form-item>
      <el-form-item label="领用类型：" prop="consumeType">
        <el-select clearable v-model="addForm.consumeType" placeholder="领用类型">
          <el-option label="维修" value="维修"> </el-option>
          <el-option label="保养" value="保养"> </el-option>
          <el-option label="工具" value="工具"> </el-option>
          <el-option label="其他" value="其他"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库：" prop="warehouseId">
        <el-select
          :disabled="dialogType == 1"
          clearable
          v-model="addForm.warehouseId"
          placeholder="仓库"
          @change="warehouseChange"
        >
          <el-option
            v-for="(item, index) in newAdd.warehouseList"
            :key="item.rowId"
            :label="item.warehouseName"
            :value="item.rowId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="关联单号：">
        <el-select clearable v-model="addForm.associatedCode" placeholder="关联单号">
        </el-select>
      </el-form-item>
      <el-form-item label="关联设备：">
        <el-select clearable v-model="addForm.deviceId" placeholder="关联设备">
          <el-option
            v-for="(item, index) in newAdd.deviceList"
            :key="item.rowId"
            :label="item.deviceName"
            :value="item.rowId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用部门：">
        <el-select clearable v-model="addForm.departmentCode" placeholder="使用部门">
          <el-option
            v-for="(item, index) in newAdd.entitysList"
            :key="item.rowId"
            :label="item.supplierName"
            :value="item.rowId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="单位：">
        <el-select clearable v-model="addForm.providerId" placeholder="单位">
          <el-option
            v-for="(item, index) in newAdd.entitysList"
            :key="item.rowId"
            :label="item.supplierName"
            :value="item.rowId"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="是否还回：">
        <el-switch
          v-model="addForm.whetherReturn"
          inline-prompt
          active-text="是"
          inactive-text="否"
          inactive-value="0"
          active-value="1"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="预计还回时间：">
        <el-date-picker
          style="width: 202px"
          size="small"
          :disabled="addForm.whetherReturn == 0"
          v-model="addForm.returnTime"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="备注:" style="width: 80%">
        <el-input v-model="addForm.remark" type="textarea"></el-input>
      </el-form-item>
      <div class="selectionControl">
        <el-button size="small" type="primary" @click="selectSpare">选择备件</el-button>
      </div>
      <el-table
        class="stockTable"
        :data="addForm.detailList"
        border
        fit
        highlight-current-row
        empty-text="暂无数据"
        style="width: 100%; font-size: 10px"
        :cell-style="{ padding: '2px' }"
        max-height="200"
      >
        <el-table-column label="操作" min-width="80" align="center">
          <template v-slot:default="scope">
            <el-button type="text" size="small" @click="delRow(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="sparePartCode"
          label="备件编号"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="sparePartName"
          label="备件名称"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="specificationModel"
          label="规格型号"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="inventory"
          label="分仓库库存"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="measuringUnitName"
          label="计量单位"
        />
        <el-table-column label="申请数量" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-input-number
              :controls="false"
              v-model="scope.row.applyCount"
              size="small"
            ></el-input-number>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="confirmButton">确定</el-button>
        <el-button @click="onCancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
  <SelectionControl
    :dialog="newAdd.selectSpareDialog"
    :storehouseList="newAdd.warehouseList"
    :warehouseId="addForm.warehouseId"
    :selectedList="addForm.detailList"
    :colseDialog="selectDialog"
    :selcetedData="selcetedData"
  ></SelectionControl>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import api from "../../api/spareParts";
import { reactive, onMounted, ref, watch, nextTick } from "vue";
import { newApply } from "../../types/spareParts";
import SelectionControl from "./selectioncontrol.vue";
const props = defineProps({
  dictList: {
    type: Object,
    default: "",
  },
  colseDialog: {
    type: Function,
    required: true,
  },
  dialog: {
    type: Boolean,
    default: false,
  },
  dialogType: {
    type: Number,
    default: 0,
  },
  rowInfo: {
    type: Object,
    default: "",
  },
});
watch(
  () => props.dialog,
  () => {
    newAdd.dialog = props.dialog;
    switch (props.dialogType) {
      case 0:
        addForm.applyTime = "";
        addForm.proposer = "";
        addForm.consumeType = "";
        addForm.warehouseId = "";
        addForm.associatedCode = "";
        addForm.deviceId = "";
        addForm.departmentCode = "";
        addForm.providerId = "";
        addForm.whetherReturn = 0;
        addForm.returnTime = "";
        addForm.remark = "";
        addForm.sparePartConsumeCode = "";
        addForm.detailList = [];
        break;
      case 1:
        addForm.applyTime = props.rowInfo.applyTime;
        addForm.sparePartConsumeCode = props.rowInfo.sparePartConsumeCode;
        addForm.proposer = props.rowInfo.proposer;
        addForm.consumeType = props.rowInfo.consumeType;
        addForm.warehouseId = props.rowInfo.warehouseId;
        addForm.associatedCode = props.rowInfo.associatedCode;
        addForm.deviceId = props.rowInfo.deviceId;
        addForm.departmentCode = props.rowInfo.departmentCode;
        addForm.providerId = props.rowInfo.providerId;
        addForm.whetherReturn = props.rowInfo.whetherReturn;
        addForm.returnTime = props.rowInfo.returnTime;
        addForm.remark = props.rowInfo.remark;
        addForm.detailList = props.rowInfo.detailList;
        getDetailList();
        break;
      default:
        break;
    }
    nextTick(() => {
      newAddForm.value.clearValidate();
    });

    console.log(props.dialog);

    nextTick(() => {
      newAddForm.value.clearValidate();
    });
  }
);
// 声明事件
onMounted(async () => {
  await getWarehouseList();
  await getDeviceList();
});

const newAdd = reactive<{
  dialog: boolean;
  selectSpareDialog: boolean;
  warehouseList: any;
  entitysList: any;
  deviceList: any;
}>({
  dialog: false,
  selectSpareDialog: false,
  warehouseList: [],
  entitysList: [],
  deviceList: [],
});
const newAddForm = ref();

const newAddRules = reactive({
  applyTime: [
    {
      required: true,
      message: "此为必填项",
      trigger: "blur",
    },
  ],
  proposer: [
    {
      required: true,
      message: "此为必填项",
      trigger: "blur",
    },
  ],
  warehouseId: [
    {
      required: true,
      message: "此为必选项",
      trigger: "change",
    },
  ],
  consumeType: [
    {
      required: true,
      message: "此为必选项",
      trigger: "change",
    },
  ],
});
const addForm = reactive<newApply>({
  applyTime: "",
  proposer: "",
  consumeType: "",
  warehouseId: "",
  associatedCode: "",
  deviceId: "",
  sparePartConsumeCode: "",
  departmentCode: "",
  providerId: "",
  whetherReturn: 0,
  returnTime: "",
  remark: "",
  detailList: [],
});
// 选择备件
const selectSpare = () => {
  if (addForm.warehouseId == "") {
    ElMessage.warning("请先选择仓库");
    return;
  }
  newAdd.selectSpareDialog = true;
};
// 根据备件领用单id查询领用明细
const getDetailList = () => {
  api.article
    .getconsumedetails({
      sparePartConsumeId: props.rowInfo.id,
      warehouseId: addForm.warehouseId,
      currentPage: 1,
      pageSize: 100,
    })
    .then((res: any) => {
      console.log(res.data);
      addForm.detailList = res.data.data.records;
    });
};
// 关闭弹窗
const selectDialog = () => {
  newAdd.selectSpareDialog = false;
};
// 删除
const delRow = (row: any) => {
  console.log(row);
  console.log(addForm.detailList);
  addForm.detailList.forEach((e: any, i: number) => {
    if (e.sparePartId == row.sparePartId) {
      addForm.detailList.splice(i, 1);
    }
  });
};
// 关闭弹窗
const selcetedData = (selcetedData: any) => {
  console.log(selcetedData);
  let selcetedData_ = addForm.detailList;
  for (let i = 0; i < selcetedData.length; i++) {
    selcetedData_.push({
      applyCount: 0,
      measuringUnitName: selcetedData[i].measuringUnitName,
      remark: selcetedData[i].remark,
      sparePartCode: selcetedData[i].sparePartCode,
      sparePartId: selcetedData[i].id,
      sparePartName: selcetedData[i].sparePartName,
      specificationModel: selcetedData[i].specificationModel,
      inventory: selcetedData[i].subInventoryTotal,
      tenantCode: selcetedData[i].tenantCode,
    });
  }
  const hash: any = {};
  const newArray = selcetedData_.reduce((item: any, next: any) => {
    hash[next.sparePartId] ? "" : (hash[next.sparePartId] = true && item.push(next));
    return item;
  }, []);
  addForm.detailList = newArray;
};
const confirmButton = () => {
  console.log(props.rowInfo);
  newAddForm.value.validate((valid: any) => {
    if (addForm.detailList.length == 0) {
      ElMessage.warning("至少选择一个备件！");
      return;
    }
    let Ifzero = addForm.detailList.every((item: any) => {
      return item.applyCount > 0; //
    });
    if (!Ifzero) {
      ElMessage.warning("申请数量不能为0！");
      return;
    }

    if (valid) {
      console.log(addForm.detailList);
      if (props.dialogType == 1) {
        updateSpare();
      } else {
        newAddSpare();
      }
    } else {
      return false;
    }
  });
};
// 新增备件
const newAddSpare = () => {
  api.article
    .addConsume({
      applyTime: addForm.applyTime,
      associatedCode: addForm.associatedCode,
      consumeType: addForm.consumeType,
      departmentCode: addForm.departmentCode,
      deviceId: addForm.deviceId,
      proposer: addForm.proposer,
      providerId: addForm.providerId,
      remark: addForm.remark,
      returnTime: addForm.returnTime,
      sparePartConsumeDetails: addForm.detailList,
      warehouseId: addForm.warehouseId,
      whetherReturn: addForm.whetherReturn,
    })
    .then((res: any) => {
      console.log(res.data);
      ElMessage.success("新增成功！");
      newAdd.dialog = false;
    });
};
// 修改备件
const updateSpare = () => {
  api.article
    .update({
      applyTime: addForm.applyTime,
      associatedCode: addForm.associatedCode,
      consumeType: addForm.consumeType,
      departmentCode: addForm.departmentCode,
      deviceId: addForm.deviceId,
      proposer: addForm.proposer,
      providerId: addForm.providerId,
      remark: addForm.remark,
      returnTime: addForm.returnTime,
      sparePartConsumeDetails: addForm.detailList,
      warehouseId: addForm.warehouseId,
      whetherReturn: addForm.whetherReturn,
      id: props.rowInfo.id,
    })
    .then((res: any) => {
      console.log(res.data);
      ElMessage.success("修改成功！");
      newAdd.dialog = false;
    });
};

// 查询仓库列表
const getWarehouseList = () => {
  api.article.getWarehouse({}).then((res: any) => {
    console.log(res.data);
    newAdd.warehouseList = res.data;
  });
};
// 查询设备
const getDeviceList = () => {
  api.article.deviceList({}).then((res: any) => {
    console.log(res.data);
    newAdd.deviceList = res.data;
  });
};

// 仓库切换
const warehouseChange = () => {
  if (addForm.detailList.length > 0) {
    ElMessageBox.confirm("当前只支持从一个仓库选择备件，是否切换仓库？", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
    })
      .then(() => {
        addForm.detailList = [];
      })
      .catch(() => {
        ElMessage({
          type: "info",
          message: "已取消",
        });
      });
  }
};

const onCancel = () => {
  props.colseDialog();
  newAdd.dialog = false;
};
</script>

<style lang="scss" scoped>
.selectionControl {
  margin: 20px 0;
}
</style>
