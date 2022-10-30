<template>
	<el-dialog
		:close-on-click-modal="false"
		@close="onCancel"
		v-model="props.dialog"
		title="保养标准"
		width="60%"
		center
	>
		<el-form
			ref="ruleFormRef"
			:inline="true"
			:rules="editRules"
			:model="formData"
			label-width="140px"
			style="text-align: left"
		>
			<el-form-item label="标准名称:" prop="maintenanceName">
				<el-input
					v-model="formData.maintenanceName"
					placeholder="标准名称"
				></el-input>
			</el-form-item>
			<el-form-item label="设备类型:" prop="typeCode">
				<el-select v-model="formData.typeCode" placeholder="设备类型">
					<el-option value="基础设备" key="0">基础设备</el-option>
					<el-option value="办公设备" key="1">办公设备</el-option>
					<el-option value="电梯" key="2">电梯</el-option>
					<el-option value="检测设备" key="3">检测设备</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<el-button
			size="small"
			type="primary"
			@click="addPro"
			style="margin: 20px 20px; float: left"
			>添加项目</el-button
		>
		<el-form :model="formData" ref="formRef">
			<el-table
				class="spareTable"
				:data="formData.list"
				border
				highlight-current-row
				empty-text="暂无数据"
				style="width: 100%"
				:cell-style="{ padding: '0' }"
				:row-style="{ height: '50px' }"
			>
				>
				<el-table-column
					:show-overflow-tooltip="true"
					align="center"
					width="50"
					type="index"
					label="序号"
				/>
				<el-table-column label="操作" width="120" align="center">
					<template v-slot:default="scope">
						<el-button
							type="text"
							size="small"
							@click="removeData(scope.row)"
							>删除</el-button
						>
					</template>
				</el-table-column>
				<el-table-column
					:show-overflow-tooltip="true"
					align="center"
					prop="maintenancePart"
					label="保养部位"
				>
					<template #default="scope">
						<el-form-item
							:prop="'list.' + scope.$index + '.maintenancePart'"
							:rules="{
								required: true,
								message: '',
								trigger: 'blur',
							}"
						>
							<el-input
								v-model="scope.row.maintenancePart"
								@blur=""
							/>
						</el-form-item>
					</template>
				</el-table-column>
				<el-table-column
					:show-overflow-tooltip="true"
					align="center"
					prop="maintenanceStandard"
					label="保养标准"
				>
					<template #default="scope">
						<el-form-item
							:prop="
								'list.' + scope.$index + '.maintenanceStandard'
							"
							:rules="{ required: true }"
						>
							<el-input
								v-model="scope.row.maintenanceStandard"
								@blur=""
							/>
						</el-form-item>
					</template>
				</el-table-column>
			</el-table>
		</el-form>
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
</template>

<script lang="ts" setup>
import type { ElForm } from 'element-plus'
import { reactive, ref, defineEmits, onMounted } from 'vue'
import type {
	levelModule,
	levelEntity,
	proModule,
} from '../../../types/matainStand'
import { ElMessage } from 'element-plus'
import api from '../../../api/matainStand'

// 声明从组件传递的属性
const props = defineProps({
	dialog: {
		type: Boolean,
		default: false,
	},
	editType: {
		type: Number,
		default: 0,
	},
	editData: {
		type: Object,
		default: null,
	},
	proList: {
		type: Array,
		default: [],
	},
})
const dialogVisible = ref(false)
// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog'])

// 声明事件
const editModule = reactive({})

// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>()

// 声明maintenanceName校验规则
// const hasValue = (rule: any, value: any, callback: any) => {
//     if (!value || value.trim() === "") {
//         callback(new Error('请输入单位名称'));
//     } else {
//         if (formData.maintenanceName) {
//             if (!ruleFormRef.value) {
//                 return;
//             }
//         }
//         api.apis.getEntitys({ maintenanceName: value }).then((res: any) => {
//             if (props.editType === 1 && res.data.length > 0) {
//                 callback(new Error("该名称重复,请重新输入!"));
//             } else {
//                 callback();
//             }
//             if (props.editType === 2 && res.data[0].rowId === props.editData.rowId) {
//                 callback();
//             } else {
//                 callback(new Error("该名称重复,请重新输入!"));
//             }
//         });
//     }
// };

// 声明表单校验规则
const editRules = reactive({
	maintenanceName: [
		{
			required: true,
			trigger: 'blur',
			// validator: hasValue
			message: '请输入标准名称',
		},
	],
	typeCode: [
		{
			required: true,
			trigger: 'blur',
			// validator: hasValue
			message: '请选择设备类型',
		},
	],
})

// 声明表单数据
const formData = reactive<levelEntity>({
	list: [],
	maintenanceName: null,
	typeCode: null,
	id: null,
})
const proData = reactive<proModule>({
	maintenancePart: null,
	maintenanceStandard: null,
})
// 初始化方法
onMounted(() => {
	init()
})

// 初始化
const init = () => {
	// 修改
	if (props.editType === 2) {
		for (const key in props.editData) {
			if (Object.prototype.hasOwnProperty.call(props.editData, key)) {
				formData[key] = props.editData[key]
			}
		}
		// // 获取标准对应的项目
		// api.apis.getDeatail(props.editData.id).then((res:any) => {
		//     console.log(res,'resd');

		formData.list = props.proList
		// })
	}
}

// 添加项目
const addPro = () => {
	formData.list.push({
		maintenancePart: proData.maintenancePart,
		maintenanceStandard: proData.maintenanceStandard,
	})
}

// 删除项目
const removeData = (row: any) => {
	// 查找index
	const index = formData.list.findIndex((item: any) => {
		item.inspectionItemName = row.inspectionItemName
	})
	formData.list.splice(index, 1)
}
// 新增或修改数据
const handlerFormData = (formEl: InstanceType<typeof ElForm> | undefined) => {
	if (!formEl) {
		return
	}
	if (formData.list.length === 0) {
		ElMessage.error('请添加项目')
	}
	const isDone = ref(false)
	formData.list.forEach((element: any) => {
		if (element.maintenancePart && element.maintenanceStandard) {
			isDone.value = true
		} else {
			ElMessage.error('请完善项目明细')
		}
	})
	formEl.validate((valid) => {
		if (valid && formData.list.length && isDone.value) {
			if (props.editType === 1) {
				api.apis.add(formData).then((res: any) => {
					if (res.data.code === 1) {
						ElMessage.success('添加成功')
						onCancel()
					}
				})
			} else if (props.editType === 2) {
				api.apis.edit(formData).then((res: any) => {
					if (res.data.code === 1) {
						ElMessage.success('编辑成功')
					}
					onCancel()
				})
			}
		} else {
			return false
		}
	})
}
// 关闭添加项目弹窗
// const onCancelPro =() =>{
//         proData.maintenanceStandard = null
//     proData.maintenancePart = null
// }
// 关闭弹窗
const onCancel = () => {
	emit('closeDialog')
}
</script>

<style lang="scss" scoped>
.spareTable {
	.el-form-item {
		padding: 0;
		margin: 0;
	}
}
</style>
