<template>
  <el-dialog
    :close-on-click-modal="false"
    @close="onCancel"
    v-model="newAdd.dialog"
    :title="dialogType == 0 ? '添加出库' : '出库单详情'"
    width="60%"
    center
  >
    <el-form
      ref="newAddForm"
      :inline="true"
      :rules="newAddRules"
      :model="addForm"
      label-width="140px"
      :label-position="'right'"
      size="small"
    >
      <el-form-item label="单号：">
        <el-input disabled size="small" v-model="addForm.changeWarehouseCode"></el-input>
      </el-form-item>
      <el-form-item label="日期：" prop="outputInputTime">
        <el-date-picker
          :disabled="dialogType != 0"
          style="width: 200px"
          size="small"
          v-model="addForm.outputInputTime"
          value-format="YYYY-MM-DD"
          type="date"
          placeholder="日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="仓库：" prop="warehouseId">
        <el-select
          :disabled="dialogType != 0"
          clearable
          v-model="addForm.warehouseId"
          placeholder="仓库"
          @change="warehouseChange"
        >
          <el-option
            v-for="(item, index) in dictList"
            :key="item.rowId"
            :label="item.warehouseName"
            :value="item.rowId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出库类型：" prop="type">
        <el-select
          :disabled="dialogType != 0"
          clearable
          v-model="addForm.type"
          placeholder="出库类型"
        >
          <!-- <el-option label="采购出库" value="采购出库"> </el-option> -->
          <el-option label="盘点出库" value="盘点出库"> </el-option>
          <el-option label="领用出库" value="领用出库"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="使用部门：">
        <el-select
          :disabled="dialogType == 1"
          clearable
          v-model="addForm.departmentId"
          placeholder="使用部门"
        >
          <el-option
            v-for="(item, index) in newAdd.entitysList"
            :key="item.rowId"
            :label="item.supplierName"
            :value="item.rowId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="仓库管理员：">
        <el-input
          :readonly="dialogType == 1"
          v-model="addForm.warehouseManager"
          placeholder="仓库管理员"
        ></el-input>
      </el-form-item>
      <el-form-item label="经办人：">
        <el-input
          :readonly="dialogType == 1"
          v-model="addForm.operator"
          placeholder="经办人"
        ></el-input>
      </el-form-item>
      <el-form-item label="关联单号：">
        <el-input
          :readonly="dialogType != 0"
          v-model="addForm.associatedCode"
          placeholder="关联单号"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注:" style="width: 80%">
        <el-input
          :readonly="dialogType == 1"
          v-model="addForm.remark"
          type="textarea"
        ></el-input>
      </el-form-item>
      <div class="selectionControl">
        <el-button size="small" v-if="dialogType == 0" type="primary" @click="selectSpare"
          >选择备件</el-button
        >
        <el-button size="small" v-else type="info" plain>备件信息</el-button>
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
      >
        <el-table-column
          label="操作"
          min-width="80"
          align="center"
          v-if="dialogType == 0"
        >
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
          prop="measuringUnit"
          label="计量单位"
        />
        <el-table-column label="数量" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-input-number
              :disabled="dialogType != 0"
              :controls="false"
              :precision="0"
              v-model="scope.row.count"
              size="small"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="actualPrice"
          label="单价"
        />
        <el-table-column label="金额" min-width="80" align="center">
          <template v-slot:default="scope">
            <p>
              {{ scope.row.actualPrice * scope.row.count.toFixed(2) }}
            </p>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="dialogType != 1" type="primary" @click="confirmButton"
          >确定</el-button
        >
        <el-button v-if="dialogType != 1" @click="onCancel">取消</el-button>
        <el-button v-if="dialogType == 1" @click="onCancel">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  <SelectionControl
    :dialog="newAdd.selectSpareDialog"
    :storehouseList="dictList"
    :colseDialog="selectDialog"
    :selcetedData="selcetedData"
    :warehouseId="addForm.warehouseId"
    :selectedList="addForm.detailList"
  ></SelectionControl>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import api from "../../api/storehouse";
