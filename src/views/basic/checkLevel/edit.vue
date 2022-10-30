<template>
<div style="width: 100%;height: 100%;">
    <el-dialog
        :close-on-click-modal="false"
        @close="onCancel"
        v-model="props.dialog"
        title="巡检标准"
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
            <el-form-item label="标准名称:" prop="inspectionName">
                <el-input v-model="formData.inspectionName" placeholder="标准名称"></el-input>
            </el-form-item>
            <el-form-item label="设备类型:" prop="typeCode">
                <el-select v-model="formData.typeCode" placeholder="设备类型">
                    <el-option value="基础设备" key="0">基础设备</el-option>
                    <el-option value="办公设备" key="1">办公设备</el-option>
                    <el-option value="电梯" key="2">电梯</el-option>
                    <el-option value="检测设备" key="3">检测设备</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="巡检目的:" style="width: 85%">
                <el-input v-model="formData.inspectionPurpose" type="textarea" placeholder="巡检目的"></el-input>
            </el-form-item>
            <el-form-item label="备注:" style="width: 85%">
                <el-input v-model="formData.remark" type="textarea"></el-input>
            </el-form-item>
        </el-form>
        <el-button size="small" type="primary" @click="dialogVisible = true" style="margin-bottom: 10px;">添加项目</el-button>
        <el-table
            class="spareTable"
            :data="formData.inspectStandardDetailDtos"
            border
            fit
            highlight-current-row
            empty-text="暂无数据"
                 style="width: 100%; font-size: 10px"
            :cell-style="{ padding: '4px' }"
        >
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                width="50"
                type="index"
                label="序号"
            />
            <!-- <el-table-column type="selection" width="45" align="center" /> -->
            <el-table-column label="操作" min-width="80" align="center">
                <template v-slot:default="scope">
                    <el-button type="text" size="small" @click="showDialog(scope.row)">编辑</el-button>
                    <!-- @click="openuserrDialog(scope.row, 1)"  @click="delRole(scope.row)"-->
                    <el-button type="text" size="small" @click="removeData(scope.row)">删除</el-button>
                </template>
            </el-table-column>
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="inspectionItemName"
                label="检查项"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="recordType"
                label="结果类型"
            />
            <el-table-column
                :show-overflow-tooltip="true"
                align="center"
                prop="reference"
                label="结果选项"
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
                prop="defaultValue"
                label="默认值"
            />
        </el-table>

        <template #footer>
            <span class="dialog-footer">
                <el-button type="primary" @click="handlerFormData(ruleFormRef)">确定</el-button>
                <!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
                <el-button @click="onCancel">取消</el-button>
            </span>
        </template>
    </el-dialog>
            <el-dialog v-model="dialogVisible" :title="isEditePro ? '编辑项目' : '添加项目'" width="60%">
            <el-form
                ref="formRef"
                :inline="true"
                :rules="editRules"
                :model="proData"
                label-width="160px"
            >
                <el-col style="width: 100%;display: flex;" >

                <el-form-item label="项目名称:" prop="inspectionItemName">
                    <el-input v-model="proData.inspectionItemName" placeholder="项目名称"></el-input>
                </el-form-item>
                <el-form-item label="记录方式:">
                    <el-select v-model="proData.recordType" placeholder="记录方式">
                        <el-option value="单选" key="0">单选</el-option>
                        <el-option value="多选" key="1">多选</el-option>
                        <el-option value="数字" key="2">数字</el-option>
                        <el-option value="文本" key="3">文本</el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col style="width: 100%;display: flex;" >

                <el-form-item
                    label="正常值:"
                    prop="normal"
                    v-if="proData.recordType === '单选' || proData.recordType === '多选'"
                >
                    <el-input v-model="proData.normal" placeholder="正常值"  type="textarea"></el-input>
                </el-form-item>
                <el-form-item
                    label="异常值:"
                    prop="wrong"
                    v-if="proData.recordType === '单选' || proData.recordType === '多选'"
                >
                    <el-input v-model="proData.wrong" type="textarea" placeholder="异常值" ></el-input>
                </el-form-item>
                <el-form-item label="上限:" v-if="proData.recordType === '数字'">
                    <el-input v-model="proData.upperLimit" placeholder="上限"></el-input>
                </el-form-item>
                <el-form-item label="下限:" v-if="proData.recordType === '数字'">
                    <el-input v-model="proData.lowerLimit" placeholder="下限"></el-input>
                </el-form-item>
                </el-col>
                <el-col style="width: 100%;display: flex;" >
                <el-form-item label="默认值:">
                    <el-input v-model="proData.defaultValue" type="默认值"></el-input>
                </el-form-item>
                </el-col>
            </el-form>
                <span class="dialog-footer">
                    <el-button type="primary" @click="addPro(formRef)">确定</el-button>
                    <!-- <el-button @click="$emit('closeDialog')">取消</el-button> -->
                    <el-button @click="onCancelPro">取消</el-button>
                </span>
        </el-dialog>
</div>

</template>

<script lang="ts" setup>
import type { ElForm } from "element-plus";
import { reactive, ref, defineEmits, onMounted } from "vue";
import type { levelModule, levelEntity, proModule } from "../../../types/checkLevel";
import { ElMessage } from 'element-plus'
import api from "../../../api/checkLevel";

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
const dialogVisible = ref(false)
const isEditePro = ref(false)
// 声明从父组件传递的方法
const emit = defineEmits(['closeDialog']);

// 声明事件
const editModule = reactive({
});

