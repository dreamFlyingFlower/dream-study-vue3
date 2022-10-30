import { Tree } from '../types/tree';
import type { ElForm } from "element-plus";
import { ElMessage } from "element-plus";

// 解析树形结构,获得typeCode
export function resloveTree(tree: Tree | any) {
	let result: string[] = [];
	recursion(result, [tree]);
	return result.join(",");
}

function recursion(result: string[], tree: Tree[]) {
	if (tree && tree.length > 0) {
		for (const item of tree) {
			result.push(item.typeCode);
			if (item.children && item.children.length > 0) {
				recursion(result, item.children);
			}
		}
	}
}

// 解析树形结构,获得id
export function resloveTreeId(tree: Tree) {
	let result: string[] = [];
	recursionId(result, [tree]);
	return result.join(",");
}

function recursionId(result: string[], tree: Tree[]) {
	if (tree && tree.length > 0) {
		for (const item of tree) {
			result.push(item.id);
			if (item.children && item.children.length > 0) {
				recursionId(result, item.children);
			}
		}
	}
}

/**
 * 根据主键检查字段值是否重复
 * 
 * @param formData 表单数据
 * @param key 需要校验的字段名
 * @param editType 新增或编辑.1->编辑;2->新增
 * @param editData 编辑的数据,新增时为null
 * @param api 用于检验的API接口
 * @param rule ElementUI检验规则
 * @param value ElementUI当前表单中输入的值
 * @param callback 回调
 * @returns 值重复时返回错误
 */
export function checkHasValue(formData: any, key: string, editType: number, editData: any, api: any,
	rule: any, value: any, callback: any) {
	if (!value || value.trim() === "") {
		callback(new Error('该值不能为空,请重新输入'));
		return false;
	} else {
		let param: any = {};
		param[key] = value;
		api.apis.getList(param).then((res: any) => {
			if (!res.data || res.data.length === 0) {
				callback();
			} else {
				if (editType === 1) {
					callback(new Error(rule.tip ? rule.tip : "当前值重复,请重新输入"));
				} else if (editType === 2) {
					if (res.data[0].rowId === editData.rowId) {
						callback();
					} else {
						callback(new Error(rule.tip ? rule.tip : "当前值重复,请重新输入"));
					}
				} else {
					ElMessage("编辑类型错误");
					return;
				}
			}
		});
	}
}

/**
 * 根据主键检查字段值是否重复
 * 
 * @param formData 表单数据
 * @param key 需要校验的字段名
 * @param editType 新增或编辑.1->编辑;2->新增
 * @param editData 编辑的数据,新增时为null
 * @param api 用于检验的API接口
 * @param rule ElementUI检验规则
 * @param value ElementUI当前表单中输入的值
 * @param callback 回调
 * @returns 值重复时返回错误
 */
export function checkHasValueId(formData: any, key: string, editType: number, editData: any, api: any,
	rule: any, value: any, callback: any) {
	if (!value || value.trim() === "") {
		callback(new Error('该值不能为空,请重新输入'));
	} else {
		let param: any = {};
		param[key] = value;
		api.apis.getList(param).then((res: any) => {
			if (!res.data || res.data.length === 0) {
				callback();
			} else {
				if (editType === 1) {
					callback(new Error(rule.tip ? rule.tip : "当前值重复,请重新输入"));
				} else if (editType === 2) {
					if (res.data[0].id === editData.id) {
						callback();
					} else {
						callback(new Error(rule.tip ? rule.tip : "当前值重复,请重新输入"));
					}
				} else {
					ElMessage("编辑类型错误");
					return;
				}
			}
		});
	}
}

/**
 * 校验邮箱格式
 * @param rule 校验规则
 * @param value 当前值
 * @param callback 回调
 * @returns 无
 */
