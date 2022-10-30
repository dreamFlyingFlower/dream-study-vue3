import { Request } from "../axios/request";

class api {
	/* 设备类型接口模块 */
	public static apis = {
		add: (params: any) => Request.post(`/eam/v1/deviceType/add`, params),
		deleteByCode: (rowId: any) => Request.delete(`/eam/v1/deviceType/deleteByCode/${rowId}`),
		deleteByCodes: (params: any) => Request.post(`/eam/v1/deviceType/deleteByCodes`, params),
		edit: (params: any) => Request.patch("/eam/v1/deviceType/updateByCode", params),
		getDeatail: (rowId: any) => Request.get(`/eam/v1/deviceType/getById/${rowId}`),
		getEntitys: (params: any) => Request.get("/eam/v1/deviceType/getEntitys", params),
		getList: (params: any) => Request.get("/eam/v1/deviceType/list", params),
		hasValue: (params: any) => Request.post(`/eam/v1/deviceType/hasValue`, params),
	};
}
export default api;