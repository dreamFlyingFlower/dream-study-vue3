<template>
    <el-dialog
        :close-on-click-modal="false"
        @close="onCancel"
        v-model="props.dialog"
        :title="props.editType === 1 ? '新增巡检计划' : '编辑巡检计划'"
        width="80%"
        center
    >
        <div v-if="step === 1">
            <el-form
                ref="ruleFormRef"
                :inline="true"
                :rules="editRules"
                :model="formData"
                label-width="140px"
            >
                <el-form-item label="计划名称:" prop="inspectionPlanName">
                    <el-input v-model="formData.inspectionPlanName" placeholder="计划名称"></el-input>
                </el-form-item>
                <el-form-item label="所属部门:" prop="orgName">
                    <el-select v-model="formData.orgName" placeholder="所属部门">
                        <el-option value="部门1" key="0">部门1</el-option>
                        <el-option value="部门2" key="1">部门2</el-option>
                        <el-option value="部门3" key="2">部门3</el-option>
                        <el-option value="部门4" key="3">部门4</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="巡检周期:" prop="rollCycle">
                    <el-col style="display: flex; justify-content: space-between;">
                        <el-input
                            v-model="formData.rollCycle"
                            placeholder="巡检周期"
                            style="width: 120px;"
                        ></el-input>
                        <el-select v-model="formData.rollCycleUtil" style="width: 60px;">
                            <el-option label="时" value="cycle_hour">时</el-option>
                            <el-option label="天" value="cycle_day">天</el-option>
                            <el-option label="周" value="cycle_week">周</el-option>
                            <el-option label="月" value="cycle_month">月</el-option>
                            <el-option label="季" value="cycle_quarter">季</el-option>
                            <el-option label="年" value="cycle_year">年</el-option>
                        </el-select>
                    </el-col>
                </el-form-item>
                <el-form-item label="计划巡检时间:" prop="planTime">
                    <!-- <el-input v-model="formData.planTime" placeholder="计划巡检时间"></el-input> -->
                    <el-date-picker
                        v-model="formData.planTime"
                        type="datetimerange"
                        range-separator="To"
                        start-placeholder="开始"
                        end-placeholder="结束"
                        format="YYYY-MM-DD hh:mm"
                        value-format="YYYY-MM-DD hh:mm"
                        style="width: 180px;"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="提醒时间:" prop="remindTime">
                    <el-input
                        v-model="formData.remindTime"
                        placeholder="提醒时间"
                        style="width: 200px;"
                    >
                        <template #append>分钟</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="计划状态:">
                    <!-- <el-input v-model="formData.planStatue" placeholder="计划状态"></el-input> -->
                    <el-select v-model="formData.planStatue" placeholder="计划状态">
                        <el-option label="启用" :value="'1'"></el-option>
                        <el-option label="停用" :value="'2'"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="巡检人员:" prop="inspectionPlanOperator">
                    <el-select
                        v-model="formData.inspectionPlanOperator"
                        placeholder="巡检人员:"
                        multiple
                        collapse-tags
                    >
                        <el-option label="小明" value="小明"></el-option>
                        <el-option label="小王" value="小王"></el-option>
                        <el-option label="老王" value="老王"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注:" style="width: 80%">
                    <el-input v-model="formData.remark" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <el-col style="width: 100%;display: flex;justify-content: center;" v-if="step === 1">
                <!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
                <el-button @click="onCancel">取消</el-button>
                <el-button type="primary" @click="next(ruleFormRef)">下一步</el-button>
            </el-col>
        </div>
        <div v-if="step === 2">
            <el-col style="margin: 10px 0;">
                <el-button size="small" type="primary" @click="showDevice">选择设备</el-button>
                <el-button size="small" type="primary" @click="addPoint">增加点位</el-button>
            </el-col>
            <el-table
                class="spareTable"
                :data="formData.inspectionPlanDetailDTOList"
                border
                fit
                highlight-current-row
                empty-text="暂无数据"
               style="width: 100%; font-size: 10px"
               :cell-style="{ padding: '4px' }"
            >
                <el-table-column label="操作" min-width="80" align="center">
                    <template v-slot:default="scope">
                        <el-button type="text" size="small" @click="deletePlaneTodo(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="deviceCode"
                    label="设备/点位编号"
                >
                    <template #default="scope">
                        <el-input
                            size="small"
                            v-model="scope.row.deviceCode"
                            :disabled="scope.row.deviceCode !== ''"
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="deviceName"
                    label="设备/点位名称"
                >
                    <template #default="scope">
                        <el-input
                            size="small"
                            v-model="scope.row.deviceName"
                            :disabled="scope.row.deviceName !== ''"
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="modelNumber"
                    label="规格/型号描述"
                >
                    <template #default="scope">
                        <el-input
                            size="small"
                            v-model="scope.row.modelNumber"
                            :disabled="scope.row.modelNumber !== ''"
                        ></el-input>
                    </template>
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="220"
                    prop="inspectionStandardName"
                    label="巡检标准"
                >
                    <template #default="scope">
                        <div style="display: flex;justify-content: left;">
                            <el-button type="text" @click="addLevel(scope.row)">添加</el-button>
                            <el-button type="text" @click="setLevel(scope.row)">配置</el-button>
                            <el-checkbox-group
                                v-model="scope.row.inspectionStandardName"
                                style="margin-left: 20px;"
                            >
                                <el-checkbox
                                    :label="item"
                                    v-for="(item, index) in scope.row.inspectionStandardName"
                                    :key="index"
                                />
                            </el-checkbox-group>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    :show-overflow-tooltip="true"
                    align="center"
                    min-width="120"
                    prop="whetherPhoto"
                    label="必须拍照"
                >
                    <template #default="scope">
                        <el-radio-group v-model="scope.row.whetherPhoto">
                            <el-radio :label="'1'">是</el-radio>
                            <el-radio :label="'0'">否</el-radio>
                        </el-radio-group>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <template #footer>
            <span class="dialog-footer" v-if="step === 2">
                <el-button @click="stepBack">上一步</el-button>
                <el-button type="primary" @click="handlerFormData">确定</el-button>
                <!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
            </span>
        </template>
    </el-dialog>
    <el-dialog
        :close-on-click-modal="false"
        @close="deviceTable = false"
        v-model="deviceTable"
        title="选择设备"
        width="60%"
        center
    >
        <el-row justify="space-between" style="margin: 10px 0;">
            <el-col span="18" style="display: flex; justify-content:left;">
                <el-input
                    size="small"
                    placeholder="设备名称"
                    v-model="deviceParams.deviceName"
                    style="margin: 0 10px;width: 200px;"
                    clearable
                ></el-input>
                <el-select
                    size="small"
                    placeholder="设备类型"
                    v-model="deviceParams.typeCode"
                    style="margin: 0 10px;width: 200px;"
                    clearable
                >
                    <el-option
                        :label="item.typeName"
                        :value="item.typeCode"
                        v-for="(item, index) in deviceList"
                        :key="index"
                    ></el-option>
                </el-select>
                <el-input
                    size="small"
                    placeholder="使用部门"
                    v-model="deviceParams.useDept"
                    style="margin: 0 10px;width: 200px;"
                    clearable
                ></el-input>
            </el-col>
            <el-col span="6">
                <el-button type="primary" size="small" @click="searchDevice">查询</el-button>
            </el-col>
        </el-row>
        <el-table
            class="spareTable"
            :data="deviceList"
            border
            fit
            highlight-current-row
            empty-text="暂无数据"
            style="width: 100%; font-size: 10px"
            :cell-style="{ padding: '4px' }"
            height="460px"
            @selection-change="handleSelectionChange"
        >
            <el-table-column type="selection" width="45" align="center" />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="deviceCode"
                label="设备编码"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
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
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="useDept"
                label="使用部门"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="typeName"
                label="设备类型"
            />
        </el-table>
        <template #footer>
            <span class="dialog-footer" v-if="step === 2">
                <el-button @click="deviceTable = false">取消</el-button>
                <el-button type="primary" @click="addDevice">确定</el-button>
                <!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
            </span>
        </template>
    </el-dialog>
    <el-dialog
        :close-on-click-modal="false"
        @close="addLevelShow = false"
        v-model="addLevelShow"
        title="选择标准"
        width="60%"
        center
    >
            <el-row justify="space-between" style="margin: 10px 0;">
            <el-col span="18" style="display: flex; justify-content:left;">
                <el-select
                    size="small"
                    placeholder="设备类型"
                    v-model="deviceParams.typeCode"
                    style="margin: 0 10px;width: 200px;"
                    clearable
                >
                    <el-option
                        :label="item.typeName"
                        :value="item.typeCode"
                        v-for="(item, index) in deviceList"
                        :key="index"
                    ></el-option>
                </el-select>
            </el-col>
            <el-col span="6">
                <el-button type="primary" size="small" @click="searchStanrd">查询</el-button>
            </el-col>
        </el-row>
        <el-table
            class="spareTable"
            :data="levelList"
            border
            fit
            highlight-current-row
            empty-text="暂无数据"
              style="width: 100%; font-size: 10px"
            :cell-style="{ padding: '4px' }"
            @selection-change="handleLevelChange"
        >
            <el-table-column type="selection" width="45" align="center" />
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
                min-width="120"
                prop="inspectionPurpose"
                label="巡检目的"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="total"
                label="巡检项总数"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="remark"
                label="备注"
            />
        </el-table>
        <template #footer>
            <span class="dialog-footer" v-if="step === 2">
                <el-button @click="addLevelShow = false">取消</el-button>
                <el-button type="primary" @click="addLevelConfirm">确定</el-button>
                <!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
            </span>
        </template>
    </el-dialog>
    <el-dialog
        :close-on-click-modal="false"
        @close="setLevelShow = false"
        v-model="setLevelShow"
        title="设置标准"
        width="60%"
        center
    >
        <el-table
            class="spareTable"
            :data="setLevelTable"
            border
            fit
            highlight-current-row
            empty-text="暂无数据"
              style="width: 100%; font-size: 10px"
            :cell-style="{ padding: '4px' }"
            @selection-change="setLevel"
        >
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="inspectionItemName"
                label="巡检项目"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="whetherRequired"
                label="是否必填"
            >
                <template #default="sccope">
                    <el-checkbox
                        v-model="sccope.row.whetherRequired"
                        :true-label="'1'"
                        :false-label="'0'"
                    ></el-checkbox>
                </template>
            </el-table-column>
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                min-width="120"
                prop="whetherShow"
                label="不显示"
            >
                <template #default="sccope">
                    <el-checkbox
                        v-model="sccope.row.whetherShow"
                        :true-label="'1'"
                        :false-label="'0'"
                    ></el-checkbox>
                </template>
            </el-table-column>
        </el-table>
        <template #footer>
            <span class="dialog-footer" v-if="step === 2">
                <el-button @click="setLevelShow = false; setLevelTable.value = []">取消</el-button>
                <el-button type="primary" @click="setLevelConfirm">确定</el-button>
                <!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import type { ElForm } from "element-plus";
