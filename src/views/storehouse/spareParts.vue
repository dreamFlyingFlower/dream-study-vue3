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
            v-model="stockInfo.consumeType"
            placeholder="类型"
          >
            <el-option label="维修" value="维修"> </el-option>
            <el-option label="保养" value="保养"> </el-option>
            <el-option label="工具" value="工具"> </el-option>
            <el-option label="其他" value="其他"> </el-option>
          </el-select>
          <el-select size="small" clearable v-model="stockInfo.status" placeholder="状态">
            <el-option label="待审核" value="1"> </el-option>
            <el-option label="待还回" value="2"> </el-option>
            <el-option label="已出库" value="3"> </el-option>
            <el-option label="已完成" value="4"> </el-option>
            <el-option label="还回异常" value="5"> </el-option>
            <el-option label="已驳回" value="6"> </el-option>
          </el-select>
          <el-button size="small" @click="getpartconsumeList('default')">查询</el-button>
        </div>
        <div>
          <el-button size="small" type="primary" @click="newAddSpare">添加申请</el-button>
          <el-button size="small" type="info" @click="getpartconsumeList">导出</el-button>
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
      <!-- <el-table-column label="" width="40" align="center">
        <template v-slot:default="scope">
          <el-checkbox
            @change="selecedChange(scope.$index)"
            v-model="scope.row.selected"
            size="large"
          ></el-checkbox>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" min-width="160" align="center">
        <template v-slot:default="scope">
          <el-button
            v-if="scope.row.status == '待审核'"
            type="text"
            size="small"
            @click="dealWith(scope.row, 0)"
            >审核</el-button
          >
          <el-button
            v-if="scope.row.status == '待审核'"
            type="text"
            size="small"
            @click="editSpare(scope.row)"
            >修改</el-button
          >
          <el-button
            v-if="scope.row.status == '待还回'"
            type="text"
            size="small"
            @click="dealWith(scope.row, 1)"
            >返还</el-button
          >
          <el-button type="text" size="small" @click="delSpareParts(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="100"
        prop="sparePartConsumeCode"
        label="领用单号"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="returnTime"
        label="预计还回时间"
      />
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
        prop="consumeType"
        label="领用类型"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="associatedCode"
        label="关联单号"
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
        prop="deviceCode"
        label="设备编号"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="deviceName"
        label="设备名称"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="departmentName"
        label="部门名称"
      />
      <!-- <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="providerName"
        label="单位"
      /> -->
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
        prop="createTime"
        label="创建时间"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="proposer"
        label="申请人"
      />
      <el-table-column
        :show-overflow-tooltip="true"
        align="center"
        min-width="80"
        prop="auditor"
        label="审核人"
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
    <el-tabs type="border-card" @tab-click="tabsChange">
      <el-tab-pane label="领用明细">
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
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="useCount"
            label="使用数量"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="futureReturnCount"
            label="待还回"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="returnCount"
            label="还回数量"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="referencePrice"
            label="参考价"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="applyReferencePrice"
            label="申请参考金额"
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
      <el-tab-pane label="领用记录">
        <el-table
          class="stockTable"
          :data="stockInfo.recordList"
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
            prop="changeWarehouseCode"
            label="出入库单号"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="140"
            prop="createTime"
            label="时间"
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
            prop="direction"
            label="方向"
          />
          <el-table-column
            :show-overflow-tooltip="true"
            align="center"
            min-width="80"
            prop="type"
            label="文档类型"
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
            prop="count"
            label="数量"
          />
        </el-table>
        <el-pagination
          class="userPagination"
          background
          layout="prev, pager, next"
          :total="stockInfo.recordTotal"
          @current-change="switchPageNum"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
  <NewApply
    :dialog="stockInfo.newAddDialog"
    :rowInfo="stockInfo.rowInfo"
    :dialogType="stockInfo.dialogType"
    :colseDialog="colseDialog"
  ></NewApply>
  <SpareDetails
    :auditInfo="stockInfo.detailsInfo"
    :dialog="stockInfo.detailsDialog"
    :dialogType="stockInfo.dialogType"
    :colseDialog="colseDialog"
  ></SpareDetails>
</template>

<script lang="ts" setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { reactive, ref, onMounted, nextTick } from "vue";
import api from "../../api/spareParts";
import NewApply from "./newApply.vue";
import SpareDetails from "./spareDetails.vue";
import { sparePartsType } from "../../types/spareParts";
import qs from "qs";
const stockInfo = reactive<sparePartsType>({
  stockTable: [],
  detailList: [],
  recordList: [],
  recordTotal: 0,
  selcetedIndex: 0,
  datePicker: "",
  consumeType: "",
  status: "",
  rowInfo: "",
  pageNum: 1,
  currentPage: 1,
  tabelTotal: 0,
  detailTotal: 0,
  detailPage: 0,
  newAddDialog: false,
  detailsDialog: false,
  detailsInfo: "",
  tabsIndex: "0",
  dialogType: 0,
  theight: 460,
});

