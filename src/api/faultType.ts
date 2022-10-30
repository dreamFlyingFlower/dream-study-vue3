import { Request } from "../axios/request";

class api {
	/* 故障类型接口模块 */
	public static apis = {
		add: (params: any) => Request.post(`/eam/v1/faultType/add`, params),
		deleteByCode: (rowId: any) => Request.delete(`/eam/v1/faultType/deleteByCode/${rowId}`),
		deleteByCodes: (params: any) => Request.post(`/eam/v1/faultType/deleteByCodes`, params),
		edit: (params: any) => Request.patch(`/eam/v1/faultType/editByCode/${params.typeCode}`, params),
		getEntitys: (params: any) => Request.get("/eam/v1/faultType/getEntitys", params),
		getDeatail: (rowId: any) => Request.get(`/eam/v1/faultType/getById/${rowId}`),
		getList: (params: any) => Request.get("/eam/v1/faultType/list", params),
		hasValue: (params: any) => Request.post(`/eam/v1/faultType/hasValue`, params),
	};
}
export default api;