import { reactive, ref, defineEmits, onMounted } from "vue";
import type { levelAdd, levelEntity, proModule } from "../../../types/checkPlan";
import { ElMessage } from 'element-plus'
import api from "../../../api/checkPlan";
import levlApi from "../../../api/checkLevel"

// 声明从组件传递的属性
const props = defineProps({
    dialog: {
        type: Boolean,
        default: false,
    },
    editType: {
        type: Number,
        default: 0
    },
    editData: {
        type: Object,
        default: null,
    }
});

// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);

// 声明事件
const editModule = reactive({
});

// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
// 声明表单校验规则
const editRules = reactive({
    inspectionPlanName: [
        {
            required: true,
            trigger: "blur",
            message: '请输入计划名称'
        },
    ],
    rollCycle: [
        {
            required: true,
            trigger: "blur",
            message: '请输入巡检周期'
        },
    ],
    inspectionPlanOperator: [
        {
            required: true,
            trigger: "blur",
            message: '请选择巡检人员'

        },
    ],
    orgName: [{ required: true, trigger: "blur", message: '请选择部门' }],
    planTime: [{ required: true, trigger: "blur", message: '请选择时间' }],
    remindTime: [{ required: true, trigger: "blur", message: '请输入提醒时间' }],
});
// 声明表单数据
const formData = reactive<levelEntity>({
    inspectionPlanName: null,
    id: null,
    inspectionPlanCode: null,
    orgName: null,
    rollCycle: null,
    rollCycleUtil: 'cycle_hour',
    remindTime: null,
    // inspectionPlanStartTime: null,
    planTime: [],
    planStatue: '1',
    inspectionPlanOperator: [],
    inspectionPlanDetailDTOList: [],
    remark: null
});

