<template>
  <el-dialog
    :close-on-click-modal="false"
    @close="onCancel"
    v-model="newAdd.dialog"
    :title="dialogType == 0 ? '申请信息' : '备件还回'"
    width="60%"
    center
  >
    <el-form
      ref="newAddForm"
      :inline="true"
      :model="detailsFrom"
      label-width="140px"
      size="small"
      :label-position="'right'"
    >
      <el-form-item label="日期：">
        <el-input readonly v-model="detailsFrom.applyTime"></el-input>
      </el-form-item>
      <el-form-item label="单号：">
        <el-input readonly v-model="detailsFrom.sparePartConsumeCode"></el-input>
      </el-form-item>
      <el-form-item label="申请人：">
        <el-input readonly v-model="detailsFrom.proposer"></el-input>
      </el-form-item>
      <el-form-item label="领用类型：">
        <el-input readonly v-model="detailsFrom.consumeType"></el-input>
      </el-form-item>
      <el-form-item label="仓库：">
        <el-input readonly v-model="detailsFrom.warehouseName"></el-input>
      </el-form-item>
      <el-form-item label="关联单号：">
        <el-input readonly v-model="detailsFrom.associatedCode"></el-input>
      </el-form-item>
      <el-form-item label="关联设备：">
        <el-input readonly v-model="detailsFrom.deviceName"></el-input>
      </el-form-item>
      <el-form-item label="部门：">
        <el-input readonly v-model="detailsFrom.departmentName"></el-input>
      </el-form-item>
      <!-- <el-form-item label="单位：">
        <el-input readonly v-model="detailsFrom.providerName"></el-input>
      </el-form-item> -->
      <el-form-item label="备注:" style="width: 80%">
        <el-input readonly v-model="detailsFrom.remark" type="textarea"></el-input>
      </el-form-item>
      <el-table
        v-if="dialogType == 0"
        class="stockTable"
        :data="detailsFrom.detailList"
        border
        fit
        highlight-current-row
        empty-text="暂无数据"
        style="width: 100%; font-size: 10px"
        :cell-style="{ padding: '2px' }"
      >
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
          prop="inventory"
          label="当前库存"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="applyCount"
          label="申请数量"
        />
        <el-table-column label="出库数量" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-input
              v-model.number="scope.row.outputWarehouseCount"
              size="small"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        class="stockTable"
        v-if="dialogType == 1"
        :data="detailsFrom.detailList"
        border
        fit
        highlight-current-row
        empty-text="暂无数据"
        style="width: 100%; font-size: 10px"
        :cell-style="{ padding: '2px' }"
      >
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
          prop="measuringUnitName"
          label="计量单位"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="applyCount"
          label="申请数量"
        />
        <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="outputWarehouseCount"
          label="出库数量"
        />
        <el-table-column label="使用数量" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-input v-model.number="scope.row.useCount" size="small"></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column
          :show-overflow-tooltip="true"
          align="center"
          min-width="80"
          prop="futureReturnCount"
          label="待还回"
        /> -->
        <el-table-column label="待还回" min-width="80" align="center">
          <template v-slot:default="scope">
            <p>
              {{ scope.row.outputWarehouseCount - scope.row.useCount }}
            </p>
          </template>
        </el-table-column>
        <el-table-column label="还回数量" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-input v-model.number="scope.row.returnCount" size="small"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button v-if="dialogType == 0" type="primary" @click="auditConsume"
          >审核</el-button
        >
        <el-button v-if="dialogType == 0" type="primary" @click="rejectConsume"
          >驳回</el-button
        >
        <el-button v-if="dialogType == 1" type="primary" @click="returnConsume"
          >确认</el-button
        >
        <el-button @click="onCancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import api from "../../api/spareParts";
import { reactive, onMounted, ref, watch } from "vue";
import { applyDetails } from "../../types/spareParts";
const props = defineProps({
  auditInfo: {
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
});
watch(
  () => props.dialog,
  () => {
    console.log(props.dialog);
    console.log(props.auditInfo);
    newAdd.dialog = props.dialog;
    detailsFrom.applyTime = props.auditInfo.applyTime;
    detailsFrom.associatedCode = props.auditInfo.associatedCode;
    detailsFrom.consumeType = props.auditInfo.consumeType;
    detailsFrom.departmentName = props.auditInfo.departmentName;
    detailsFrom.deviceName = props.auditInfo.deviceName;
    detailsFrom.providerName = props.auditInfo.providerName;
    detailsFrom.sparePartConsumeCode = props.auditInfo.sparePartConsumeCode;
    detailsFrom.proposer = props.auditInfo.proposer;
    detailsFrom.warehouseName = props.auditInfo.warehouseName;
    detailsFrom.warehouseId = props.auditInfo.warehouseId;
    detailsFrom.remark = props.auditInfo.remark;
    detailsFrom.id = props.auditInfo.id;
    getDetailList();
  }
);
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

const detailsFrom = reactive<applyDetails>({
  applyTime: "",
  proposer: "",
  consumeType: "",
  warehouseName: "",
  associatedCode: "",
  deviceName: "",
  departmentName: "",
  providerName: "",
  sparePartConsumeCode: "",
  whetherReturn: "",
  returnTime: "",
  remark: "",
  id: "",
  warehouseId: "",
  detailPage: 1,
  detailTotal: 0,
  detailList: [],
});

// 审核
const auditConsume = () => {
  newAddForm.value.validate((valid: any) => {
    if (valid) {
      console.log(detailsFrom.detailList);
      api.article
        .auditConsume({
          detailAuditDTOList: detailsFrom.detailList,
          id: detailsFrom.id,
        })
        .then((res: any) => {
          console.log(res.data);
          ElMessage.success("已审核！");
          newAdd.dialog = false;
        });
    } else {
      return false;
    }
  });
};
// 驳回
const rejectConsume = () => {
  newAddForm.value.validate((valid: any) => {
    if (valid) {
      console.log(detailsFrom.detailList);
      api.article.reject(detailsFrom.id).then((res: any) => {
        console.log(res.data);
        ElMessage.success("已驳回！");
        newAdd.dialog = false;
      });
    } else {
      return false;
    }
  });
};
// 还回
const returnConsume = () => {
  newAddForm.value.validate((valid: any) => {
    if (valid) {
      console.log(detailsFrom.detailList);
      api.article
        .return({
          detailReturnDTOList: detailsFrom.detailList,
          id: detailsFrom.id,
        })
        .then((res: any) => {
          console.log(res.data);
          ElMessage.success("已还回！");
          newAdd.dialog = false;
        });
    } else {
      return false;
    }
  });
};

// 根据备件领用单id查询领用明细
const getDetailList = () => {
  api.article
    .getconsumedetails({
      sparePartConsumeId: detailsFrom.id,
      warehouseId: detailsFrom.warehouseId,
      currentPage: detailsFrom.detailPage,
      pageSize: 10,
    })
    .then((res: any) => {
      console.log(res.data);
      detailsFrom.detailList = res.data.data.records;
      detailsFrom.detailTotal = res.data.data.total;
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
