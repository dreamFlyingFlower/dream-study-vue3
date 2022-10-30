<template>
	<div class="IndexWrap">
		<el-card shadow="hover">
			<div class="InquireWrap">
				<div class="InquireList">
					<el-input
						size="small"
						v-model="levelInfo.inspectionPlanName"
						placeholder="计划名称"
						clearable
						@clear="
							levelInfo.inspectionPlanName = '';
							getList()
						"
					/>
					<el-input
						size="small"
						v-model="levelInfo.departmentId"
						placeholder="计划所属部门"
						clearable
						@clear="
							levelInfo.departmentId = '';
							getList()
						"
					/>
					<el-button size="small" @click="getList">查询</el-button>
				</div>
				<div>
					<!-- <el-button size="small" type="primary" @click="showDialog(1, {})">变更任务</el-button> -->
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
			<!-- <el-table-column type="selection" width="45" align="center" /> -->
			<el-table-column label="操作" min-width="140" align="center">
				<template v-slot:default="scope">
					<el-button
						type="text"
						size="small"
						@click="showDialog(scope.row)"
						>执行</el-button
					>
					<el-button
						type="text"
						size="small"
						@click="removeData(scope.row.id)"
						>删除</el-button
					>
					<el-button
						type="text"
						size="small"
						@click="upadate(scope.row)"
						>变更</el-button
					>
					<!-- @click="openuserrDialog(scope.row, 1)"  @click="delRole(scope.row)"-->
				</template>
			</el-table-column>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				min-width="100"
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
				min-width="80"
				prop="inspectionPlanName"
				label="计划名称"
			/>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				min-width="120"
				prop="inspectionTaskCode"
				label="巡检任务单号"
			/>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				min-width="100"
				prop="inspectionPurpose"
				label="设备巡检进度"
			>
				<template #default="scope">
					<div>
						未检{{ scope.row.undoneCount }}-异常{{
							scope.row.wrongCount
						}}
					</div>
				</template>
			</el-table-column>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				min-width="120"
				prop="remark"
				label="计划巡检时间"
			>
				<template #default="scope">
					<div>
						{{ scope.row.inspectionPlanStartTime }}-{{
							scope.row.inspectionPlanEndTime
						}}
					</div>
				</template>
			</el-table-column>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				min-width="120"
				prop="inspectionStartTime"
				label="巡检开始时间"
			/>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				min-width="120"
				prop="inspectionEndTime"
				label="巡检结束时间"
			/>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				min-width="120"
				prop="inspectionPlanOperator"
				label="计划巡检人"
			/>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				min-width="100"
				prop="inspectionOperator"
				label="巡检人"
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
			<el-tab-pane label="设备情况">
				<el-table
					class="detailsTable"
					:data="levelInfo.detaiList"
					border
					fit
					highlight-current-row
					empty-text="暂无数据"
					style="width: 100%; font-size: 10px"
					:cell-style="{ padding: '2px' }"
					height="256"
				>
					<el-table-column label="操作" min-width="80" align="center">
						<template v-slot:default="scope">
							<el-button
								type="text"
								size="small"
								@click="doTask(scope.row)"
								>执行</el-button
							>
							<!-- @click="openuserrDialog(scope.row, 1)"  @click="delRole(scope.row)"-->
						</template>
					</el-table-column>

					<el-table-column
						:show-overflow-tooltip="true"
						align="center"
						min-width="120"
						prop="recordType"
						label="标准名称"
					></el-table-column>
					<el-table-column
						:show-overflow-tooltip="true"
						align="center"
						min-width="120"
						label="巡检项目进度"
					>
						<template #default="scope">
							<div>
								未检{{ scope.row.undoneCount }} 异常{{
									scope.row.wrongCount
								}}
							</div>
						</template>
					</el-table-column>
					<el-table-column
						:show-overflow-tooltip="true"
						align="center"
						min-width="120"
						prop="inspectionStartTime"
						label="巡检开始时间"
					></el-table-column>
					<el-table-column
						:show-overflow-tooltip="true"
						align="center"
						min-width="120"
						prop="inspectionEndTime"
						label="巡检结束时间"
					></el-table-column>
					<el-table-column
						:show-overflow-tooltip="true"
						align="center"
						min-width="120"
						prop="deviceCode"
						label="设备编号"
					></el-table-column>
					<el-table-column
						:show-overflow-tooltip="true"
						align="center"
						min-width="120"
						prop="deviceName"
						label="设备名称"
					></el-table-column>
					<el-table-column
						:show-overflow-tooltip="true"
						align="center"
						min-width="120"
						prop="modelNumber"
						label="规格型号"
					></el-table-column>
					<el-table-column
						:show-overflow-tooltip="true"
						align="center"
						min-width="120"
						prop="orgName"
						label="使用部门"
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
	<el-dialog v-model="levelInfo.updateDialog" title="变更任务" width="50%">
		<el-form
			label-position="left"
			ref="ruleFormRef"
			:inline="true"
			:rules="editRules"
			:model="formData"
			label-width="120px"
		>
			<el-form-item label="计划巡检时间">
				<el-date-picker
					v-model="formData.planTime"
					readonly
					type="daterange"
					range-separator="To"
					start-placeholder="Start date"
					end-placeholder="End date"
					style="width: 180px"
				></el-date-picker>
			</el-form-item>
			<el-form-item
				label="变更巡检时间"
				prop="updateTime"
				style="margin-left: 10px"
			>
				<el-date-picker
					v-model="formData.updateTime"
					type="datetimerange"
					range-separator="To"
					start-placeholder="开始"
					end-placeholder="结束"
					style="width: 180px"
					format="YYYY-MM-DD HH:mm"
					value-format="YYYY-MM-DD HH:mm"
				></el-date-picker>
			</el-form-item>
			<el-form-item label="计划巡检人">
				<el-input
					readonly
					v-model="formData.inspectionPlanOperator"
				></el-input>
			</el-form-item>
			<el-form-item
				label="变更巡检人"
				prop="updateOperator"
				style="margin-left: 10px"
			>
				<el-input v-model="formData.updateOperator"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button type="primary" @click="updateConfirm"
					>确定</el-button
				>
				<!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
				<el-button @click="onCancelUpdate">取消</el-button>
			</span>
		</template>
	</el-dialog>
	<el-dialog v-model="dialogVisible" title="执行任务" width="60%">
		<el-form :model="form" ref="formRef" :rules="editRules">
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
					></el-date-picker>
				</el-form-item>
			</el-col>

			<el-table
				:data="form.inspectTaskDetailItemDTOList"
				class="detailsTable"
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
						<el-form-item
							:prop="
								'inspectTaskDetailItemDTOList.' +
								scope.$index +
								'.reference'
							"
							:rules="{
								required: true,
								trigger: blur,
								message: '必填',
							}"
						>
							<!-- <el-input v-model="scope.row.reference"></el-input> -->
							<!-- <el-radio-group
                                    v-model="scope.row.reference"
                                    v-if="scope.row.recordType === '单选'"
                                >
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                                <el-checkbox-group
                                    v-model="scope.row.reference"
                                    v-if="scope.row.recordType === '多选'"
                                >
                                    <el-checkbox label="Option A" />
                                    <el-checkbox label="Option B" />
                                    <el-checkbox label="Option C" />
                                    <el-checkbox label="disabled" disabled />
                            </el-checkbox-group>-->
							<el-input
								v-model="scope.row.reference"
								v-if="scope.row.recordType === '多选'"
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
			<el-button type="primary" @click="updateItem(formRef)"
				>确定</el-button
			>
			<!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
			<el-button @click="dialogVisible = false">取消</el-button>
		</template>
	</el-dialog>
	<edit
		v-if="levelInfo.editDialog"
		:dialog="levelInfo.editDialog"
		:edit-data="levelInfo.editData"
		@closeDialog="closeDialog"
	/>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import type { ElForm } from 'element-plus'
