<template>
    <div class="IndexWrap">
        <el-card shadow="hover">
            <div class="InquireWrap">
                <div class="InquireList">
                    <el-input
                        size="small"
                        v-model="levelInfo.typeCode"
                        placeholder="设备类型"
                        clearable
                        @clear="
                            levelInfo.typeCode = '';
                        	getList()
                        "
                    />
                    <el-input
                        size="small"
                        v-model="levelInfo.inspectionName"
                        placeholder="标准名称"
                        clearable
                        @clear="
                            levelInfo.inspectionName = '';
                        	getList()
                        "
                    />
                    <el-button size="small" @click="getList">查询</el-button>
                </div>
                <div>
                    <el-button size="small" type="primary" @click="showDialog(1, {})">添加</el-button>
                    <!-- <el-button size="small" type="primary" @click="removeDatas">删除</el-button> -->
                </div>
            </div>
        </el-card>
        <el-table
            class="stockTable"
            :data="levelInfo.tableDatas"
            border
            fit
            highlight-current-row
            empty-text="暂无数据"
            style="width: 100%; font-size: 10px"
            :cell-style="{ padding: '4px' }"
      :height="levelInfo.theight"
      @current-change="selecedChange"
            ref="stockTableRef"
        >
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                width="50"
                type="index"
                label="序号"
            />
            <!-- <el-table-column label width="40" align="center">
                <template v-slot:default="scope">
                    <el-checkbox
                        @change="selecedChange(scope.$index)"
                        v-model="scope.row.selected"
                        size="large"
                    ></el-checkbox>
                </template>
            </el-table-column> -->
            <el-table-column label="操作" min-width="80" align="center">
                <template v-slot:default="scope">
                    <el-button type="text" size="small" @click="showDialog(2, scope.row)">详情</el-button>
                    <!-- @click="openuserrDialog(scope.row, 1)"  @click="delRole(scope.row)"-->
                    <el-button type="text" size="small" @click="removeData(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="inspectionName"
                label="标准名称"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="80"
                prop="typeCode"
                label="设备类型"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="100"
                prop="inspectionPurpose"
                label="巡检目的"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="remark"
                label="备注"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="total"
                label="巡检项总数"
            />
        </el-table>
        <el-pagination
            class="userPagination"
                small="small"
            layout="prev, pager, next"
            :total="levelInfo.tabelTotal"
            @current-change="switchPageNum"
        ></el-pagination>
        <el-tabs type="border-card">
            <el-tab-pane label="巡检项明细">
                <el-table
                    class="detailsTable"
                    :data="levelInfo.detaiList"
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
                        min-width="120"
                        prop="inspectionItemName"
                        label="检查项"
                    />
                    <el-table-column
                        :show-overflow-tooltip="true"
                        align="center"
                        min-width="120"
                        prop="recordType"
                        label="结果类型"
                    ></el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                        align="center"
                        min-width="120"
                        prop="taskStatue"
                        label="结果选项"
                    ></el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                        align="center"
                        min-width="120"
                        prop="upperLimit"
                        label="上限"
                    ></el-table-column>
                    <el-table-column
                        :show-overflow-tooltip="true"
                        align="center"
                        min-width="120"
                        prop="lowerLimit"
                        label="下限"
                    />
                </el-table>
                <el-pagination
                    class="userPagination"
                    small="small"
                    layout="prev, pager, next"
                    :total="levelInfo.tabelTotal"
                    @current-change="switchPageNum"
                ></el-pagination>
            </el-tab-pane>
        </el-tabs>
    </div>
    <!-- 新增/修改供应商 -->
    <edit
        v-if="levelInfo.editDialog"
        :dialog="levelInfo.editDialog"
        :edit-type="levelInfo.editType"
        :edit-data="levelInfo.editData"
        @closeDialog="closeDialog"
    />
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, nextTick } from 'vue'
import api from '../../../api/checkLevel'
import type { levelModule, levelEntity } from '../../../types/checkLevel'
import edit from './edit.vue'
import { ElMessage } from 'element-plus'

const levelInfo = reactive<levelModule>({
    tableDatas: [],
    detaiList: [],
    typeCode: '',
    inspectionName: '',
    editDialog: false,
    editType: 0,
    editData: {},
    pageNum: 1,
    theight:345,
    tabelTotal: 0,
    selcetedIndex: 0,
})

// 切换页码
const switchPageNum = (val: any) => {
    levelInfo.pageNum = val
    getList()
}

onMounted(async () => {
    await getList()
    levelInfo.theight = window.innerHeight - 563
    window.onresize = () => {
        setTableHeight()
    }
})
const selecedChange = (currentRow: any) => {
      if (currentRow) {
    levelInfo.tableDatas.forEach((e: any, i: number) => {
      if (e.id == currentRow.id) {
        levelInfo.selcetedIndex = i;
      }
    });
    getRecordData(currentRow.id)
  }
}
const stockTableRef = ref()
// 查询标准列表
const getList = () => {
    api.apis
        .getList({
            typeCode: levelInfo.typeCode,
            inspectionName: levelInfo.inspectionName,
            currentPage: levelInfo.pageNum,
            pageSize: 10,
        })
        .then((res: any) => {
            levelInfo.tableDatas = res.data.list
            levelInfo.tabelTotal = res.data.pages.count
          stockTableRef.value!.setCurrentRow(levelInfo.tableDatas[0]);
        })
}

//表格高度计算
const setTableHeight = () => {
    levelInfo.theight = window.innerHeight - 563
}

// 添加标准
const showDialog = (editType: number, editData: object) => {
    levelInfo.editDialog = true
    levelInfo.editType = editType
    levelInfo.editData = editData
}

// 删除单个
const removeData = (id: number) => {
    api.apis.deleteById(id).then((res: any) => {
        getList()
    })
}

// 点选表格前的勾选框操作
// const multipleSelection = ref<levelEntity[]>([]);
// const handleSelectionChange = (val: levelEntity[]) => {
//     multipleSelection.value = val;
// }
// 点击行查看检查项
// const currentRecordId = ref()
// const rowClick = (row: any) => {
//     currentRecordId.value = row.id
//     getRecordData(row.id)
// }
const getRecordData = (id: any) => {
    api.apis
        .getDeatail({
            inspectionPlanId: id,
        })
        .then((res: any) => {
            levelInfo.detaiList = res.data
        })
}

// // 批量删除供应商
// const removeDatas = () => {
//     if (multipleSelection.value.length === 0) {
//         ElMessage("没有选择需要操作的数据");
//         return;
//     }
//     const ids = reactive<Number[]>([]);
//     multipleSelection.value.forEach(item => ids.push(item.rowId));
//     api.apis.deleteByIds(ids).then(() => {
//         getList();
//     })
// }

// 关闭弹窗
const closeDialog = () => {
    levelInfo.editDialog = false
    getList()
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
