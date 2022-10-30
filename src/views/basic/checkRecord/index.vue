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
					<!-- <el-button size="small" type="primary" @click="showDialog(1, {})">添加</el-button> -->
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
			<!-- <el-table-column type="selection" width="45" align="center" /> -->

			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				min-width="80"
				prop="inspectionPlanName"
				label="计划名称"
			>
				<template #default="scope">
					<el-button
						type="text"
						size="small"
						@click="showTask(scope.row)"
						>{{ scope.row.inspectionPlanName }}</el-button
					>
				</template>
			</el-table-column>
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
				min-width="120"
				prop="inspectionOperator"
				label="巡检人"
			/>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				min-width="120"
				prop="departmentName"
				label="计划所属部门"
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
			<el-tab-pane label="任务明细">
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
					<el-table-column
						:show-overflow-tooltip="true"
						align="center"
						min-width="120"
						prop="inspectionName"
						label="标准名称"
					>
						<template #default="scope">
							<el-button
								type="text"
								size="small"
								@click="showTaskItem(scope.row)"
								>{{ scope.row.inspectionName }}222</el-button
							>
						</template>
					</el-table-column>

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
					/>
					<el-table-column
						:show-overflow-tooltip="true"
						align="center"
						min-width="120"
						prop="deviceCode"
						label="设备编号"
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
	<el-dialog
		v-model="levelInfo.recordDialog"
		title="任务明细检查项"
		width="60%"
	>
		<el-col style="display: flex; justify-content: left">
			<el-form-item label="开始时间">
				<el-input
					v-model="detailData.startTime"
					size="small"
					disabled
				></el-input>
			</el-form-item>
			<el-form-item label="结束时间" style="margin: 0 20px">
				<el-input
					v-model="detailData.endTime"
					size="small"
					disabled
				></el-input>
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
			:cell-style="{ padding: '8px' }"
		>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				min-width="120"
				prop="inspectionItemName"
				label="标准名称"
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
	<el-dialog v-model="levelInfo.showItems" title="点巡检" width="60%">
		<el-col style="display: flex; justify-content: left">
			<el-form-item label="名称">
				<el-input
					v-model="detailData.inspectionName"
					size="small"
					disabled
				></el-input>
			</el-form-item>
			<el-form-item label="巡检人" style="margin: 0 20px">
				<el-input
					v-model="detailData.overOperator"
					size="small"
					disabled
				></el-input>
			</el-form-item>
			<el-form-item label="巡检时间" style="margin: 0 20px">
				<el-input
					v-model="detailData.overOperator"
					size="small"
					disabled
				></el-input>
			</el-form-item>
		</el-col>
		<el-table
			class="detailsTable"
			:data="levelInfo.detaiList"
			border
			fit
			highlight-current-row
			empty-text="暂无数据"
			style="width: 100%; font-size: 10px"
			:cell-style="{ padding: '2px' }"
		>
			<el-table-column label="操作" min-width="80" align="center">
				<template v-slot:default="scope">
					<el-button
						type="text"
						size="small"
						@click="showTaskItem(scope.row)"
						>详细</el-button
					>
				</template>
			</el-table-column>
			<el-table-column
				:show-overflow-tooltip="true"
				align="center"
				min-width="120"
				prop="inspectionName"
				label="巡检项目"
			>
				<template #default="scope">
					<div type="text" size="small">
						{{ scope.row.inspectionName }}
					</div>
				</template>
			</el-table-column>
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
	</el-dialog>
	<!-- 新增/修改-->
	<edit
		v-if="levelInfo.editDialog"
		:dialog="levelInfo.editDialog"
		:edit-type="levelInfo.editType"
		:edit-data="levelInfo.editData"
		@closeDialog="closeDialog"
	/>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import api from '../../../api/checkRecord'
import type { levelModule, levelEntity } from '../../../types/checkRecord'
import edit from './edit.vue'
import { ElMessage } from 'element-plus'

const levelInfo = reactive<levelModule>({
	tableDatas: [],
	detaiList: [],
	recordItemData: [],
	recordDialog: false,
	showItems: false,
	inspectionPlanName: '',
	departmentId: '',
	editDialog: false,
	editType: 0,
	editData: {},
	pageNum: 1,
	theight: 345,
	tabelTotal: 0,
    selcetedIndex:0
})

const detailData = reactive({
	inspectionName: '',
	overOperator: '',
	startTime: '',
	endTime: '',
    
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
// 查询标准列表
const stockTableRef = ref()
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

// 点击行查看检查项
const currentRecordId = ref()
const rowClick = (row: any) => {
	currentRecordId.value = row.id
	getRecordData(row.id)
}
const getRecordData = (id: any) => {
	api.apis.getDeatail(id).then((res: any) => {
		levelInfo.detaiList = res.data.data
	})
}
// 显示计划内的项目
const showTask = (row: any) => {
	levelInfo.showItems = true
	detailData.inspectionName = row.inspectionName
	detailData.overOperator = row.overOperator
	// api.apis.getDeatail(row.id).then((res: any) => {
	//     levelInfo.detaiList = res.data.data
	// })
}
// 查询任务明细详情
const showTaskItem = (row: any) => {
	levelInfo.recordDialog = true
	detailData.startTime = row.inspectionStartTime
	detailData.endTime = row.inspectionEndTime
	api.apis.getTaskItem(row.id).then((res: any) => {
		levelInfo.recordItemData = res.data.data
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
