<template>
  <el-dialog
    :close-on-click-modal="false"
    @close="onCancel"
    v-model="selectedInfo.dialog"
    title="选择备件"
    width="60%"
    center
  >
    <el-card shadow="hover">
      <div class="InquireList">
        <el-input
          size="small"
          v-model="selectedInfo.quickSearchStr"
          placeholder="编码,名称,型号"
          clearable
        />

        <el-cascader
          v-model="selectedInfo.sparePartTypeId"
          :options="selectedInfo.spareType"
          :show-all-levels="false"
          collapse-tags
          separator=","
          placeholder="请选择"
          :props="{
            checkStrictly: true,
          }"
          clearable
        ></el-cascader>
        <el-select
          size="small"
          clearable
          v-model="warehouseId"
          placeholder="仓库"
          disabled
        >
          <el-option
            v-for="(item, index) in storehouseList"
            :key="item.rowId"
            :label="item.warehouseName"
            :value="item.rowId"
          >
          </el-option>
        </el-select>
        <el-button size="small" @click="getSpareList">搜索</el-button>
      </div>
    </el-card>
    <el-table
      class="stockTable"
      ref="multipleTableRef"
      :data="selectedInfo.stockTable"
      border
      fit
      highlight-current-row
      empty-text="暂无数据"
      style="width: 100%; font-size: 10px"
      :cell-style="{ padding: '2px' }"
      height="300"
      @selection-change="selecedChange"
    >
      <el-table-column align="center" type="selection" width="55" />

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
        prop="sparePartTypeName"
        label="类型"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="inventoryTotal"
        label="库存数"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="subInventoryTotal"
        label="分库存"
      />
    </el-table>
    <el-pagination
      class="userPagination"
      small="small"
      layout="prev, pager, next"
      :total="selectedInfo.tabelTotal"
      @current-change="switchPageNum"
    >
    </el-pagination>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="sureDialog">确定</el-button>
        <el-button @click="onCancel">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { reactive, onMounted, ref, watch } from "vue";
import { selectioncontrol } from "../../types/storehouse";
import { toTree } from "../../utils/toTree";
import api from "../../api/storehouse";
const selectedInfo = reactive<selectioncontrol>({
  spareType: [],
  stockTable: [],
  selcetedData: [],
  sparePartTypeId: "",
  warehouseId: "",
  quickSearchStr: "",
  pageNum: 1,
  currentPage: 1,
  tabelTotal: 0,
  dialog: false,
});
const props = defineProps({
  storehouseList: {
    type: Object,
    default: "",
  },
  warehouseId: {
    type: String,
    default: "",
  },
  selectedList: {
    type: Array as () => any[],
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
  selcetedData: {
    type: Function,
    required: true,
  },
});
watch(
  () => props.dialog,
  () => {
    console.log(props.dialog);
    selectedInfo.dialog = props.dialog;
    selectedInfo.quickSearchStr = "";
    selectedInfo.sparePartTypeId = "";
    getSpareList();
  }
);
// 声明事件
onMounted(async () => {
  await getSpareType();
});
const multipleTableRef = ref();
// 切换页码
const switchPageNum = (val: any) => {
  selectedInfo.pageNum = val;
};
// 查询备件类型列表
const getSpareType = () => {
  api.article.getSpareType().then((res: any) => {
    console.log(res.data);
    console.log(toTree(res.data, "备件类别"));
    selectedInfo.spareType = toTree(res.data, "备件类别");
    console.log(selectedInfo.spareType);
  });
};
// 查询备件类型列表
const getSpareList = () => {
  api.article
    .getList({
      sparePartTypeId: selectedInfo.sparePartTypeId,
      quickSearchStr: selectedInfo.quickSearchStr,
      warehouseId: props.warehouseId,
      currentPage: selectedInfo.pageNum,
      pageSize: 10,
    })
    .then((res: any) => {
      console.log(res.data);
      selectedInfo.stockTable = res.data.list;
      selectedInfo.tabelTotal = res.data.pages.count;
      for (let i = 0; i < props.selectedList.length; i++) {
        selectedInfo.stockTable.forEach((e: any, index: number) => {
          if (props.selectedList[i].sparePartId == e.id) {
            multipleTableRef.value!.toggleRowSelection(
              selectedInfo.stockTable[index],
              true
            );
          }
        });
      }
    });
};
const selecedChange = (selection: any) => {
  console.log(selection);
  selectedInfo.selcetedData = selection;
};

const sureDialog = () => {
  selectedInfo.dialog = false;
  props.selcetedData(selectedInfo.selcetedData);
};
const onCancel = () => {
  props.colseDialog();
  selectedInfo.dialog = false;
};
</script>

<style lang="scss" scoped>
.stockTable {
  margin-top: 20px;
}
.userPagination {
  margin-top: 12px;
  text-align: right;
}
.InquireList {
  display: flex;
  align-items: center;
  .el-input {
    width: 200px;

    margin-right: 10px;
  }
  .el-select {
    width: 160px;
    margin: 0 10px;
  }
}
</style>
