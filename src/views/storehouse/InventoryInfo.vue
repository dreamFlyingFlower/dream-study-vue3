<template>
  <el-dialog
    :close-on-click-modal="false"
    @close="onCancel"
    v-model="newAdd.dialog"
    :title="dialogType == 0 ? '添加盘点单' : '盘点单详情'"
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
        <el-input disabled v-model="addForm.blitemCode"></el-input>
      </el-form-item>
      <el-form-item label="仓库：" prop="warehouseId">
        <el-select
          clearable
          v-model="addForm.warehouseId"
          placeholder="仓库"
          :disabled="dialogType == 1"
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
      <el-form-item label="经办人：">
        <el-input
          v-model="addForm.operator"
          placeholder="经办人"
          :readonly="dialogType == 1"
        ></el-input>
      </el-form-item>

      <el-form-item label="备注:" style="width: 80%">
        <el-input
          v-model="addForm.remark"
          type="textarea"
          :readonly="dialogType == 1"
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
        <el-table-column label="操作" min-width="80" align="center" v-if="dialogType == 0">
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
          prop="measuringUnitName"
          label="计量单位"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="paperCount"
          label="账面数量"
        />
        <!-- <el-table-column label="账面数量" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-input v-model="scope.row.inventoryTotal" size="small"></el-input>
          </template>
        </el-table-column> -->
        <el-table-column label="实际数量" min-width="120" align="center">
          <template v-slot:default="scope">
            <!-- <el-input
              :disabled="dialogType == 1"
              v-model="scope.row.actualCount"
              size="small"
            ></el-input> -->
            <el-input-number
              :disabled="dialogType == 1"
              :controls="false"
              :precision="0" 
              v-model="scope.row.actualCount"
              size="small"
              style="width:90px"
            ></el-input-number>
          </template>
        </el-table-column>
        <!-- <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="overflowCount"
          label="盘盈数量"
        /> -->
        <el-table-column label="盘盈数量" min-width="80" align="center">
          <template v-slot:default="scope">
            <p>
              {{
                scope.row.actualCount >= scope.row.paperCount
                  ? scope.row.actualCount - scope.row.paperCount
                  : 0
              }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="盘亏数量" min-width="80" align="center">
          <template v-slot:default="scope">
            <p>
              {{
                scope.row.actualCount <= scope.row.paperCount
                  ? scope.row.paperCount - scope.row.actualCount
                  : 0
              }}
            </p>
          </template>
        </el-table-column>
        <!-- <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="lossCount"
          label="盘亏数量"
        /> -->
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="previousPositionalCode"
          label="原位置编码"
        />
        <!-- <el-table-column label="原位置编码" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-input v-model="scope.row.previousPositionalCode" size="small"></el-input>
          </template>
        </el-table-column> -->
        <el-table-column label="当前位置编码" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-input
              :disabled="dialogType == 1"
              v-model="scope.row.newPositionalCode"
              size="small"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column label="备注" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-input
              :disabled="dialogType == 1"
              v-model="scope.row.remark"
              size="small"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="dialogType == 0" type="primary" @click="addBlitem"
          >确定</el-button
        >
        <el-button v-if="dialogType == 0" @click="onCancel">取消</el-button>
        <el-button v-if="dialogType == 1" @click="onCancel">关闭</el-button>
      </span>
    </template>
  </el-dialog>
  <SelectionControl
    :dialog="newAdd.selectSpareDialog"
    :storehouseList="dictList"
    :warehouseId="addForm.warehouseId"
    :selectedList="addForm.detailList"
    :colseDialog="selectDialog"
    :selcetedData="selcetedData"
  ></SelectionControl>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import api from "../../api/inventory";
import { reactive, onMounted, ref, watch, nextTick } from "vue";
import { newAddInventory } from "../../types/spareInventory";
import SelectionControl from "./selectioncontrol.vue";
const props = defineProps({
  dictList: {
    type: Object,
    default: "",
  },
  dialogType: {
    type: Number,
    default: 0,
  },
  colseDialog: {
    type: Function,
    required: true,
  },
  dialog: {
    type: Boolean,
    default: false,
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
    console.log(props.rowInfo);
    newAdd.dialog = props.dialog;
    switch (props.dialogType) {
      case 0:
        addForm.warehouseId = "";
        addForm.operator = "";
        addForm.blitemCode = "";
        addForm.remark = "";
        addForm.detailList = [];
        break;
      case 1:
        addForm.warehouseId = props.rowInfo.warehouseId;
        addForm.operator = props.rowInfo.operator;
        addForm.blitemCode = props.rowInfo.blitemCode;
        addForm.remark = props.rowInfo.remark;
        addForm.detailList = props.rowInfo.detailList;
        break;
      default:
        break;
    }
    nextTick(() => {
      newAddForm.value.clearValidate();
    });
  }
);
// 声明事件
onMounted(async () => {});

const newAdd = reactive<{
  dialog: boolean;
  selectSpareDialog: boolean;
  warehouseList: any;
}>({
  dialog: false,
  selectSpareDialog: false,
  warehouseList: [],
});
const newAddForm = ref();
const newAddRules = reactive({
  warehouseId: [
    {
      required: true,
      message: "此为必选项",
      trigger: "change",
    },
  ],
});
const addForm = reactive<newAddInventory>({
  warehouseId: "",
  operator: "",
  blitemCode: "",
  remark: "",
  detailList: "",
});

// 选择备件
const selectSpare = () => {
  if (addForm.warehouseId == "") {
    ElMessage.warning("请先选择仓库");
    return;
  }
  newAdd.selectSpareDialog = true;
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
// 选择备件
const selcetedData = (selcetedData: any) => {
  console.log(selcetedData);
  let selcetedData_ = addForm.detailList;
  for (let i = 0; i < selcetedData.length; i++) {
    selcetedData_.push({
      actualCount: 0,
      lossCount: 0,
      newPositionalCode: "",
      previousPositionalCode: "",
      overflowCount: 0,
      remark: "",
      creator: selcetedData[i].creator,
      delFlag: selcetedData[i].delFlag,
      measuringUnitName: selcetedData[i].measuringUnitName,
      referencePrice: selcetedData[i].referencePrice,
      paperCount: selcetedData[i].subInventoryTotal,
      sparePartCode: selcetedData[i].sparePartCode,
      sparePartId: selcetedData[i].id,
      sparePartName: selcetedData[i].sparePartName,
      specificationModel: selcetedData[i].specificationModel,
    });
  }
  const hash: any = {};
  const newArray = selcetedData_.reduce((item: any, next: any) => {
    hash[next.sparePartId] ? "" : (hash[next.sparePartId] = true && item.push(next));
    return item;
  }, []);
  addForm.detailList = newArray;
  // addForm.detailList = selcetedData_;
};
// 新增盘点
const addBlitem = () => {
  newAddForm.value.validate((valid: any) => {
    if (addForm.detailList.length == 0) {
      ElMessage.warning("至少选择一个备件！");
      return;
    }
    // let Ifzero = addForm.detailList.every((item: any) => {
    //   return item.applyCount > 0; //
    // });
    // if (!Ifzero) {
    //   ElMessage.warning("申请数量不能为0！");
    //   return;
    // }
    if (valid) {
      console.log(addForm.detailList);
      api.article
        .addBlitem({
          blitemCode: addForm.blitemCode,
          operator: addForm.operator,
          detail: addForm.detailList,
          remark: addForm.remark,
          warehouseId: addForm.warehouseId,
        })
        .then((res: any) => {
          console.log(res.data);
          ElMessage.success("新增成功！");
          newAdd.dialog = false;
        });
    } else {
      return false;
    }
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
