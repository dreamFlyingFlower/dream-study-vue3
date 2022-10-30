<template>
  <div class="IndexWrap">
    <el-card shadow="hover">
      <div class="InquireWrap">
        <div class="InquireList">
          <el-date-picker
            size="small"
            v-model="stockInfo.datePicker"
            value-format="YYYY-MM-DD"
            type="daterange"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          >
          </el-date-picker>
          <el-select
            size="small"
            clearable
            v-model="stockInfo.warehouseId"
            placeholder="仓库"
          >
            <el-option
              v-for="(item, index) in stockInfo.warehouseList"
              :key="item.rowId"
              :label="item.warehouseName"
              :value="item.rowId"
            >
            </el-option>
          </el-select>
          <el-input
            size="small"
            v-model="stockInfo.blitemCode"
            placeholder="关联单号"
            clearable
          />
          <el-button size="small" @click="getBlitemList('default')">查询</el-button>
        </div>
        <div>
          <el-button size="small" type="primary" @click="newAddSpare"
            >添加盘点单</el-button
          >
          <el-button size="small" type="info" @click="getBlitemList">导出</el-button>
        </div>
      </div>
    </el-card>
    <el-table
      class="stockTable"
      ref="stockTableRef"
      :data="stockInfo.stockTable"
      border
      fit
      highlight-current-row
      empty-text="暂无数据"
      style="width: 100%; font-size: 10px"
      :cell-style="{ padding: '4px' }"
      :height="stockInfo.theight"
      @current-change="selecedChange"
    >
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        width="50"
        type="index"
        label="序号"
      />
      <el-table-column label="操作" min-width="80" align="center">
        <template v-slot:default="scope">
          <el-button type="text" size="small" @click="checkDetails(scope.row)"
            >详细</el-button
          >
          <el-button type="text" size="small" @click="delIncentorySpare(scope.row.rowId)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="status"
        label="状态"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="blitemCode"
        label="盘点单号"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="createTime"
        label="日期"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="warehouseName"
        label="仓库"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="operator"
        label="经办人"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="goods"
        label="盘盈货品"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="loss"
        label="盘亏货品"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="remark"
        label="备注"
      />
    </el-table>
    <el-pagination
      class="userPagination"
      small="small"
      layout="prev, pager, next"
      :total="stockInfo.tabelTotal"
      @current-change="switchPageNum"
    >
    </el-pagination>
    <el-tabs type="border-card">
      <el-tab-pane label="盘点明细">
        <el-table
          class="stockTable"
          :data="stockInfo.detailList"
          border
          fit
          highlight-current-row
          empty-text="暂无数据"
          style="width: 100%; font-size: 10px"
          :cell-style="{ padding: '2px' }"
          height="258"
        >
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            width="50"
            type="index"
            label="序号"
          />
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
            min-width="140"
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
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="actualCount"
            label="实际数量"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="overflowCount"
            label="盘盈数量"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="lossCount"
            label="盘亏数量"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="previousPositionalCode"
            label="原位置编码"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="newPositionalCode"
            label="当前位置编码"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="remark"
            label="备注"
          />
        </el-table>
        <el-pagination
          class="userPagination"
          small="small"
          layout="prev, pager, next"
          :total="stockInfo.detailTotal"
          @current-change="switchPageNum"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
  <InventoryInfoVue
    :dialogType="stockInfo.dialogType"
    :dictList="stockInfo.warehouseList"
    :rowInfo="stockInfo.rowInfo"
    :dialog="stockInfo.InventorySpareDialog"
    :colseDialog="colseDialog"
  ></InventoryInfoVue>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { reactive, ref, onMounted, nextTick } from "vue";
import api from "../../api/inventory";
import InventoryInfoVue from "./InventoryInfo.vue";
// import InventoryInfo from "./InventoryInfo.vue";
import { stockType } from "../../types/spareInventory";
const stockInfo = reactive<stockType>({
  stockTable: [],
  detailList: [],
  warehouseList: [],
  selcetedIndex: 0,
  datePicker: "",
  type: "",
  warehouseId: "",
  blitemCode: "",
  operator: "",
  pageNum: 1,
  currentPage: 1,
  tabelTotal: 0,
  detailTotal: 0,
  detailPage: 0,
  InventorySpareDialog: false,
  dialogType: 0,
  theight: 345,
  rowInfo: "",
});
const stockTableRef = ref();

