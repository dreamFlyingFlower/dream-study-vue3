<template>
  <div class="IndexWrap">
    <div class="IndexRight">
      <el-card shadow="hover">
        <div class="InquireWrap">
          <div class="InquireList">
            <!-- <el-input size="small" v-model="moduleData.useDept" placeholder="使用部门" @keyup.enter="getList" clearable /> -->
            <el-input size="small" v-model="moduleData.quickSearchStr" placeholder="设备名,设备编码" @keyup.enter="getList"
              clearable />
            <el-button size="small" type="primary" @click="getList">查询</el-button>
          </div>
          <div>
            <el-button size="small" type="primary" @click="showDialog(1, {})">快速工单</el-button>
            <el-button size="small" type="danger" @click="removeDatas">删除</el-button>
          </div>
        </div>
      </el-card>
      <el-table class="spareTable" ref="tableDatasRef" :data="moduleData.tableDatas" empty-text="暂无数据"
        @selection-change="handlerSelectionChange" @row-click="handlerRowClick"
        style="width: 100%;min-height:120px;font-size:10px" :header-cell-style="{ padding : 0}"
        :cell-style="{ padding : 0}" :height="moduleData.theight" border fit highlight-current-row>
        <el-table-column :show-overflow-tooltip="true" align="center" width="50" type="index" label="序号" />
        <el-table-column type="selection" width="45" align="center" />
        <el-table-column label="执行" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-button type="text" size="small" @click="showDialog(2, scope.row)">执行保养</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="80" prop="id" label="保养单号" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="upkeepStatue" label="保养状态">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="deviceCode" label="设备编号" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="deviceName" label="设备名称" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="upkeepPlanId"
          label="计划序号" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="modelNumber" label="规格型号" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="departmentName"
          label="使用部门" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="planStartTime"
          label="保养开始时间" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="planEndTime"
          label="保养完成时间" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="upkeepSpendTime"
          label="保养用时" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="upkeepCost" label="保养费用" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="upkeepCost" label="备件费用" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="100" prop="applicantName" label="保养人员" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="orderDescribe" label="保养信息" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="lifetime" label="验证人" />
      </el-table>
      <el-pagination class="userPagination" small="small" layout="prev, pager, next" :total="moduleData.tabelTotal"
        @current-change="switchPageNum"></el-pagination>
    </div>
  </div>
  <!-- 新增/修改供应商 -->
  <Edit v-if="moduleData.editDialog" :show-dialog="moduleData.editDialog" :edit-type="moduleData.editType"
    :edit-data="moduleData.editData" :treeData="moduleData.treeData" :tree-selected="moduleData.treeSelected"
    :suppliers="moduleData.suppliers" @closeDialog="closeDialog" />

  <el-tabs type="border-card">
    <el-tab-pane label="保养记录">
      <TabRecord :select-devices="moduleData.tableSelects" :select-device="moduleData.tableSelectRow"
        :suppliers="moduleData.suppliers" />
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ElTable } from 'element-plus'
import type { DeviceEntity } from "../../../types/device";
import { Tree } from '../../../types/tree';
import api from "../../../api/upkeepOrder";
import apiDeviceType from "../../../api/deviceType";
import apiDict from '../../../api/dict';
import apiSupplier from '../../../api/supplier';
import { toTreeCodeUnchange } from "../../../utils/toTree";
import { transDictValue, resloveTree } from '../../../utils/simpleUtil';
import Edit from './edit.vue';
import TabRecord from './tabRecord.vue'

// 页面数据
const moduleData = reactive<any>({
  // 表格数据
  tableDatas: [],
  // 表格复选框选中数据
  tableSelects: [],
  // 表格单选当前选中数据
  tableSelectRow: null,
  // 设备类型列表
  deviceTypes: [],
  // 树形结构数据
  treeData: [],
  // 是否打开新增/编辑界面
  editDialog: false,
  // 新增或编辑:1新增,2编辑
  editType: 0,
  // 需要编辑的数据
  editData: {},
  // 查看设备名称或设备编码
  quickSearchStr: [],
  // 供应商列表
  suppliers: [],
  // 左边树形结构当前选中数据
  treeSelected: null,
  // 设备类型
  typeCode: null,
  // 使用部门
  useDept: null,
  theight: 468,
  pageNum: 1,
  tabelTotal: 0
});

