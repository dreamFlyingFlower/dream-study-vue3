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
          <el-select size="small" clearable v-model="stockInfo.type" placeholder="类型">
            <el-option label="领用出库" value="领用出库"> </el-option>
            <el-option label="盘点出库" value="盘点出库"> </el-option>
          </el-select>
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
            v-model="stockInfo.changeWarehouseCode"
            placeholder="单号"
            clearable
          />
          <el-input
            size="small"
            v-model="stockInfo.operator"
            placeholder="经办人"
            clearable
          />
          <el-button size="small" @click="getOutputwarehouseList('default')"
            >查询</el-button
          >
        </div>
        <div>
          <el-button size="small" type="primary" @click="newAddSpare">添加出库</el-button>
          <!-- <el-button size="small" type="info" @click="getOutputwarehouseList"
            >导出</el-button
          > -->
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
          <el-button type="text" size="small" @click.stop="outStockDetails(scope.row)"
            >详细</el-button
          >
            <el-button type="text" size="small" @click.stop="editOutStock(scope.row)"
            >修改</el-button
          >
          <el-button type="text" size="small" @click.stop="delOutStock(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="changeWarehouseCode"
        label="出库单号"
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
        prop="type"
        label="类型"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="departmentName"
        label="部门"
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
        prop="associatedCode"
        label="单号"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="remark"
        label="备注"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="creator"
        label="记录人"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="createTime"
        label="记录时间"
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
      <el-tab-pane label="出库明细">
        <el-table
          class="stockTable"
          :data="stockInfo.detailList"
          border
          fit
          highlight-current-row
          empty-text="暂无数据"
          style="width: 100%; font-size: 10px"
          :cell-style="{ padding: '2px' }"
          height="253"
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
            prop="measuringUnit"
            label="计量单位"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="count"
            label="数量"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="actualPrice"
            label="单价"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="totalPrice"
            label="金额"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="positionalCode"
            label="位置码"
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
  <AddOutStock
    :dialog="stockInfo.outStockDialog"
    :colseDialog="colseDialog"
    :dialogType="stockInfo.dialogType"
    :dictList="stockInfo.warehouseList"
    :rowInfo="stockInfo.rowInfo"
  ></AddOutStock>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { reactive, ref, onMounted, nextTick } from "vue";
import api from "../../api/storehouse";
import AddOutStock from "./addOutStock.vue";
import { outStockTyoe } from "../../types/storehouse";
import qs from "qs";
const stockInfo = reactive<outStockTyoe>({
  stockTable: [],
  detailList: [],
  warehouseList: [],
  selcetedIndex: 0,
  datePicker: "",
  type: "",
  warehouseId: "",
  changeWarehouseCode: "",
  operator: "",
  pageNum: 1,
  currentPage: 1,
  tabelTotal: 0,
  detailTotal: 0,
  detailPage: 0,
  outStockDialog: false,
  dialogType: 0,
  theight: 333,
  rowInfo: "",
});
const stockTableRef = ref();
onMounted(async () => {
  await getWarehouseList();
  await getOutputwarehouseList('default');
  stockInfo.theight = window.innerHeight - 559;
  window.onresize = () => {
    setTableHeight();
  };
});
// 切换页码
const switchPageNum = (val: any) => {
  stockInfo.pageNum = val;
  getOutputwarehouseList();
};
//表格高度计算
const setTableHeight = () => {
  stockInfo.theight = window.innerHeight - 559;
  console.log(stockInfo.theight);
};
// 查询仓库列表
const getWarehouseList = () => {
  api.article.getWarehouse({}).then((res: any) => {
    console.log(res.data);
    stockInfo.warehouseList = res.data;
  });
};
const selecedChange = (currentRow: any) => {
  // stockInfo.stockTable.forEach((e: any, i: number) => {
  //   i == index ? (e.selected = true) : (e.selected = false);
  // });
  // stockInfo.selcetedIndex = index;
  // getDetailList();
  if (currentRow) {
    stockInfo.stockTable.forEach((e: any, i: number) => {
      if (e.id == currentRow.id) {
        stockInfo.selcetedIndex = i;
      }
    });
    getDetailList();
  }
};

// 查询出库信息列表
const getOutputwarehouseList = (defaultType: string = "") => {
  api.article
    .getOutputwarehouse({
      beginTime: stockInfo.datePicker ? stockInfo.datePicker[0] : "",
      endTime: stockInfo.datePicker ? stockInfo.datePicker[1] : "",
      type: stockInfo.type,
      warehouseId: stockInfo.warehouseId,
      changeWarehouseCode: stockInfo.changeWarehouseCode,
      operator: stockInfo.operator,
      currentPage: stockInfo.pageNum,
      pageSize: 10,
    })
    .then((res: any) => {
      console.log(res.data);
      stockInfo.stockTable = res.data.list;
      stockInfo.tabelTotal = res.data.pages.count;
      // stockInfo.stockTable.forEach((e: any, i: number) => {
      //   i == stockInfo.selcetedIndex ? (e.selected = true) : (e.selected = false);
      //    nextTick(() => {
      //     stockTableRef.value.setCurrentRow(res.data.list[0],true);
      //   });
      // });
      // getDetailList();
      if (defaultType == "default") {
        nextTick(() => {
          stockTableRef.value!.setCurrentRow(stockInfo.stockTable[0]);
        });
      }
      stockInfo.tabelTotal = res.data.pages.count;
    });
};
// 查询出库信息列表
const getDetailList = () => {
  api.article
    .getDetail({
      changeWarehouseId: stockInfo.stockTable[stockInfo.selcetedIndex].id,
      warehouseId: stockInfo.warehouseId,
      changeWarehouseCode: stockInfo.changeWarehouseCode,
      operator: stockInfo.operator,
      currentPage: stockInfo.detailPage,
      pageSize: 10,
    })
    .then((res: any) => {
      console.log(res.data);
      stockInfo.detailList = res.data.list;
      stockInfo.detailTotal = res.data.pages.count;
    });
};

// 添加出库
const newAddSpare = () => {
  stockInfo.dialogType = 0;
  stockInfo.rowInfo = "";
  stockInfo.outStockDialog = true;
};
// 关闭弹窗
const colseDialog = () => {
  stockInfo.outStockDialog = false;
  getOutputwarehouseList();
};
// 详情
const outStockDetails = (row: any) => {
  row.detailList = stockInfo.detailList;
  stockInfo.rowInfo = row;
  stockInfo.dialogType = 1;
  stockInfo.outStockDialog = true;
};
// 修改
const editOutStock = (row: any) => {
  row.detailList = stockInfo.detailList;
  stockInfo.rowInfo = row;
  stockInfo.dialogType = 2;
  stockInfo.outStockDialog = true;
};
// 删除
const delOutStock = (Id: number) => {
  ElMessageBox.confirm("确定要删除该单据吗？", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      api.article.delete(Id).then((res: any) => {
        if (res.data.code == 1) {
          ElMessage.success("删除成功！");
          getOutputwarehouseList();
        }
      });
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
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