export function checkFormEmail(rule: any, value: any, callback: any) {
	if (rule.required) {
		if (!value || value.trim() === "") {
			callback(new Error('该值不能为空,请重新输入'));
			return;
		}
	}
	if (value && value.trim() !== "") {
		let flag = value.match("\\w[-\\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\\.)+[A-Za-z]+");
		if (flag) {
			callback();
		} else {
			callback(new Error(rule.tip ? rule.tip : "格式错误,请重新输入"));
		}
	} else {
		callback();
	}
}

/**
 * 校验手机号格式
 * @param rule 校验规则
 * @param value 当前值
 * @param callback 回调
 * @returns 无
 */
export function checkFormPhone(rule: any, value: any, callback: any) {
	if (rule.required) {
		if (!value || value.trim() === "") {
			callback(new Error('该值不能为空,请重新输入'));
			return;
		}
	}
	if (value && value.trim() !== "") {
		let flag = value.match("^(1[0-9][0-9])\\d{8}$");
		if (flag) {
			callback();
		} else {
			callback(new Error(rule.tip ? rule.tip : "格式错误,请重新输入"));
		}
	} else {
		callback();
	}
}

/**
 * 表单数据提交
 * @param formEl 表单验证对象
 * @param formData 提交的数据
 * @param editType 新增或修改.1->新增;2->修改
 * @param api 方法调用
 * @param postProcessor 回调方法
 * @returns 
 */
export function handlerFormData(formEl: InstanceType<typeof ElForm> | undefined, formData: any
	, editType: number, api: any, callback: Function) {
	if (!formEl) {
		return;
	}
	formEl.validate((valid) => {
		if (valid) {
			if (editType === 1) {
				api.apis.add(formData).then((res: any) => {
					callback();
				});
			} else if (editType === 2) {
				api.apis.edit(formData).then((res: any) => {
					callback();
				});
			}
		} else {
			console.log('error submit!');
			return false;
		}
	})
}

/**
 * 将数据中值进行字典转换
 * @param res 需要修改的数据集合
 * @param options 多个字典集合
 * @param columns 要修改的字段集合,要和options的字典列表一一对应
 * @returns 修改后的数据
 */
export function transDictValue(res: Array<any>, options: Array<Array<any>>, columns: Array<any>) {
	if (options && options.length > 0) {
		for (let i = 0; i < columns.length; i++) {
			res.forEach((item, index) => {
				if (options[i] && options[i].length > 0) {
					options[i].forEach((option) => {
						if (option.dictItemKey === item[columns[i]]) {
							res[index][columns[i] + '_CN'] = option.dictItemValue;
						}
					})
				}
			})
		}
		return res;
	}
}

/**
 * 将数据中值根据数据集和转换
 * @param res 待转换的数据列表
 * @param columns res要转换的字段集合,要和options的字典列表一一对应
 * @param options 多个数据集合
 * @param optionsColumns 多个数据集合中与columns对应的字段
 * @param optionsVals 多个数据集合中取值的字段
 * @returns 修改后的数据
 */
export function transValue(res: Array<any>, columns: Array<any>, options: Array<Array<any>>, optionsColumns: Array<any>
	, optionsVals: Array<any>) {
	if (!options || options.length === 0) {
		return;
	}
	// 装载多个数据集合的optionsColumns和值的Map
	let optionsMap: any = {};
	for (let index = 0; index < optionsColumns.length; index++) {
		let option: any = options[index];
		let optionMap: any = {};
		option.forEach((item: any) => {
			optionMap[item[optionsColumns[index]]] = item[optionsVals[index]];
		});
		// 防止多个数组集合中的取值字段相同
		optionsMap[columns[index] + "_" + optionsColumns[index]] = optionMap;
	}
	for (let i = 0; i < columns.length; i++) {
		res.forEach((item, index) => {
			res[index][columns[i] + '_CN'] = optionsMap[columns[i] + "_" + optionsColumns[i]][item[columns[i]]];
		})
	}
	return res;
}