const tableDatasRef = ref<InstanceType<typeof ElTable>>();

// 初始化操作 -------- start
onMounted(async () => {
  // await getDictCategory();
  await getDictDeviceState();
  await getDeviceType();
  getSupplier();
  window.onresize = () => {
    setTableHeight();
  }
});

// 切换页码
const switchPageNum = (val: any) => {
  moduleData.pageNum = val;
  getList();
};

// 获得设备状态
const getDictDeviceState = (): void => {
  apiDict.apis.getItemsByCode({ "dictCode": "dt_device_state" }).then((res: any) => {
    moduleData.deviceStates = res.data;
  });
}

// 获得设备类型列表
const getDeviceType = (): void => {
  apiDeviceType.apis.getList({}).then((res: any) => {
    moduleData.deviceTypes = res.data;
    moduleData.treeData = toTreeCodeUnchange(res.data, "设备类型");
    moduleData.treeSelected = moduleData.treeData[0];
    moduleData.typeCode = resloveTree(moduleData.treeSelected);
    getList();
  });
}

// 查询设备列表
const getList = (): void => {
  api.apis.getList({
    typeCode: moduleData.typeCode,
    useDept: moduleData.useDept,
    currentPage: moduleData.pageNum,
    pageSize: 10,
  }).then((res: any) => {
    moduleData.tableDatas = res.data.list;
    moduleData.tabelTotal = res.data.pages.count;
    tableDatasRef.value!.setCurrentRow(res.data.list[0]);
    nextTick(() => tableDatasRef.value!.toggleRowSelection(res.data.list[0], true));
    moduleData.tableSelectRow = res.data.list[0];
    moduleData.theight = window.innerHeight - 440;
  });
};

// 获得供应商列表
const getSupplier = (): void => {
  apiSupplier.apis.getEntitys({}).then((res: any) => {
    moduleData.suppliers = res.data;
  });
}

//表格高度计算
const setTableHeight = () => {
  moduleData.theight = window.innerHeight - 440;
};
// 初始化操作 -------- end

// 左边树形结构点击操作 ----- start
// 点击树形结构叶子节点
const handlerClick = (node: Tree) => {
  moduleData.treeSelected = node;
  moduleData.typeCode = resloveTree(node);
  getList();
}
// 左边树形结构点击操作 ----- end

// 头部菜单栏操作 -------- start
// 添加编辑数据
const showDialog = (editType: number, editData: object) => {
  moduleData.editDialog = true;
  moduleData.editType = editType;
  moduleData.editData = editData;
}

// 删除单条数据
const removeData = (rowId: number) => {
  ElMessageBox.confirm('此操作将永久删除该设备,是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    api.apis.deleteById(rowId).then(() => {
      getList();
    });
  }).catch(() => {
    ElMessage.info('已取消删除');
  })
};

// 点选表格前的勾选框操作
const multiselects = ref<DeviceEntity[]>([]);
const handlerSelectionChange = (val: DeviceEntity[]) => {
  multiselects.value = val;
  moduleData.tableSelects = val;
}

// 批量删除数据
const removeDatas = () => {
  if (multiselects.value.length === 0) {
    ElMessage("没有选择需要操作的数据");
    return;
  }
  ElMessageBox.confirm('此操作将永久删除该设备,是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const ids = reactive<Number[]>([]);
    multiselects.value.forEach((item: any) => ids.push(item.rowId));
    api.apis.deleteByIds(ids).then(() => {
      getList();
    })
  }).catch(() => {
    ElMessage.info('已取消删除');
  })
}

// 当前选中数据
const handlerRowClick = (row: any, column: any, event: any) => {
  moduleData.tableSelectRow = row;
}

// 更新计划状态
const changeStatus = (row: any) => {
  if (row.planStatue === '1') {
    api.apis.enable(row.id);
  } else {
    api.apis.disable(row.id);
  }
}
// 头部菜单栏操作 -------- end

// 关闭弹窗
const closeDialog = () => {
  moduleData.editDialog = false;
  getList();
};
</script>

<style lang="scss">
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

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>