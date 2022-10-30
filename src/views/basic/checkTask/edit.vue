<template>
	<el-dialog
		:close-on-click-modal="false"
		@close="onCancel"
		v-model="props.dialog"
		title="点巡检任务"
		width="60%"
		center
	>
		<el-form
			ref="ruleFormRef"
			:inline="true"
			:rules="editRules"
			:model="formData"
			label-width="140px"
		>
			<el-form-item label="任务名称:" prop="inspectionName">
				<el-input
					v-model="formData.inspectionPlanName"
					disabled
					placeholder="任务名称"
				></el-input>
			</el-form-item>
			<el-form-item label="巡检人:">
				<el-select
					v-model="formData.inspectionPlanOperator"
					placeholder="巡检人"
				>
					<el-option value="小王" key="0">小王</el-option>
					<el-option value="小王2" key="1">小王2</el-option>
					<el-option value="小王3" key="2">小王3</el-option>
					<el-option value="小王4" key="3">小王4</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="备注:" style="width: 80%">
				<el-input v-model="formData.remark" type="textarea"></el-input>
			</el-form-item>
		</el-form>
		<el-table
			class="spareTable"
			:data="formData.inspectTaskDetailItem"
			border
			fit
			highlight-current-row
			empty-text="暂无数据"
			style="width: 100%; font-size: 10px"
			:cell-style="{ padding: '8px' }"
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
					<el-button
						type="text"
						size="small"
						@click="doTask(scope.row)"
						>详情</el-button
					>
				</template>
			</el-table-column>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				prop="inspectionItemName"
				label="巡检项目"
			/>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				prop="itemCount"
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
				prop="modelNumber"
				label="规格型号"
			/>
		</el-table>

		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="handlerFormData(ruleFormRef)"
					>确定</el-button
				>
				<!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
				<el-button @click="onCancel">取消</el-button>
			</span>
		</template>
	</el-dialog>
	<el-dialog v-model="dialogVisible" title="执行任务" width="60%">
		<el-form :model="formData" ref="formRef">
			<el-col style="display: flex; justify-content: left">
				<el-form-item
					label="开始时间"
					prop="inspectionStartTime"
					:rules="{
						required: true,
						trigger: blur,
						message: '请选择开始时间',
					}"
				>
					<el-date-picker
						v-model="form.inspectionStartTime"
						size="small"
						value-format="YYYY-MM-DD HH:mm"
						placeholder="开始时间"
					></el-date-picker>
				</el-form-item>
				<el-form-item
					label="结束时间"
					prop="inspectionEndTime"
					style="margin-left: 20px"
				>
					<el-date-picker
						v-model="form.inspectionEndTime"
						placeholder="开始时间"
						size="small"
					></el-date-picker>
				</el-form-item>
			</el-col>
			<el-table
				:data="formData.inspectTaskDetailItemDTOList"
				class="spareTable"
				border
				fit
				highlight-current-row
				empty-text="暂无数据"
				style="width: 100%; font-size: 10px"
				:cell-style="{ padding: '8px' }"
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
					prop="inspectionItemName"
					label="巡检标准"
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
					prop="reference"
					label="巡检记录"
					:show-overflow-tooltip="true"
					align="center"
				>
					<template #default="scope">
						<el-form-item>
							<!-- <el-input v-model="scope.row.reference"></el-input> -->
							<el-radio-group
                                    v-model="scope.row.reference"
                                    v-if="scope.row.recordType === '单选'"
                                    v-for="(item ,index) in  scope.row.reference" :key="index"
                                >
                                    <el-radio :label="item"></el-radio>
                                </el-radio-group>
                                <el-checkbox-group
                                    v-model="scope.row.reference"
                                    v-if="scope.row.recordType === '多选'"
                                >
                                    <el-checkbox label="Option A" />
                                    <el-checkbox label="Option B" />
                                    <el-checkbox label="Option C" />
                                    <el-checkbox label="disabled" disabled />
                            </el-checkbox-group>
							<el-input
								v-model="scope.row.reference"
								v-if="
									scope.row.recordType === '数字' ||
									scope.row.recordType === '文本'
								"
							></el-input>
						</el-form-item>
					</template>
				</el-table-column>
				<el-table-column
					:show-overflow-tooltip="true"
					align="center"
					prop="reference"
					label="巡检结果"
				/>
				<el-table-column
					:show-overflow-tooltip="true"
					align="center"
					prop="whetherWrong"
					label="是否异常"
				/>
				<el-table-column
					:show-overflow-tooltip="true"
					align="center"
					prop="remark"
					label="备注"
				/>
			</el-table>
		</el-form>
		<template #footer>
			<el-button type="primary" @click="updateItem">确定</el-button>
			<!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
			<el-button @click="dialogVisible = false">取消</el-button>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import type { ElForm } from 'element-plus'
