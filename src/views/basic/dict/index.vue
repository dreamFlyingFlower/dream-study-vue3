<template>
  <div class="container-wrap">
    <div class="container-right">
      <el-card shadow="hover">
        <div class="InquireWrap">
          <div class="InquireList">
            <el-input size="small" v-model="moduleData.dictCode" placeholder="分类编码" @keyup.enter="getList" clearable />
            <el-input size="small" v-model="moduleData.dictName" placeholder="分类名称" @keyup.enter="getList" clearable />
            <el-button size="small" type="primary" @click="getList">查询</el-button>
          </div>
          <div>
            <el-button size="small" type="primary" @click="showDialog(1,{})">添加</el-button>
            <el-button size="small" type="danger" @click="removeDatas">删除</el-button>
          </div>
        </div>
      </el-card>
      <el-table class="spareTable" :data="moduleData.tableDatas" ref="tableDatasRef" empty-text="暂无数据"
        @selection-change="handleSelectionChange" @row-click="handlerRowClick" style="width: 100%;font-size:10px"
        :header-cell-style="{ padding : 0}" :cell-style="{ padding : 0}" :height="moduleData.theight" border fit
        highlight-current-row>
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column label="操作" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-button type="text" size="small" @click="showDialog(2,scope.row)">详情</el-button>
            <el-button type="text" size="small" @click="removeData(scope.row.rowId)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="dictCode" label="分类编码" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="dictName" label="分类名称" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="dictType" label="分类类型">
          <template v-slot:default="scope">
            <span v-text="scope.row.dictType && scope.row.dictType === '1' ? '系统字典': '业务字典'"></span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="userPagination" small="small" layout="prev, pager, next" :total="moduleData.tabelTotal"
        @current-change="switchPageNum">
      </el-pagination>
    </div>

    <div class="container-right">
      <el-card shadow="hover">
        <div class="InquireWrap">
          <div style="float:right">
            <el-button size="small" type="primary" @click="showDetailDialog(1,{})">添加</el-button>
            <el-button size="small" type="danger" @click="removeDetailDatas">删除</el-button>
          </div>
        </div>
      </el-card>
      <el-table class="spareTable" :data="moduleData.tableDetailDatas" ref="tableDetailDatasRef" empty-text="暂无数据"
        @selection-change="handleDetailSelectionChange" style="width: 100%;font-size:10px"
        :header-cell-style="{ padding : 0}" :cell-style="{ padding : 0}" :height="moduleData.theight" border fit
        highlight-current-row>
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column label="操作" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-button type="text" size="small" @click="showDetailDialog(2,scope.row)">详情</el-button>
            <el-button type="text" size="small" @click="removeDetailData(scope.row.rowId)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="dictItemKey" label="字典编码" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="dictItemValue"
          label="字典名称" />
      </el-table>
      <el-pagination class="userPagination" small="small" layout="prev, pager, next"
        :total="moduleData.tabelDetailTotal" @current-change="switchDetailPageNum">
      </el-pagination>
    </div>
  </div>

  <!-- 新增/修改 -->
  <Edit v-if="moduleData.editDialog" :show-dialog="moduleData.editDialog" :edit-type="moduleData.editType"
    :edit-data="moduleData.editData" @closeDialog="closeDialog" />

  <!-- 详情新增/修改 -->
  <EditDetail v-if="moduleData.editDetailDialog" :show-dialog="moduleData.editDetailDialog"
    :edit-type="moduleData.editDetailType" :edit-data="moduleData.editDetailData"
    :parent-data="moduleData.tableSelectRow" @closeDialog="closeDetailDialog" />
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ElTable } from 'element-plus'
import api from "../../../api/dict";
import apiItem from '../../../api/dictItem';
import { Tree } from '../../../types/tree';
import Edit from './edit.vue';
import EditDetail from './editDetail.vue';

// 页面数据
const moduleData = reactive<any>({
  tableDatas: [],
  tableDetailDatas: [],
  editDialog: false,
  editDetailDialog: false,
  editType: 0,
  editDetailType: 0,
  editData: {},
  editDetailData: {},
  theight: 468,
  dictCode: null,
  dictName: null,
  tableSelectRow: {},
  pageNum: 1,
  pageDetailNum: 1,
  tabelTotal: 0,
  tabelDetailTotal: 0
});

// 表格ref
const tableDatasRef = ref<InstanceType<typeof ElTable>>();
// 表格详情ref
const tableDetailDatasRef = ref<InstanceType<typeof ElTable>>();
// 点选表格前的勾选框操作
const multipleSelection = ref<any[]>([]);
// 点选表格详情前的勾选操作
const multipleDetailSelection = ref<any[]>([]);

// 切换页码
const switchPageNum = (val: any) => {
  moduleData.pageNum = val;
  getList();
};

