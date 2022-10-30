<template>
  <div class="IndexWrap">
    <div class="IndexLeft" :style="{height:moduleData.treeHeight,overflow:'auto'}">
      <MenuTreeCode :treeData="moduleData.treeData" @handlerClick="handlerClick" />
    </div>
    <div class="IndexRight">
      <el-card shadow="hover">
        <div class="InquireWrap">
          <div class="InquireList">
            <el-input size="small" v-model="moduleData.useDept" placeholder="使用部门" @keyup.enter="getList" clearable />
            <el-input size="small" v-model="moduleData.slowSearch" placeholder="设备名称,编码" @keyup.enter="getList"
              clearable />
            <el-button size="small" type="primary" @click="getList">查询</el-button>
          </div>
          <div>
            <el-button size="small" type="primary" @click="showDialog(1, {})">添加</el-button>
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
        <el-table-column label="操作" min-width="100" align="center">
          <template v-slot:default="scope">
            <el-button type="text" size="small" @click="showDialog(2, scope.row)">详情</el-button>
            <el-button type="text" size="small" @click="removeData(scope.row.rowId)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="deviceName" label="设备名称" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="deviceCode" label="设备编码" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="typeName" label="设备类型">
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="modelNumber" label="设备型号" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="manufacturersName"
          label="厂家" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="supplierName" label="供应商" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="lifetime" label="使用寿命" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="buyDate" label="购买时间" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="originalValue"
          label="资产原值" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="assetNetWorth"
          label="资产净值" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="assetCode" label="资产编号" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="assetManager"
          label="资产负责人" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="useDept" label="使用部门" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="address" label="设备地点" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="state_CN" label="使用状况" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="startUseDate"
          label="启用时间" />
        <!-- <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="maintainGroup"
          label="维修班组" /> -->
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="requireCheckTime"
          label="要求验收时间" />
        <el-table-column :show-overflow-tooltip="true" align="center" min-width="120" prop="remark" label="备注" />
      </el-table>
      <el-pagination class="userPagination" small="small" layout="prev, pager, next" :total="moduleData.tabelTotal"
        @current-change="switchPageNum"></el-pagination>

      <!-- <div class="table-container"> -->
      <el-tabs type="border-card">
        <el-tab-pane label="备件更换记录">
          <!-- <imgUpload ref="tab1" titleText="维修单号" v-if="item.prop==='sbtp'" :categoryData="dt_img_equipment" :functionCode="deviceCodeA"></imgUpload> -->
          <!-- <fileUpload ref="tab2" titleText="维修单号" :categoryData="dt_file_equipment" v-if="item.prop==='sbfj'" :functionCode="deviceCodeA"></fileUpload> -->
          <!-- <tab3 ref="tab3" :deviceCode='deviceCodeA' :typeCode="typeCodeA" :selectlist='selectlistRowA'
              v-if="item.prop==='bjqd'"></tab3>
            <tab4 ref="tab4" :deviceCode='deviceCodeA' :cDeviceCode="deviceCodeA" :selectlist='selectlistRowA'
              :typeCode='typeCodeA' v-if="item.prop==='glzsb'"></tab4>
            <tab5 ref="tab5" :deviceCode='deviceCodeA' v-if="item.prop==='sbll'"></tab5>-->
          备件更换记录
        </el-tab-pane>
        <el-tab-pane label="关联备件">
          <TabSpare :select-devices="moduleData.tableSelects" :select-device="moduleData.tableSelectRow"
            :suppliers="moduleData.suppliers" />
        </el-tab-pane>
        <el-tab-pane label="关联附件">
          <TabFile :select-devices="moduleData.tableSelects" :select-device="moduleData.tableSelectRow"
            @resetDeviceList="getList" />
        </el-tab-pane>
      </el-tabs>
      <!-- </div> -->
    </div>
  </div>
  <!-- 新增/修改供应商 -->
  <Edit v-if="moduleData.editDialog" :show-dialog="moduleData.editDialog" :edit-type="moduleData.editType"
    :edit-data="moduleData.editData" :treeData="moduleData.treeData" :tree-selected="moduleData.treeSelected"
    :suppliers="moduleData.suppliers" :device-states="moduleData.deviceStates" @closeDialog="closeDialog" />
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { ElTable } from 'element-plus'
import type { DeviceModule, DeviceEntity } from "../../../types/device";
import { Tree } from '../../../types/tree';
import api from "../../../api/device";
import apiDeviceType from "../../../api/deviceType";
import apiDict from '../../../api/dict';
import apiSupplier from '../../../api/supplier';
import { toTreeCodeUnchange } from "../../../utils/toTree";
import { transDictValue, resloveTree } from '../../../utils/simpleUtil';
import MenuTreeCode from "../../../components/MenuTreeCode.vue";
import Edit from './edit.vue';
import TabSpare from './tabSpare.vue';
import TabFile from './tabFile.vue';

// 页面数据
const moduleData = reactive<DeviceModule>({
  tableDatas: [],
  tableSelects: [],
  tableSelectRow: null,
  deviceTypes: [],
  treeData: [],
  editDialog: false,
  editType: 0,
  editData: {},
  deviceStates: [],
  suppliers: [],
  treeSelected: null,
  typeCode: null,
  useDept: null,
  slowSearch: "",
  tabName: "",
  treeHeight: "475px",
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

// 获得设备分类
// const getDictCategory = () => {
//   apiDict.apis.getItemsByCode({ "dictCode": "dt_device_category" }).then((res: any) => {
//     moduleData.deviceCategorys = res.data;
//   });
// }

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
    slowSearch: moduleData.slowSearch,
    currentPage: moduleData.pageNum,
    pageSize: 10,
  }).then((res: any) => {
    moduleData.tableDatas = res.data.list;
    moduleData.tabelTotal = res.data.pages.count;
    transDictValue(res.data.list, [moduleData.deviceStates], ['state']);
    tableDatasRef.value!.setCurrentRow(res.data.list[0]);
    nextTick(() => tableDatasRef.value!.toggleRowSelection(res.data.list[0], true));
    moduleData.tableSelectRow = res.data.list[0];
    moduleData.theight = window.innerHeight - 440;
    moduleData.treeHeight = (window.innerHeight - 80) + "px";
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
  moduleData.treeHeight = (window.innerHeight - 80) + "px";
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

const handlerCurrentRow = () => {

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
// 不要撑开table高度
// .el-table .el-table__cell {
//   padding: 0 0;
// }

.table-container >>> .left_col {
  border-left: solid 1px #d3dae0;
  border-right: solid 1px #d3dae0;
  padding: 0;
  overflow: hidden;
}
.table-container >>> .right_col {
  background-color: #fff;
  border-right: solid 1px #d3dae0;
  padding: 10px 0 0;
}
.table-container >>> .right_col .el-upload-list {
  max-width: 250px;
  margin-top: 10px;
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translateY(100%);
}
.table-container >>> .right_col .el-form {
  margin: 0 auto;
}
.table-container >>> .right_col .el-form-item {
  width: 100%;
}
.table-container >>> .right_col .el-form-item__content {
  white-space: nowrap;
}
.table-container >>> .upload-demo {
  display: inline-block !important;
  vertical-align: top !important;
  position: relative;
}
.table-container >>> .el-tabs__header {
  margin: 0;
}
.table-container >>> .elTab {
  border: none;
}
.app-container .el-tabs {
  border-top: 0px;
}
</style>