const stockTableRef = ref();
onMounted(async () => {
  await getpartconsumeList("default");
  stockInfo.theight = window.innerHeight - 563;
  window.onresize = () => {
    setTableHeight();
  };
});
// 切换页码
const switchPageNum = (val: any) => {
  stockInfo.pageNum = val;
  getpartconsumeList();
};
//表格高度计算
const setTableHeight = () => {
  stockInfo.theight = window.innerHeight - 563;
  console.log(stockInfo.theight);
};
const selecedChange = (currentRow: any) => {
  console.log(currentRow);
  // stockInfo.stockTable.forEach((e: any, i: number) => {
  //   i == index ? (e.selected = true) : (e.selected = false);
  // });
  // stockInfo.selcetedIndex = index;
  if (currentRow) {
    stockInfo.stockTable.forEach((e: any, i: number) => {
      if (e.id == currentRow.id) {
        stockInfo.selcetedIndex = i;
      }
    });
    tabsChange({
      index: stockInfo.tabsIndex,
    });
  }
};
const tabsChange = (tabsInfo: any) => {
  console.log(tabsInfo.index);
  stockInfo.tabsIndex = tabsInfo.index;
  switch (tabsInfo.index) {
    case "0":
      getDetailList();
      break;
    case "1":
      getRecordDetails();
      break;

    default:
      break;
  }
};
// 查询备件领用列表
const getpartconsumeList = (defaultType: string = "") => {
  api.article
    .getpartconsume({
      beginCreatetime: stockInfo.datePicker ? stockInfo.datePicker[0] : "",
      endCreatetime: stockInfo.datePicker ? stockInfo.datePicker[1] : "",
      consumeType: stockInfo.consumeType,
      status: stockInfo.status,
      currentPage: stockInfo.pageNum,
      pageSize: 10,
    })
    .then((res: any) => {
      console.log(res);
      if (res) {
        stockInfo.stockTable = res.data.data.records;
        // stockInfo.selcetedIndex = 0;
        // stockInfo.stockTable.forEach((e: any, i: number) => {
        //   i == stockInfo.selcetedIndex ? (e.selected = true) : (e.selected = false);
        //   nextTick(() => {
        //     stockTableRef.value.setCurrentRow(stockInfo.stockTable[0], true);
        //   });
        // });
        if (defaultType == "default") {
          nextTick(() => {
            stockTableRef.value!.setCurrentRow(stockInfo.stockTable[0]);
          });
        }
        stockInfo.tabelTotal = res.data.data.total;
      }
    });
};
// 根据备件领用单id查询领用明细
const getDetailList = () => {
  api.article
    .getconsumedetails({
      sparePartConsumeId: stockInfo.stockTable[stockInfo.selcetedIndex].id,
      currentPage: stockInfo.detailPage,
      pageSize: 10,
    })
    .then((res: any) => {
      console.log(res.data);
      stockInfo.detailList = res.data.data.records;
      stockInfo.detailTotal = res.data.data.total;
    });
};
// 根据备件领用单单号查询领用记录
const getRecordDetails = () => {
  api.article
    .getrecorddetails({
      associatedCode: stockInfo.stockTable[stockInfo.selcetedIndex].sparePartConsumeCode,
      currentPage: stockInfo.detailPage,
      pageSize: 10,
    })
    .then((res: any) => {
      console.log(res.data);
      stockInfo.recordList = res.data.data.records;
      stockInfo.recordTotal = res.data.data.total;
    });
};
// 添加备件
const newAddSpare = () => {
  stockInfo.rowInfo = "";
  stockInfo.dialogType = 0;
  stockInfo.newAddDialog = true;
};
// 修改
const editSpare = (row: any) => {
  row.detailList = stockInfo.detailList;
  stockInfo.rowInfo = row;
  stockInfo.dialogType = 1;
  stockInfo.newAddDialog = true;
};
// 关闭弹窗
const colseDialog = () => {
  stockInfo.newAddDialog = false;
  stockInfo.detailsDialog = false;
  getpartconsumeList();
};
// 审核
const dealWith = (row: any, type: number) => {
  stockInfo.detailsInfo = row;
  stockInfo.dialogType = type;
  stockInfo.detailsDialog = true;
};
// 删除
const delSpareParts = (Id: number) => {
  ElMessageBox.confirm("确定要删除该领用申请吗？", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      api.article.delete(Id).then((res: any) => {
        if (res.data.code == 1) {
          ElMessage.success("删除成功！");
          getpartconsumeList("default");
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
    .el-button {
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
