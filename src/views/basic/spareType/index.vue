<template>
  <div class="IndexWrap">
    <div class="IndexLeft" :style="{height:moduleData.treeHeight,overflow:'auto'}">
      <!-- selectedItem没有使用,只是为了不报警 -->
      <TreeMenuId :treeData="moduleData.treeData" @handlerClick="handlerClick" />
    </div>
    <div class="IndexRight">
      <el-card shadow="hover">
        <div class="InquireWrap">
          <div class="InquireList">
            <el-input size="small" v-model="moduleData.typeName" placeholder="备件名称" @keyup.enter="getList" clearable />
            <el-button size="small" type="primary" @click="getList">查询</el-button>
          </div>
          <div>
            <el-button size="small" type="primary" @click="showDialog(1,{})">添加</el-button>
            <el-button size="small" type="danger" @click="removeDatas">删除</el-button>
          </div>
        </div>
      </el-card>
      <el-table class="spareTable" :data="moduleData.tableDatas" ref="tableDatasRef" empty-text="暂无数据"
        style="width: 100%;font-size:10px;" @selection-change="handleSelectionChange" :header-cell-style="{padding:0}"
        :cell-style="{padding:0}" :height="moduleData.theight" border fit highlight-current-row>
        <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column label="操作" min-width="80" align="center">
          <template v-slot:default="scope">
            <el-button type="text" size="small" @click="showDialog(2,scope.row)">详情</el-button>
            <el-button type="text" size="small" @click="removeData(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="id" label="备件类型编号" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="typeName" label="备件名称" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="parentId" label="上级类型编号">
          <template v-slot:default="scope">
            <span v-text="scope.row.parentId && scope.row.parentId !== '0' ? scope.row.parentId: '无'"></span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="parentName" label="上级类型名称">
          <template v-slot:default="scope">
            <span v-text="scope.row.parentName ? scope.row.parentName: '备件类型'"></span>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="remark" label="备注" />
      </el-table>
      <el-pagination class="userPagination" small="small" layout="prev, pager, next" :total="moduleData.tabelTotal"
        @current-change="switchPageNum">
      </el-pagination>
    </div>
  </div>
  <!-- 新增/修改 -->
  <Edit v-if="moduleData.editDialog" :show-dialog="moduleData.editDialog" :edit-type="moduleData.editType"
    :edit-data="moduleData.editData" :tree-data="moduleData.treeData" :tree-selected="moduleData.treeSelected"
    @closeDialog="closeDialog" />
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ElTable } from 'element-plus'
import { Tree } from '../../../types/tree';
import api from "../../../api/spareType";
import { toTreeIdUnchange } from "../../../utils/toTree";
import { resloveTreeId } from '../../../utils/simpleUtil';
import TreeMenuId from "../../../components/MenuTreeId.vue";
import Edit from './edit.vue';

const moduleData = reactive<any>({
  // 表格数据
  tableDatas: [],
  // 左边树形结构数据
  treeData: [],
  // 搜索类型名称
  typeName: "",
  // 是否显示编辑弹框
  editDialog: false,
  // 编辑类型.1->新增;2->修改
  editType: 0,
  // 修改的数据
  editData: {},
  // 树形结构当前选择id
  treeSelected: null,
  // 左边树形结构高度
  treeHeight: "475px",
  // 表格高度
  theight: 468,
  pageNum: 1,
  tabelTotal: 0,
});

// 表格ref
const tableDatasRef = ref<InstanceType<typeof ElTable>>();
// 点选表格前的勾选框操作
const multipleSelection = ref<any[]>([]);

// 切换页码
const switchPageNum = (val: any) => {
  moduleData.pageNum = val;
  getList();
};

onMounted(async () => {
  getTree();
  window.onresize = () => {
    setTableHeight();
  };
});

// 查询树形结构数据
const getTree = () => {
  api.article.getSpareType().then((res: any) => {
    moduleData.treeData = toTreeIdUnchange(res.data, "备件类型");
    moduleData.treeSelected = moduleData.treeData[0];
    getList();
  });
};

// 查询表格数据列表
const getList = () => {
  api.apis.getList({
    typeName: moduleData.typeName,
    id: moduleData.treeSelected ? resloveTreeId(moduleData.treeSelected) : null,
    currentPage: moduleData.pageNum,
    pageSize: 10,
  }).then((res: any) => {
    moduleData.tableDatas = res.data.list;
    moduleData.tabelTotal = res.data.pages.count;
    tableDatasRef.value!.setCurrentRow(res.data.list[0]);
    nextTick(() => { tableDatasRef.value!.toggleRowSelection(res.data.list[0], true); });
    moduleData.theight = window.innerHeight - 208;
    moduleData.treeHeight = (window.innerHeight - 80) + "px";
  });
};

//表格高度计算
const setTableHeight = () => {
  moduleData.theight = window.innerHeight - 208;
  moduleData.treeHeight = (window.innerHeight - 80) + "px";
};

// 显示新增/编辑弹窗
const showDialog = (editType: number, editData: object) => {
  moduleData.editDialog = true;
  moduleData.editType = editType;
  moduleData.editData = editData;
}

// 删除单条数据
const removeData = (rowId: number) => {
  ElMessageBox.confirm('此操作将永久删除该备件类型,是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.apis.deleteByIds([rowId]).then((res: any) => {
      getTree();
    });
  }).catch(() => {
    ElMessage.info('已取消删除');
  })
};

// 点选表格前的勾选框操作
const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val;
}

// 批量删除数据
const removeDatas = () => {
  if (multipleSelection.value.length === 0) {
    ElMessage("没有选择需要操作的数据");
    return;
  }
  ElMessageBox.confirm('此操作将永久删除该备件类型,是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = reactive<Number[]>([]);
    multipleSelection.value.forEach(item => ids.push(item.id));
    api.apis.deleteByIds(ids).then(() => {
      getTree();
    })
  }).catch(() => {
    ElMessage.info('已取消删除');
  })
}

// 点击树形结构叶子节点
const handlerClick = (node: Tree) => {
  moduleData.treeSelected = node;
  getList();
}

// 关闭弹窗
const closeDialog = () => {
  moduleData.editDialog = false;
  getTree();
};

const importExcel = () => {

}

const exportExcel = () => {

}
</script>

<style lang="scss" scoped>
.IndexWrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  .IndexLeft {
    min-width: 230px;
    height: 100%;
    box-sizing: border-box;
    padding: 5px;
    border: solid 1px #f5f5f5;
    // background-color: #f5f5f5;
  }
  .IndexRight {
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