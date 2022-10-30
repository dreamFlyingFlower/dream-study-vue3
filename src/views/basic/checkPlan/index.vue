<template>
    <div class="IndexWrap">
            <el-card shadow="hover">
                <div class="InquireWrap">
                    <div class="InquireList">
                        <el-select
                            size="small"
                            v-model="levelInfo.rollCycleUtilName"
                            placeholder="巡检周期"
                            clearable
                            @clear="levelInfo.rollCycleUtilName = ''; getList()"
                        >
                            <el-option label="小时" value="小时">小时</el-option>
                            <el-option label="天" value="天">天</el-option>
                            <el-option label="周" value="周">周</el-option>
                            <el-option label="月" value="月">月</el-option>
                            <el-option label="季" value="季">季</el-option>
                            <el-option label="年" value="年">年</el-option>
                        </el-select>
                        <el-input
                            size="small"
                            v-model="levelInfo.inspectionPlanOperator"
                            placeholder="巡检人员"
                            clearable
                            @clear="levelInfo.inspectionPlanOperator = ''; getList()"
                        />

                        <el-button size="small" @click="getList">查询</el-button>
                    </div>
                    <div>
                        <el-button size="small" type="primary" @click="showDialog(1, {})">添加</el-button>
                        <!-- <el-button size="small" type="primary" @click="removeDatas">删除</el-button> -->
                        <!-- <el-button size="small" type="primary" @click="start">启用</el-button>
                        <el-button size="small" type="primary" @click="stop">停用</el-button>
                        <el-button size="small" type="primary" @click="removeDatas">执行时间调整</el-button>-->
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
                :height="levelInfo.theight"
            style="width: 100%; font-size: 10px"
                :cell-style="{ padding: '4px' }"
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
                <!-- <el-table-column type="selection" width="45" align="center" /> -->
                <el-table-column label="操作" min-width="130" align="center">
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
                    prop="inspectionPlanCode"
                    label="计划编号"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="80"
                    prop="inspectionPlanName"
                    label="计划名称"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="100"
                    prop="orgName"
                    label="计划所属部门"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="rollCycle"
                    label="巡检周期"
                >
                    <template #default="scope">
                        <div>{{ scope.row.rollCycle }}{{ scope.row.rollCycleUtilName }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    label="计划巡检时间"
                >
                    <template v-slot:default="scope">
                        <a
                            style="color:rgb(20, 137, 247);cursor: pointer;"
                            @click="updateTime(scope.row)"
                        >{{ scope.row.inspectionPlanStartTime }}-{{ scope.row.inspectionPlanEndTime }}</a>
                    </template>
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    label="巡检人员"
                >
                    <template v-slot:default="scope">
                        <div>{{ scope.row.inspectionPlanOperator.join(',') }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    label="计划状态"
                >
                    <template v-slot:default="scope">
                        <el-switch
                            v-model="scope.row.planStatue"
                            inline-prompt
                            active-color="#13ce66"
                            inactive-color="#ff4949"
                            active-value="1"
                            inactive-value="0"
                            active-text="启用"
                            inactive-text="停用"
                            @change="statusUpadate(scope.row)"
                        />
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="userPagination"
                small="small"
                layout="prev, pager, next"
                :total="levelInfo.tabelTotal"
                @current-change="switchPageNum"
            ></el-pagination>
    </div>
    <el-dialog v-model="state.dialogVisible" title="修改计划时间" width="30%">
        <el-date-picker
            v-model="state.planeTime"
            type="datetimerange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            value-format="YYYY-MM-DD hh:mm"
        ></el-date-picker>
        <template #footer>
            <span class="dialog-footer">
                <el-button
                    @click="state.dialogVisible = false; state.planeTime = []; state.updateId = ''"
                >取消</el-button>
                <el-button type="primary" @click="updateTimeConfirm">确定</el-button>
            </span>
        </template>
    </el-dialog>
    <el-tabs type="border-card">
        <el-tab-pane label="巡检记录">
            <el-col style="margin: 10px 10px;">
                <el-select
                    v-model="levelInfo.queryScope"
                    @change="handelTypeChange"
                    size="small"
                    style="width: 100px;"
                >
                    <el-option label="全部" value="1"></el-option>
                    <el-option label="全部未检" value="2"></el-option>
                    <el-option label="部分未检" value="3"></el-option>
                    <el-option label="有异常" value="4"></el-option>
                </el-select>
            </el-col>
            <el-table
                class="detailsTable"
                :data="levelInfo.recordData"
                border
                fit
                highlight-current-row
                empty-text="暂无数据"
                style="width: 100%; font-size: 10px"
                :cell-style="{ padding: '2px' }"
                height="258"
            >
                <el-table-column label="操作" min-width="130" align="center">
                    <template v-slot:default="scope">
                        <el-button type="text" size="small" @click="recordDetail(scope.row)">详情</el-button>
                    </template>
                </el-table-column>

                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="inspectionTaskCode"
                    label="任务编号"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    label="设备巡检进度"
                >
                    <template #default="scope">
                        <div>未检{{ scope.row.undoneCount }} 异常{{ scope.row.wrongCount }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="taskStatue"
                    label="状态"
                >
                    <template #default="scope">
                        <div v-if="scope.row.taskStatue === '1'">待执行</div>
                        <div v-if="scope.row.taskStatue === '2'">执行中</div>
                        <div v-if="scope.row.taskStatue === '3'">已完成</div>
                        <div v-if="scope.row.taskStatue === '4'">逾期未完成</div>
                    </template>
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    label="计划时间"
                >
                    <template #default="scope">
                        <div>{{ scope.row.inspectionPlanStartTime }}-{{ scope.row.inspectionPlanEndTime }}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="inspectionStartTime"
                    label="开始时间"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="inspectionEndTime"
                    label="结束时间"
                />
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="inspectionPlanOperator"
                    label="巡检人"
                />
            </el-table>
            <el-pagination
                class="userPagination"
                small="small"
                layout="prev, pager, next"
                @current-change="switchPageNum"
            ></el-pagination>
        </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="levelInfo.recordDetail" title="点巡检记录详情" width="60%">
        <el-col style="display: flex; justify-content: left;">
            <el-form-item label="计划名称">
                <el-input v-model="detailData.inspectionPlanName" size="small" disabled></el-input>
            </el-form-item>
            <el-form-item label="巡检人" style="margin: 0 20px;">
                <el-input v-model="detailData.inspectionPlanOperator" size="small" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-table
            class="detailsTable"
            :data="levelInfo.recordDetailData"
            border
            fit
            highlight-current-row
            empty-text="暂无数据"
            style="width: 100%; font-size: 10px"
            :cell-style="{ padding: '2px' }"
        >
            <el-table-column label="操作" min-width="80" align="center">
                <template v-slot:default="scope">
                    <el-button type="text" size="small" @click="recordDetailItem(scope.row)">详情</el-button>
                </template>
            </el-table-column>
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="deviceCode"
                label="标准名称"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="deviceCode"
                label="合计项"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="undoneCount"
                label="漏检数"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="wrongCount"
                label="异常数"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="deviceCode"
                label="设备编号"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="deviceName"
                label="设备名称"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="modelNumber"
                label="规格型号"
            />
        </el-table>
    </el-dialog>
    <el-dialog v-model="levelInfo.recordDialog" title="检查项" width="60%">
        <el-col style="display: flex; justify-content: left;">
            <el-form-item label="开始时间">
                <el-input v-model="detailData.startTime" size="small" disabled></el-input>
            </el-form-item>
            <el-form-item label="结束时间" style="margin: 0 20px;">
                <el-input v-model="detailData.endTime" size="small" disabled></el-input>
            </el-form-item>
        </el-col>
        <el-table
            class="detailsTable"
            :data="levelInfo.recordItemData"
            border
            fit
            highlight-current-row
            empty-text="暂无数据"
            style="width: 100%; font-size: 10px"
            :cell-style="{ padding: '2px' }"
        >
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="inspectionItemName"
                label="检查项名称"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="upperLimit"
                label="上限"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="lowerLimit"
                label="下限"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="reference"
                label="巡检记录"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="result"
                label="巡检结果"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="whetherWrong"
                label="是否异常"
            >
                <template #default="scope">
                    <div v-if="scope.row.whetherWrong">异常</div>
                    <div v-else>正常</div>
                </template>
            </el-table-column>
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="remark"
                label="备注"
            />
        </el-table>
    </el-dialog>
    <edit
        v-if="levelInfo.editDialog"
        :dialog="levelInfo.editDialog"
        :edit-type="levelInfo.editType"
        :edit-data="levelInfo.editData"
        @closeDialog="closeDialog"
    />
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import api from "../../../api/checkPlan";
import type { levelModule, levelEntity } from "../../../types/checkPlan";
import edit from './edit.vue';
import { ElMessage } from "element-plus";

const levelInfo = reactive<levelModule>({
    tableDatas: [],
    rollCycleUtilName: "",
    inspectionPlanOperator: "",
    editDialog: false,
    recordDialog: false,
    recordDetail: false,
    recordDetailData: [],
    recordItemData: [],
    recordData: [],
    queryScope: '1',
    editType: 0,
    editData: {},
    pageNum: 1,
    tabelTotal: 0,
    theight: 345,
    selcetedIndex:0
});

// 切换页码
const switchPageNum = (val: any) => {
    levelInfo.pageNum = val;
    getList();
};

onMounted(async () => {
    await getList();
    levelInfo.theight = window.innerHeight - 563;
    window.onresize = () => {
        setTableHeight();
    };
});
//表格高度计算
const setTableHeight = () => {
    levelInfo.theight = window.innerHeight - 563;
};
const selecedChange = (currentRow: any) => {
      if (currentRow) {
    levelInfo.tableDatas.forEach((e: any, i: number) => {
      if (e.id == currentRow.id) {
        levelInfo.selcetedIndex = i;
      }
    });
    levelInfo.queryScope = '1'
    getRecordData(currentRow.id,1)
  }
}
// 查询列表 
const stockTableRef = ref()
const getList = () => {
    api.apis.getList({
        rollCycleUtilName: levelInfo.rollCycleUtilName,
        inspectionPlanOperator: levelInfo.inspectionPlanOperator,
        currentPage: levelInfo.pageNum,
        pageSize: 10,
    }).then((res: any) => {
        levelInfo.tableDatas = res.data.list;
        levelInfo.tabelTotal = res.data.pages.count;
          stockTableRef.value!.setCurrentRow(levelInfo.tableDatas[0]);
          currentRecordId.value = res.data.list[0].id
    });
};

// 添加编辑
const showDialog = (editType: number, editData: object) => {
    levelInfo.editDialog = true;
    levelInfo.editType = editType;
    levelInfo.editData = editData;
}
// 点击行查看巡检记录
const currentRecordId = ref()
const rowClick = (row: any) => {
    currentRecordId.value = row.id
    levelInfo.queryScope = '1'
    // getRecordData(row.id, 1)
}
const getRecordData = (id: any, queryScope: any) => {
    api.apis.getReccordList({
        inspectionPlanId: id,
        queryScope: queryScope
    }).then((res: any) => {
        levelInfo.recordData = res.data
    })
}
const handelTypeChange = (val: any) => {
    getRecordData(currentRecordId.value, val)
}
const detailData = reactive({
    inspectionPlanName: '',
    inspectionPlanOperator: '',
    startTime: '',
    endTime: ''
})
const recordDetail = (row: any) => {
    levelInfo.recordDetail = true
    detailData.inspectionPlanOperator = row.inspectionPlanOperator
    detailData.inspectionPlanName = row.inspectionPlanName
    api.apis.getCheckTaskDetail(row.id).then((res: any) => {
        levelInfo.recordDetailData = res.data.data
    })
}
// 巡检任务明细检查项列表
const recordDetailItem = (row: any) => {
    levelInfo.recordDialog = true
    detailData.startTime = row.inspectionStartTime
    detailData.endTime = row.inspectionEndTime
    api.apis.getCheckTaskDetailItems(row.id).then((res: any) => {
        levelInfo.recordItemData = res.data.data
    })
}

// 删除单个
const removeData = (id: number) => {
    api.apis.deleteById(id).then((res: any) => {
        if (res.data.ccode === 1) {
            ElMessage.success('删除成功')
        } else {
            ElMessage.error('删除失败')
        }
        getList();
    });
};

// 点选表格前的勾选框操作
// const multipleSelection = ref<levelEntity[]>([]);
// const handleSelectionChange = (val: levelEntity[]) => {
//     multipleSelection.value = val;
// }

// 更新计划状态
const statusUpadate = (row: any) => {
    console.log(row.planStatue, 'ss');
    if (row.planStatue === '1') {
        api.apis.startById(row.id)
    } else {
        api.apis.stopById(row.id)
    }

}

// 更新计划时间
const state = reactive<{
    dialogVisible: Boolean,
    planeTime: any,
    updateId: String
}>({
    dialogVisible: false,
    planeTime: [],
    updateId: ''
})
const updateTime = (row: any) => {
    state.dialogVisible = true
    console.log(state.planeTime, 'pp1');
    state.updateId = row.id
    state.planeTime = [row.inspectionPlanStartTime, row.inspectionPlanEndTime]
    console.log(state.planeTime, 'pp2');
}
// 点击确认修改时间
const updateTimeConfirm = () => {
    console.log(state.planeTime, '11');
    api.apis.updatePlanTime(state.updateId, state.planeTime[0], state.planeTime[1]).then((res: any) => {
        if (res.data.code === 1) {
            ElMessage.success('修改成功')
            state.dialogVisible = false
            getList()
            state.updateId = ''
            state.planeTime = []
        } else {
            ElMessage.error('修改失败')
        }
    })
}
// 关闭弹窗
const closeDialog = () => {
    levelInfo.editDialog = false;
    getList();
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