import api from '../../../api/checkTask'
import type { levelModule, levelEntity } from '../../../types/checkTask'
import edit from './edit.vue'
import { ElMessage } from 'element-plus'

const levelInfo = reactive<levelModule>({
	tableDatas: [],
	detaiList: [],
	inspectionPlanName: '',
	departmentId: '',
	editDialog: false,
	updateDialog: false,
	editData: {},
	pageNum: 1,
	theight: 345,
	tabelTotal: 0,
    selcetedIndex:0
})

// 切换页码
const switchPageNum = (val: any) => {
	levelInfo.pageNum = val
	getList()
}

onMounted(async () => {
	await getList()
	levelInfo.theight = window.innerHeight -  563
	window.onresize = () => {
		setTableHeight()
	}
})
// 声明表单校验规则
const editRules = reactive({
	updateTime: [
		{
			required: true,
			trigger: 'blur',
			message: '请选择时间',
		},
	],
	updateOperator: [
		{
			required: true,
			trigger: 'blur',
			message: '请选择巡检人',
		},
	],
})
// 声明表单数据
const formData = reactive<levelEntity>({
	inspectionPlanOperator: '',
	planTime: [],
	updateOperator: '',
	updateTime: [],
	id: null,
})
const form = reactive({
	id: null,
	taskId: null,
	remark: null,
	deviceCode: null,
	inspectionStartTime: null,
	inspectionEndTime: null,
	deviceName: null,
	departmentCode: null,
	inspectionName: null,
	inspectionPlanOperator: null,
	inspectionPlanName: null,
	inspectTaskDetailItemDTOList: [],
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
			departmentId: levelInfo.departmentId,
			inspectionPlanName: levelInfo.inspectionPlanName,
			currentPage: levelInfo.pageNum,
			pageSize: 10,
		})
		.then((res: any) => {
			levelInfo.tableDatas = res.data.list
			getRecordData(res.data.list[0].id)
			levelInfo.tabelTotal = res.data.pages.count
          stockTableRef.value!.setCurrentRow(levelInfo.tableDatas[0]);

		})
}