// 声明表单校验
const ruleFormRef = ref<InstanceType<typeof ElForm>>();
const formRef = ref<InstanceType<typeof ElForm>>();
// 声明supplierName校验规则
// const hasValue = (rule: any, value: any, callback: any) => {
//     if (!value || value.trim() === "") {
//         callback(new Error('请输入单位名称'));
//     } else {
//         if (formData.inspectionName) {
//             if (!ruleFormRef.value) {
//                 return;
//             }
//         }
//         api.apis.getEntitys({ supplierName: value }).then((res: any) => {
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
    inspectionName: [{required: true,trigger: "blur", message:'请输入项目名称'}],
    typeCode: [{required: true,trigger: "blur", message:'请选择设备类型'}],
    inspectionItemName:[{required: true,trigger: "blur", message:'请输入标准名称'}],
    wrong:[{required: true,trigger: "blur", message:'请输入异常值'}],
    normal:[{required: true,trigger: "blur", message:'请输入正常值'}],
});

// 声明表单数据
const formData = reactive<levelEntity>({
    inspectStandardDetailDtos: [],
    rowId: null,
    inspectionName: null,
    typeCode: null,
    typeName: null,
    inspectionPurpose: null,
    remark: null,
    total:null
});
const proData = reactive<proModule>({
    inspectionItemName: null,
    defaultValue: null,
    lowerLimit: null,
    upperLimit: null,
    normal:null,
    wrong:null,
    recordType: '单选',
    id: null
})
// 初始化方法
onMounted(() => {
    init();
});

// 初始化
const init = () => {
    // 修改
    if (props.editType === 2) {
        for (const key in props.editData) {
            if (Object.prototype.hasOwnProperty.call(props.editData, key)) {
                formData[key] = props.editData[key];
            }
        }
        // 获取标准对应的项目
        api.apis.getDeatail({ id: props.editData.id }).then((res: any) => {
            console.log(res);

            formData.inspectStandardDetailDtos = res.data
        })
    }
}

// 添加项目
const addPro = (formEl: InstanceType<typeof ElForm> | undefined) => {
        if (!formEl) {
        return;
    }
     formEl.validate((valid) => {
         if (valid) {
                 const index = formData.inspectStandardDetailDtos.findIndex((item: any) => {
        return item.inspectionItemName === proData.inspectionItemName
    })
    // 判断是编辑还是新增
    // 判断同名项目是否存在
    console.log(
        proData,'ppp'
    );
            const reference = ref()
        if( proData.normal && proData.wrong ){

         reference.value = proData.normal.replace(/\n/g,',').split(',').join('/') +':'+ proData.wrong.replace(/\n/g,',').split(',').join('/') 
        }else{
            reference.value = null
        }
    if (isEditePro.value === false) {
        if (index === -1) {
            formData.inspectStandardDetailDtos.push({
                inspectionItemName: proData.inspectionItemName,
                defaultValue: proData.defaultValue,
                lowerLimit: proData.lowerLimit,
                upperLimit: proData.upperLimit,
                recordType: proData.recordType,
                reference: reference.value
            })
        } else {
            ElMessage.error('项目名称重复')
            return
        }
    } else {
        formData.inspectStandardDetailDtos.forEach((element: any) => {
            if (element.id === proData.id) {
                element.inspectionItemName = proData.inspectionItemName,
                    element.defaultValue = proData.defaultValue,
                    element.lowerLimit = proData.lowerLimit,
                    element.upperLimit = proData.upperLimit,
                    element.recordType = proData.recordType,
                    element.reference = reference.value
            }
        })
    }
    proData.id = null
    proData.inspectionItemName = null
    proData.inspectionItemName = null
    proData.defaultValue = null
    proData.lowerLimit = null
    proData.normal = null
    proData.wrong = null
    proData.upperLimit = null
    proData.recordType = '单选'
    dialogVisible.value = false
    isEditePro.value = false
         }
     })
}

const showDialog = (editData: any) => {
    dialogVisible.value = true
    isEditePro.value = true
    proData.inspectionItemName = editData.inspectionItemName
    proData.defaultValue = editData.defaultValue
    proData.lowerLimit = editData.lowerLimit
    proData.upperLimit = editData.upperLimit
    proData.recordType = editData.recordType
    proData.normal = editData.reference.split(':')[0].split('/').join('\n')
    proData.wrong = editData.reference.split(':')[1].split('/').join('\n')
    proData.id = editData.id ? editData.id : null
}

// 删除项目
const removeData = (row: any) => {
    // 查找index
    console.log(row.inspectionItemName, 'row');
    console.log(formData.inspectStandardDetailDtos);


    formData.inspectStandardDetailDtos.forEach((item: any, index: any) => {
        if (item.inspectionItemName === row.inspectionItemName) {
            formData.inspectStandardDetailDtos.splice(index, 1)
            console.log(index, 'index');
        }
    })

};
// 新增或修改数据
const handlerFormData = (formEl: InstanceType<typeof ElForm> | undefined) => {
    if (!formEl) {
        return;
    }
    if (formData.inspectStandardDetailDtos.length === 0) {
        ElMessage.error('请添加项目')
    }
    formData.total = formData.inspectStandardDetailDtos.length
    formEl.validate((valid) => {
        if (valid && formData.inspectStandardDetailDtos.length) {
            if (props.editType === 1) {
                console.log(formData, 'form');

                api.apis.add(formData).then((res: any) => {
                    onCancel();
                });
            } else if (props.editType === 2) {
                api.apis.edit(formData).then((res: any) => {
                    onCancel();
                });
            }
        } else {
            console.log('error submit!');
            return false;
        }
    })
};
// 关闭添加项目弹窗
const onCancelPro = () => {
    dialogVisible.value = false
    proData.inspectionItemName = null
    proData.defaultValue = null
    proData.lowerLimit = null
    proData.upperLimit = null
    proData.recordType = '单选'
    dialogVisible.value = false
}
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