import { reactive, onMounted, ref, watch, nextTick } from "vue";
import { outStock } from "../../types/storehouse";
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
    console.log(props.dialog);
    newAdd.dialog = props.dialog;
    switch (props.dialogType) {
      case 0:
        addForm.warehouseId = "";
        addForm.operator = "";
        addForm.type = "";
        addForm.outputInputTime = "";
        addForm.changeWarehouseCode = "";
        addForm.remark = "";
        addForm.departmentId = "";
        addForm.warehouseManager = "";
        addForm.associatedCode = "";
        addForm.detailList = [];
        break;
      default:
        addForm.warehouseId = props.rowInfo.warehouseId;
        addForm.type = props.rowInfo.type;
        addForm.warehouseId = props.rowInfo.warehouseId;
        addForm.operator = props.rowInfo.operator;
        addForm.departmentId = props.rowInfo.departmentId;
        addForm.warehouseId = props.rowInfo.warehouseId;
        addForm.associatedCode = props.rowInfo.associatedCode;
        addForm.changeWarehouseCode = props.rowInfo.changeWarehouseCode;
        addForm.warehouseManager = props.rowInfo.warehouseManager;
        addForm.remark = props.rowInfo.remark;
        addForm.detailList = props.rowInfo.detailList;
        getDetailList();
        break;
    }
    nextTick(() => {
      newAddForm.value.clearValidate();
    });
  }
);
// 声明事件
onMounted(async () => {
  await getEntitysList();
});

const newAdd = reactive<{
  dialog: boolean;
  selectSpareDialog: boolean;
  warehouseList: any;
  entitysList: any;
}>({
  dialog: false,
  selectSpareDialog: false,
  warehouseList: [],
  entitysList: [],
});
const newAddForm = ref();
const newAddRules = reactive({
  outputInputTime: [
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
  type: [
    {
      required: true,
      message: "此为必选项",
      trigger: "change",
    },
  ],
});
const addForm = reactive<outStock>({
  outputInputTime: "",
  changeWarehouseCode: "",
  warehouseId: "",
  type: "",
  departmentId: "",
  warehouseManager: "",
  operator: "",
  associatedCode: "",
  remark: "",
  detailList: "",
});
// 查询入库信息列表
const getDetailList = () => {
  api.article
    .getDetail({
      changeWarehouseId: props.rowInfo.id,
      warehouseId: addForm.warehouseId,
      currentPage: 1,
      pageSize: 100,
    })
    .then((res: any) => {
      console.log(res.data);
      addForm.detailList = res.data.list;
    });
};
// 选择备件
const selectSpare = () => {
  if (addForm.warehouseId == "") {
    ElMessage.warning("请先选择仓库");
    return;
  }
  newAdd.selectSpareDialog = true;
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
// 关闭弹窗
const selectDialog = () => {
  newAdd.selectSpareDialog = false;
};
// 关闭弹窗
const selcetedData = (selcetedData: any) => {
  console.log(selcetedData);
  let selcetedData_ = addForm.detailList;
  for (let i = 0; i < selcetedData.length; i++) {
    selcetedData_.push({
      actualPrice: selcetedData[i].referencePrice,
      count: 0,
      creator: selcetedData[i].creator,
      delFlag: selcetedData[i].delFlag,
      measuringUnit: selcetedData[i].measuringUnitName,
      remark: selcetedData[i].remark,
      sparePartCode: selcetedData[i].sparePartCode,
      sparePartId: selcetedData[i].id,
      sparePartName: selcetedData[i].sparePartName,
      specificationModel: selcetedData[i].specificationModel,
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
      return item.count > 0; //
    });
    if (!Ifzero) {
      ElMessage.warning("入库数量不能为0！");
      return;
    }
    if (valid) {
      console.log(addForm.detailList);
      if (props.dialogType == 1) {
        updateSpare();
      } else {
        addOutbound();
      }
    } else {
      return false;
    }
  });
};
// 新增出库
const addOutbound = () => {
  console.log(addForm.detailList);

  api.article
    .addOutbound({
      associatedCode: addForm.associatedCode,
      departmentId: addForm.departmentId,
      operator: addForm.operator,
      outputInputTime: addForm.outputInputTime,
      outputInputWarehouseDetailDTOList: addForm.detailList,
      remark: addForm.remark,
      type: addForm.type,
      warehouseId: addForm.warehouseId,
      warehouseManager: addForm.warehouseManager,
    })
    .then((res: any) => {
      console.log(res.data);
      ElMessage.success("新增成功！");
      newAdd.dialog = false;
    });
};
// 入库修改
const updateSpare = () => {
  console.log(addForm.detailList);
  api.article
    .update({
      associatedCode: addForm.associatedCode,
      departmentId: addForm.departmentId,
      operator: addForm.operator,
      outputInputTime: addForm.outputInputTime,
      outputInputWarehouseDetailDTOList: addForm.detailList,
      remark: addForm.remark,
      type: addForm.type,
      warehouseId: addForm.warehouseId,
      warehouseManager: addForm.warehouseManager,
      id: props.rowInfo.id,
    })
    .then((res: any) => {
      console.log(res.data);
      ElMessage.success("新增成功！");
      newAdd.dialog = false;
    });
};
// 查询仓库列表
const getEntitysList = () => {
  api.article.getEntitys({}).then((res: any) => {
    console.log(res.data);
    newAdd.entitysList = res.data;
  });
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