//表格高度计算
const setTableHeight = () => {
	levelInfo.theight = window.innerHeight - 563
}

// 执行
const showDialog = (row: any) => {
	form.taskId = row.id
	levelInfo.editDialog = true
	levelInfo.editData = row
    levelInfo
}
// 变更
const upadate = (row: any) => {
	levelInfo.updateDialog = true
	;(formData.inspectionPlanOperator = row.inspectionPlanOperator),
		(formData.id = row.id)
	formData.planTime = [row.inspectionPlanStartTime, row.inspectionPlanEndTime]
}
// 确认变更
const updateConfirm = () => {
	api.apis
		.update({
			inspectionPlanOperator: formData.updateOperator,
			inspectionPlanStartTime: formData.updateTime[0],
			inspectionPlanEndTime: formData.updateTime[1],
			id: formData.id,
		})
		.then((res: any) => {
			formData.updateOperator = null
			formData.updateTime = []
		})
}
//取消变更
const onCancelUpdate = () => {
	levelInfo.updateDialog = false
	formData.updateOperator = ''
	formData.updateTime = []
}

// 删除单个
const removeData = (id: number) => {
	api.apis.deleteById(id).then((res: any) => {
		if (res.data.code === 1) {
			ElMessage.success('删除成功')
			getList()
		} else {
			ElMessage.error('删除失败')
		}
	})
}

// 点击行查看检查项
// const currentRecordId = ref()
// const rowClick = (row: any) => {
// 	currentRecordId.value = row.id
// 	getRecordData(row.id)
// }
const getRecordData = (id: any) => {
	api.apis.getDeatail(id).then((res: any) => {
		levelInfo.detaiList = res.data.data
	})
}
// 执行任务明细项
const dialogVisible = ref(false)
const doTask = (row: any) => {
	dialogVisible.value = true
	;(form.id = row.id),
		(form.remark = row.remark),
		(form.departmentCode = row.departmentCode),
		(form.deviceCode = row.deviceCode),
		(form.deviceName = row.deviceName),
		(form.inspectionName = row.inspectionName)
	api.apis.getTaskItem(row.id).then((res: any) => {
		form.inspectTaskDetailItemDTOList = res.data.data
	})
}
const formRef = ref<InstanceType<typeof ElForm>>()
const updateItem = (formRef: InstanceType<typeof ElForm> | undefined) => {
	api.apis.excutTask(form).then((res: any) => {
		if (res.data.code === 1) {
			ElMessage.success('执行任务成功')
			dialogVisible.value = false
		} else {
			ElMessage.error('执行任务失败')
		}
	})
}
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

.custom-tree-node {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 14px;
	padding-right: 8px;
}
</style>