import { reactive, ref, defineEmits, onMounted } from 'vue'
import type {
	levelModule,
	updateTask,
	proModule,
} from '../../../types/checkTask'
import { ElMessage } from 'element-plus'
import api from '../../../api/checkTask'

// 声明从组件传递的属性
const props = defineProps({
	dialog: {
		type: Boolean,
		default: false,
	},
	editData: {
		type: Object,
		default: null,
	},
})
const dialogVisible = ref(false)
// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog'])

// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>()
const form = reactive({
	inspectionStartTime: null,
	inspectionEndTime: null,
})
// 声明表单校验规则
const editRules = reactive({
	supplierName: [
		{
			required: true,
			trigger: 'blur',
		},
	],
})

// 声明表单数据
const formData = reactive<updateTask>({
	taskId: null,
	itemId: null,
	remark: null,
	deviceCode: null,
	deviceName: null,
	departmentCode: null,
	inspectionName: null,
	inspectionPlanOperator: null,
	inspectionPlanName: null,
	inspectTaskDetailItem: [],
	inspectTaskDetailItemDTOList: [],
})
const proData = reactive<proModule>({
	inspectionItemName: null,
	defaultValue: null,
	lowerLimit: null,
	upperLimit: null,
	recordType: '单选',
	id: null,
})
// 初始化方法
onMounted(() => {
	init()
})

// 初始化
const init = () => {
	// 修改
	for (const key in props.editData) {
		if (Object.prototype.hasOwnProperty.call(props.editData, key)) {
			formData[key] = props.editData[key]
		}
	}
	formData.taskId = props.editData.id
	// 获取标准对应的项目
	api.apis.startTask(props.editData.id).then((res: any) => {
		formData.inspectTaskDetailItem = res.data.data
	})
}

const doTask = (row: any) => {
	dialogVisible.value = true
	api.apis.getTaskItem(row.id).then((res: any) => {
		formData.itemId = row.id
		formData.inspectTaskDetailItemDTOList = res.data.data
	})
}
const updateItem = () => {
	api.apis
		.excutTask({
			id: formData.itemId,
			inspectionTaskId: formData.taskId,
			inspectTaskDetailItemDTOList: formData.inspectTaskDetailItemDTOList,
			deviceCode: formData.deviceCode,
			deviceName: formData.deviceName,
			inspectionName: formData.inspectionName,
			departmentCode: formData.departmentCode,
			inspectionEndTime: form.inspectionEndTime,
			inspectionStartTime: form.inspectionStartTime,
		})
		.then((res: any) => {
			if (res.data.code === 1) {
				ElMessage.success('执行成功')
				dialogVisible.value = false
			} else {
				ElMessage.error('执行失败')
			}
		})
}

// 新增或修改数据
const handlerFormData = (formEl: InstanceType<typeof ElForm> | undefined) => {
	if (!formEl) {
		return
	}
	formEl.validate((valid) => {
		if (valid) {
			api.apis.stopTask(formData.taskId).then((res: any) => {
				if (res.data.code === 1) {
					ElMessage.success('结束任务成功')
				} else {
					ElMessage.error('结束任务失败')
				}
			})
		} else {
			console.log('error submit!')
			return false
		}
	})
}
// 关闭弹窗
const onCancel = () => {
	emit('closeDialog')
}
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
