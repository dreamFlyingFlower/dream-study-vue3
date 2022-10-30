<template>
  <div class="IndexWrap">
    <el-card shadow="hover">
      <div class="InquireWrap">
        <div class="InquireList">
          <el-input size="small" v-model="moduleData.quickSearchStr" placeholder="单位名称" clearable
            @keyup.enter="getList" />
          <el-button size="small" type="primary" @click="getList">查询</el-button>
        </div>
        <div>
          <el-button size="small" type="primary" @click="showDialog(1,{})">添加</el-button>
          <el-button size="small" type="danger" @click="removeDatas">删除</el-button>
          <!-- <el-button size="small" type="primary" @click="importExcel">导入</el-button> -->
          <!-- <el-button size="small" type="primary" @click="exportExcel">导出</el-button> -->
        </div>
      </div>
    </el-card>
    <el-table class="spareTable" :data="moduleData.tableDatas" ref="tableDatasRef" border fit highlight-current-row
      empty-text="暂无数据" style="width: 100%;font-size:10px" @selection-change="handleSelectionChange"
      :header-cell-style="{padding:'0px'}" :cell-style="{padding:'0px'}" :height="moduleData.theight">
      <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
      <el-table-column type="selection" width="45" align="center" />
      <el-table-column label="操作" min-width="80" align="center">
        <template v-slot:default="scope">
          <el-button type="text" size="small" @click="showDialog(2,scope.row)">详情</el-button>
          <!-- @click="openuserrDialog(scope.row, 1)"  @click="delRole(scope.row)"-->
          <el-button type="text" size="small" @click="removeData(scope.row.rowId)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="supplierName" label="单位名称" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="80" prop="contact" label="联系人" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="contactNumber" label="联系电话" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="email" label="Email" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="address" label="通讯地址" />
      <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="remark" label="备注" />
    </el-table>
    <el-pagination class="userPagination" small="small" layout="prev, pager, next" :total="moduleData.tabelTotal"
      @current-change="switchPageNum">
    </el-pagination>
  </div>
  <!-- 新增/修改 -->
  <Edit v-if="moduleData.editDialog" :show-dialog="moduleData.editDialog" :edit-type="moduleData.editType"
    :edit-data="moduleData.editData" @closeDialog="closeDialog" />
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ElTable } from 'element-plus'
import api from "../../../api/supplier";
import type { SupplierModule, SupplierEntity } from "../../../types/supplier";
import Edit from './edit.vue';

const moduleData = reactive<SupplierModule>({
  tableDatas: [],
  quickSearchStr: "",
  editDialog: false,
  editType: 0,
  editData: {},
  theight: 468,
  pageNum: 1,
  tabelTotal: 0,
});

// 表格ref
const tableDatasRef = ref<InstanceType<typeof ElTable>>();
// 点选表格前的勾选框操作
const multipleSelection = ref<SupplierEntity[]>([]);

// 切换页码
const switchPageNum = (val: any) => {
  moduleData.pageNum = val;
  getList();
};

onMounted(async () => {
  await getList();
  window.onresize = () => {
    setTableHeight();
  };
});

// 查询表格数据列表
const getList = () => {
  api.apis.getList({
    quickSearchStr: moduleData.quickSearchStr,
    currentPage: moduleData.pageNum,
    pageSize: 10,
  }).then((res: any) => {
    moduleData.tableDatas = res.data.list;
    moduleData.tabelTotal = res.data.pages.count;
    tableDatasRef.value!.setCurrentRow(res.data.list[0]);
    nextTick(() => { tableDatasRef.value!.toggleRowSelection(res.data.list[0], true); });
    moduleData.theight = window.innerHeight - 208;
  });
};

//表格高度计算
const setTableHeight = () => {
  moduleData.theight = window.innerHeight - 208;
};

// 显示新增/编辑弹窗
const showDialog = (editType: number, editData: object) => {
  moduleData.editDialog = true;
  moduleData.editType = editType;
  moduleData.editData = editData;
}

// 删除单条数据
const removeData = (rowId: number) => {
  ElMessageBox.confirm('此操作将永久删除该供应商,是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.apis.deleteById(rowId).then((res: any) => {
      getList();
    });
  }).catch(() => {
    ElMessage.info('已取消删除');
  })
};

// 点选表格前的勾选框操作
const handleSelectionChange = (val: SupplierEntity[]) => {
  multipleSelection.value = val;
}

// 批量删除数据
const removeDatas = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage("没有选择需要操作的数据");
    return;
  }
  ElMessageBox.confirm('此操作将永久删除该供应商,是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = reactive<Number[]>([]);
    multipleSelection.value.forEach(item => ids.push(item.rowId));
    api.apis.deleteByIds(ids).then(() => {
      getList();
    })
  }).catch(() => {
    ElMessage.info('已取消删除');
  })
}

// 关闭弹窗
const closeDialog = () => {
  getList();
  moduleData.editDialog = false;
};

// 导入Excel
const importExcel = () => {

}

// 导出Excel
const exportExcel = () => {

}
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