// 切换页码
const switchDetailPageNum = (val: any) => {
  moduleData.pageDetailNum = val;
  getDetailList();
};

onMounted(async () => {
  await getList();
  window.onresize = () => {
    setTableHeight();
  };
});

//表格高度计算
const setTableHeight = () => {
  moduleData.theight = window.innerHeight - 208;
};

// 查询表格数据列表
const getList = async () => {
  api.apis.getList({
    dictCode: moduleData.dictCode,
    dictName: moduleData.dictName,
    currentPage: moduleData.pageNum,
    pageSize: 10,
  }).then((res: any) => {
    moduleData.tableDatas = res.data.list;
    moduleData.tabelTotal = res.data.pages.count;
    moduleData.tableSelectRow = res.data.list[0];
    tableDatasRef.value!.setCurrentRow(res.data.list[0]);
    nextTick(() => { tableDatasRef.value!.toggleRowSelection(res.data.list[0], true); });
    getDetailList();
    moduleData.theight = window.innerHeight - 208;
  });
};

// 查询表格数据列表
const getDetailList = async () => {
  if (!moduleData.tableSelectRow || Object.keys(moduleData.tableSelectRow).length === 0) {
    return;
  }
  apiItem.apis.getList({
    dictCode: moduleData.tableSelectRow.dictCode,
    currentPage: moduleData.pageDetailNum,
    pageSize: 10,
  }).then((res: any) => {
    moduleData.tableDetailDatas = res.data.list;
    moduleData.tabelDetailTotal = res.data.pages.count;
    tableDetailDatasRef.value!.setCurrentRow(res.data.list[0]);
    nextTick(() => { tableDetailDatasRef.value!.toggleRowSelection(res.data.list[0], true); });
    moduleData.theight = window.innerHeight - 208;
  });
};

// 显示新增/编辑弹窗
const showDialog = (editType: number, editData: object) => {
  moduleData.editDialog = true;
  moduleData.editType = editType;
  moduleData.editData = editData;
}

// 显示详情新增/编辑弹窗
const showDetailDialog = (editType: number, editData: object) => {
  if (!moduleData.tableSelectRow || Object.keys(moduleData.tableSelectRow).length === 0) {
    ElMessage("请选择需要操作的数据");
    return;
  }
  moduleData.editDetailDialog = true;
  moduleData.editDetailType = editType;
  moduleData.editDetailData = editData;
}

// 点击表格多选框操作
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val;
}

// 点击表格详情多选框操作
const handleDetailSelectionChange = (val: any[]) => {
  multipleDetailSelection.value = val;
}

// 删除单条数据
const removeData = (id: number) => {
  ElMessageBox.confirm('此操作将永久删除该设备类型,是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.apis.deleteById(id).then(() => {
      getList();
    });
  }).catch(() => {
    ElMessage.info('已取消删除');
  })
};

// 批量删除数据
const removeDatas = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage("没有选择需要操作的数据");
    return;
  }
  ElMessageBox.confirm('此操作将永久删除该设备类型,是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = reactive<number[]>([]);
    multipleSelection.value.forEach(item => ids.push(item.rowId));
    api.apis.deleteByIds(ids).then(() => {
      getList();
    })
  }).catch(() => {
    ElMessage.info('已取消删除');
  })
}

// 删除单条详情数据
const removeDetailData = (id: number) => {
  ElMessageBox.confirm('此操作将永久删除该字典详情,是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    apiItem.apis.deleteById(id).then((res: any) => {
      getDetailList();
    });
  }).catch(() => {
    ElMessage.info('已取消删除');
  })
};

// 批量删除详情数据
const removeDetailDatas = () => {
  if (multipleDetailSelection.value.length === 0) {
    ElMessage("没有选择需要操作的数据");
    return;
  }
  ElMessageBox.confirm('此操作将永久删除该字典详情,是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = reactive<Number[]>([]);
    multipleDetailSelection.value.forEach(item => ids.push(item.rowId));
    apiItem.apis.deleteByIds(ids).then(() => {
      getDetailList();
    })
  }).catch(() => {
    ElMessage.info('已取消删除');
  })
}

// 当前选中数据
const handlerRowClick = (row: any, column: any, event: any) => {
  moduleData.tableSelectRow = row;
  getDetailList();
}

// 关闭弹窗
const closeDialog = () => {
  moduleData.editDialog = false;
  getList();
};

// 关闭弹窗
const closeDetailDialog = () => {
  moduleData.editDetailDialog = false;
  getDetailList();
};
</script>

<style lang="scss" scoped>
.container-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  .container-right {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 5px 10px;
    overflow-x: auto;
  }
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
.spareTable {
  margin-top: 12px;
}
.userPagination {
  margin-top: 12px;
  text-align: right;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>