// 初始化方法
onMounted(() => {
    init();
});

const deviceList = ref([])
const levelList = ref([])
// 初始化
const init = () => {
    // 修改
    if (props.editType === 2) {
        for (const key in props.editData) {
            if (Object.prototype.hasOwnProperty.call(props.editData, key)) {
                formData[key] = props.editData[key];
            }
        }
        formData.planTime.push(props.editData.inspectionPlanStartTime, props.editData.inspectionPlanEndTime)
        // formData.id = props.editData.id
        // formData.inspectionPlanCode = props.editData.inspectionPlanCode

        // 获取标准对应的项目
        api.apis.getDeatail(props.editData.id).then((res: any) => {
            formData.inspectionPlanDetailDTOList = res.data.data.inspectionPlanDetailDTOList
        })
    }

    // 标准列表
    levlApi.apis.getList({}).then((res: any) => {
        levelList.value = res.data
    })
}
const step = ref(1)
const next = (formEl: InstanceType<typeof ElForm> | undefined) => {
    if (!formEl) {
        return;
    }
    formEl.validate((valid) => {
        if (valid) {
            step.value = 2
        } else {
            return false;
        }
    })
}

const stepBack = () => {
    step.value = 1
}
// 增加点位
const addPoint = () => {
    formData.inspectionPlanDetailDTOList.push({
        whetherPhoto: '0',
        deviceCode: '',
        deviceName: '',
        modelNumber: '',
        inspectionPlanDetailItemDTOList: [],
        inspectionStandardName: [],
        inspectionStandardId: []
    })
}
const deviceParams = reactive({
    deviceName: '',
    typeCode: '',
    useDept: ''
})
const getDeviceList = (params: any) => {
    // 获取设备列表
    api.apis.getDeviceList(params).then((res: any) => {
        deviceList.value = res.data
    })
}
const searchDevice = () => {
    getDeviceList({
        deviceName: deviceParams.deviceName,
        typeCode: deviceParams.typeCode,
        useDept: deviceParams.useDept
    })
}
const searchStanrd = () => {
    levlApi.apis.getList({
        typeCode: deviceParams.typeCode,
    }).then((res: any) => {
        levelList.value = res.data
    })
}
// 添加设备
const deviceTable = ref(false)
const showDevice = () => {
    getDeviceList({})
    deviceTable.value = true
}
// 点选表格前的勾选框操作
const multipleSelection = ref<proModule[]>([]);
const handleSelectionChange = (val: proModule[]) => {
    multipleSelection.value = val;
}
// 确认添加设备
const addDevice = () => {
    if (multipleSelection.value.length === 0) {
        ElMessage("没有选择需要操作的数据");
        return;
    } else {
        if (formData.inspectionPlanDetailDTOList.length === 0) {
            multipleSelection.value.forEach(item => {
                formData.inspectionPlanDetailDTOList.push({
                    whetherPhoto: '0',
                    deviceCode: item.deviceCode,
                    deviceName: item.deviceName,
                    modelNumber: item.modelNumber,
                    inspectionPlanDetailItemDTOList: [],
                    inspectionStandardName: [],
                    inspectionStandardId: []
                })
            })
        } else {
            console.log(
                multipleSelection.value, 'ooo'
            );

            multipleSelection.value.forEach(item => {
                    var has = false
                formData.inspectionPlanDetailDTOList.forEach((element: any) => {
                    console.log(element.deviceCode, 'e');
                    console.log(item.deviceCode, 'i');
                    if (element.deviceCode === item.deviceCode) {
                         has = true
                    }else{has = false}
                })
                    if (!has) {
                        formData.inspectionPlanDetailDTOList.push({
                            whetherPhoto: '0',
                            deviceCode: item.deviceCode,
                            deviceName: item.deviceName,
                            modelNumber: item.modelNumber,
                            inspectionPlanDetailItemDTOList: [],
                            inspectionStandardName: [],
                            inspectionStandardId: []
                        })
                    }

            })
        }

        deviceTable.value = false
        multipleSelection.value = []
    }

}
// 删除检查设备
const deletePlaneTodo = (row: any) => {
    console.log(row.deviceCode, 'index');
    formData.inspectionPlanDetailDTOList.forEach((element: any, index: any) => {
        if (element.deviceCode === row.deviceCode) {
            formData.inspectionPlanDetailDTOList.splice(index, 1)
        }
    });

}
// 添加标准
const addLevelShow = ref(false)
const multipleLevel = ref<levelAdd[]>([]);
const handleLevelChange = (val: levelAdd[]) => {
    multipleLevel.value = val;
}
const selectedRow = ref()
const addLevel = (row: any) => {
    addLevelShow.value = true
    selectedRow.value = row
}
const addLevelConfirm = () => {
    if (multipleLevel.value.length === 0) {
        ElMessage("没有选择需要操作的数据");
        addLevelShow.value = false
    } else {
        formData.inspectionPlanDetailDTOList.forEach((element: any) => {
            if (element === selectedRow.value) {
                multipleLevel.value.forEach((item: any) => {
                    element.inspectionStandardName.push(item.inspectionName);
                    element.inspectionStandardId.push(item.id)
                    element.inspectionStandardId = Array.from(new Set(element.inspectionStandardId))
                    element.inspectionStandardName = Array.from(new Set(element.inspectionStandardName))
                })
                       addLevelShow.value = false
        multipleLevel.value = []
            }
        })
        // formData.inspectionPlanDetailDTOList = Array.from(new Set(formData.inspectionPlanDetailDTOList))
 
    }
    console.log(multipleLevel.value, 'uu')


}
// 配置标准
const setLevelShow = ref(false)
const setLevelTable = ref<any>([])
const setLevel = (row: any) => {
    setLevelShow.value = true
    selectedRow.value = row
    // 根据标准id查询标准项目
    if (setLevelTable.value.length) {
        return
    } else {
        row.inspectionStandardId.forEach((element: any) => {
            levlApi.apis.getDeatail({ inspectionStandardId: element }).then((res: any) => {
                res.data.forEach((element: any) => {
                    setLevelTable.value.push({
                        inspectionItemName: element.inspectionItemName,
                        inspectionStandardId: element.inspectionStandardId,
                        inspectionStandardDetailId: element.id,
                        whetherRequired: 0,
                        whetherShow: 0
                    })
                });
            })
        });
    }
}
const setLevelConfirm = () => {
    // console.log(setLevelTable.value,'ss');
    formData.inspectionPlanDetailDTOList.forEach((element: any) => {
        if (element === selectedRow.value) {
            element.inspectionPlanDetailItemDTOList = setLevelTable.value
        }
        setLevelShow.value = false
        selectedRow.value = null
        setLevelTable.value = []

    });

}
// 新增或修改数据提交
const handlerFormData = () => {
    const form = {
        inspectionPlanName: formData.inspectionPlanName,
        inspectionPlanCode: formData.inspectionPlanCode,
        id: formData.id,
        orgName: formData.orgName,
        orgCode: '1',
        rollCycle: parseInt(formData.rollCycle),
        rollCycleUtil: formData.rollCycleUtil,
        remindTime: parseInt(formData.remindTime),
        inspectionPlanStartTime: formData.planTime[0],
        inspectionPlanEndTime: formData.planTime[0],
        planStatue: parseInt(formData.planStatue),
        inspectionPlanOperator: formData.inspectionPlanOperator,
        inspectionPlanDetailDTOList: formData.inspectionPlanDetailDTOList,
        remark: formData.remark,
        delFlag:0
    }
    if (props.editType === 1) {
        // console.log(formData, 'form');
        api.apis.add(form).then((res: any) => {

            if (res.data.code === 1) {
                ElMessage.success('新增成功')
            } else {
                ElMessage.error('新增失败')
            }
            onCancel();
        });
    } else if (props.editType === 2) {
        api.apis.edit(form).then((res: any) => {
            console.log(res, 'res');
            if (res.data.code === 1) {
                ElMessage.success('编辑成功')
            } else {
                ElMessage.error('编辑失败')
            }
            onCancel();
        });
    }
};

// 关闭弹窗
const onCancel = () => {
    emit("closeDialog");
};
</script>

<style lang="scss" scoped>
.spareTable {
    th {
        padding: 0 !important;
        height: 30px;
        line-height: 30px;
    }
    td {
        padding: 0 !important;
        height: 30px;
        line-height: 30px;
    }
}
</style>