onMounted(async () => {
  await getBlitemList("default");
  await getWarehouseList();
  stockInfo.theight = window.innerHeight - 563;
  window.onresize = () => {
    setTableHeight();
  };
});
// 切换页码
const switchPageNum = (val: any) => {
  stockInfo.pageNum = val;
  getBlitemList();
};
//表格高度计算
const setTableHeight = () => {
  stockInfo.theight = window.innerHeight - 563;
//   console.log(stockInfo.theight);
};

const selecedChange = (currentRow: any) => {
  console.log(currentRow);
  if (currentRow) {
    stockInfo.stockTable.forEach((e: any, i: number) => {
      if (e.rowId == currentRow.rowId) {
        stockInfo.selcetedIndex = i;
      }
    });
    getDetailList();
  }
};
// 查询盘点信息列表
const getBlitemList = (defaultType: string = "") => {
  api.article
    .getBlitem({
      startTime: stockInfo.datePicker ? stockInfo.datePicker[0] : "",
      endTime: stockInfo.datePicker ? stockInfo.datePicker[1] : "",
      warehouseId: stockInfo.warehouseId,
      blitemCode: stockInfo.blitemCode,
      currentPage: stockInfo.pageNum,
      pageSize: 10,
    })
    .then((res: any) => {
      console.log(res.data);
      stockInfo.stockTable = res.data.list;
      if (defaultType == "default") {
          nextTick(() => {
            stockTableRef.value!.setCurrentRow(
              stockInfo.stockTable[0]
            );
          });
        }
      stockInfo.tabelTotal = res.data.pages.count;
      getDetailList();
    });
};
// 查询盘点信息列表
const getDetailList = () => {
  api.article
    .getDetail(stockInfo.stockTable[stockInfo.selcetedIndex].rowId, {
      currentPage: stockInfo.detailPage,
      pageSize: 10,
    })
    .then((res: any) => {
      console.log(res.data);
      stockInfo.detailList = res.data.list;
      stockInfo.detailTotal = res.data.pages.count;
    });
};
// 查询仓库列表
const getWarehouseList = () => {
  api.article.getWarehouse({}).then((res: any) => {
    console.log(res.data);
    stockInfo.warehouseList = res.data;
  });
};
// 删除
const delIncentorySpare = (Id: number) => {
  console.log(Id);
  ElMessageBox.confirm("确定要删除该盘点单吗？", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      api.article.delete([Id]).then((res: any) => {
        ElMessage.success("删除成功！");
        getBlitemList();
        // if (res.data.code == 1) {
        //   ElMessage.success("删除成功！");
        //   getDetailList();
        // }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
// 添加备件
const newAddSpare = () => {
  stockInfo.dialogType = 0;
  stockInfo.rowInfo = "";
  stockInfo.InventorySpareDialog = true;
};
// 查看详情
const checkDetails = (row: any) => {
  row.detailList = stockInfo.detailList;
  stockInfo.rowInfo = row;
  stockInfo.dialogType = 1;
  stockInfo.InventorySpareDialog = true;
};

// 关闭弹窗
const colseDialog = () => {
  stockInfo.InventorySpareDialog = false;
  getBlitemList();
};
</script>

<style lang="scss" scoped>
.IndexWrap {
  width: 100%;
  height: 100%;
}
.InquireWrap {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .InquireList {
    display: flex;
    align-items: center;
    .el-input {
      width: 100px;
      margin: 0 10px;
    }
    .el-select {
      width: 120px;
      margin-left: 10px;
    }
  }
}

.el-tabs {
  margin-top: 12px;
}
.stockTable {
  margin-top: 12px;
}
.userPagination {
  margin-top: 12px;
  text-align: right;
}
.detailsTable {
  margin-top: 2px;
}
</style>
