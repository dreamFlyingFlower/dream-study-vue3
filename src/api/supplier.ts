import { Request } from "../axios/request";

class api {
	/* 供应商接口模块 */
	public static apis = {
		add: (params: any) => Request.post(`/eam/v1/supplier/add`, params),
		deleteById: (rowId: any) => Request.delete(`/eam/v1/supplier/deleteById/${rowId}`),
		deleteByIds: (params: any) => Request.post(`/eam/v1/supplier/deleteByIds`, params),
		edit: (params: any) => Request.patch("/eam/v1/supplier/edit", params),
		getDeatail: (rowId: any) => Request.get(`/eam/v1/supplier/getById/${rowId}`),
		getEntitys: (params: any) => Request.get("/eam/v1/supplier/getEntitys", params),
		getList: (params: any) => Request.get("/eam/v1/supplier/list", params),
		hasValue: (params: any) => Request.post(`/eam/v1/supplier/hasValue`, params),
	};
}
export default api;